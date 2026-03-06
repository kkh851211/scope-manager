import { createClient } from '@/lib/supabase/server';
import DashboardClient from "./DashboardClient";
import { StatusType } from "@/components/common/StatusBadge";
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 1. 전체 프로젝트 수 (projects 테이블 count)
    const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    // 2. 이번 달 판단 수 (scope_judgments 테이블 이번 달 count)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count: thisMonthJudgments } = await supabase
        .from('scope_judgments')
        .select('*, requests!inner(projects!inner(user_id))', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth)
        .eq('requests.projects.user_id', user.id);

    // 3. 범위 외 비율 (OUT_OF_SCOPE 비율 계산)
    const { count: totalJudgments } = await supabase
        .from('scope_judgments')
        .select('*, requests!inner(projects!inner(user_id))', { count: 'exact', head: true })
        .eq('requests.projects.user_id', user.id);

    const { count: outOfScopeJudgments } = await supabase
        .from('scope_judgments')
        .select('*, requests!inner(projects!inner(user_id))', { count: 'exact', head: true })
        .eq('result', 'OUT_OF_SCOPE')
        .eq('requests.projects.user_id', user.id);

    const outOfScopeRate = totalJudgments && outOfScopeJudgments
        ? Math.round((outOfScopeJudgments / totalJudgments) * 100)
        : 0;

    const summaryData = {
        totalProjects: totalProjects || 0,
        thisMonthJudgments: thisMonthJudgments || 0,
        outOfScopeRate,
    };

    // 4. 최근 판단 5개 (scope_judgments + requests join 조회)
    const { data: recentJudgmentsData, error } = await supabase
        .from('scope_judgments')
        .select(`
            id,
            result,
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
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching recent judgments:", error);
    }

    const formattedRecentJudgments = (recentJudgmentsData || []).map((item: any) => ({
        id: item.id,
        projectName: item.requests?.projects?.name || '알 수 없음',
        requestContent: item.requests?.content || '-',
        status: item.result as StatusType,
        date: new Date(item.created_at).toISOString().split('T')[0],
    }));

    return <DashboardClient summaryData={summaryData} recentJudgments={formattedRecentJudgments} />;
}
