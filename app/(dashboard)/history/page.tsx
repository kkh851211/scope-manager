import { createClient } from '@supabase/supabase-js';
import HistoryClient, { HistoryItem, Judgment } from "./HistoryClient";

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: judgmentsData, error } = await supabase
        .from('scope_judgments')
        .select(`
            id,
            result,
            confidence_score,
            reasoning,
            recommendation,
            created_at,
            requests (
                id,
                content,
                projects (
                    id,
                    name
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching history:", error);
    }

    const historyData: HistoryItem[] = (judgmentsData || []).map((item: any) => ({
        id: item.id,
        date: new Date(item.created_at).toISOString().split('T')[0],
        projectName: item.requests?.projects?.name || '알 수 없음',
        request: item.requests?.content || '',
        judgment: item.result as Judgment,
        confidence: item.confidence_score ? Math.round(item.confidence_score * 100) : 0,
        reason: item.reasoning || '',
        suggestion: item.recommendation || '',
    }));

    return <HistoryClient historyData={historyData} />;
}
