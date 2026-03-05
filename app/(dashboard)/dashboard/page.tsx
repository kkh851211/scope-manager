import { createClient } from '@supabase/supabase-js';
import DashboardClient from "./DashboardClient";
import { StatusType } from "@/components/common/StatusBadge";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. 전체 프로젝트 수 (projects 테이블 count)
    const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

    // 2. 이번 달 판단 수 (scope_judgments 테이블 이번 달 count)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count: thisMonthJudgments } = await supabase
        .from('scope_judgments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth);

    // 3. 범위 외 비율 (OUT_OF_SCOPE 비율 계산)
    const { count: totalJudgments } = await supabase
        .from('scope_judgments')
        .select('*', { count: 'exact', head: true });

    const { count: outOfScopeJudgments } = await supabase
        .from('scope_judgments')
        .select('*', { count: 'exact', head: true })
        .eq('result', 'OUT_OF_SCOPE');

    const outOfScopeRate = totalJudgments && outOfScopeJudgments
        ? Math.round((outOfScopeJudgments / totalJudgments) * 100)
        : 0;

    const summaryData = {
        totalProjects: totalProjects || 0,
        thisMonthJudgments: thisMonthJudgments || 0,
        outOfScopeRate,
    };

    // 4. 최근 판단 5개 (scope_judgments + requests join 조회)
    // requests 테이블과 조인하여 프로젝트명과 요청 내용을 가져온다.
    // projects 테이블도 조인해야 프로젝트 명을 알 수 있음.
    const { data: recentJudgmentsData, error } = await supabase
        .from('scope_judgments')
        .select(`
            id,
            result,
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
