import { createClient } from '@/lib/supabase/server';
import HistoryClient, { HistoryItem, Judgment } from "./HistoryClient";
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: judgmentsData, error } = await supabase
        .from('scope_judgments')
        .select(`
            id,
            result,
            confidence_score,
            reasoning,
            recommendation,
            created_at,
            requests!inner (
                id,
                content,
                projects!inner (
                    id,
                    name
                )
            )
        `)
        .eq('requests.projects.user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching history:", error);
    }

    const historyData: HistoryItem[] = (judgmentsData || []).map((item: any) => ({
        id: item.id,
        date: new Date(item.created_at).toISOString().split('T')[0],
        projectName: item.requests?.projects?.name || '알 수 없음',
        request: item.requests?.content || '',
        judgment: (item.result || '').toUpperCase() as Judgment,
        confidence: item.confidence_score || 0,
        reason: item.reasoning || '',
        suggestion: item.recommendation || '',
    }));

    return <HistoryClient historyData={historyData} />;
}
