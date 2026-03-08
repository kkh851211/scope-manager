import { createClient } from '@/lib/supabase/server';
import ProjectsClient from "./ProjectsClient";
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export interface ProjectListUIItem {
    id: string;
    name: string;
    client: string;
    startDate: string;
    endDate: string;
    status: "진행중" | "완료" | "보류";
    contractAmount: string;
    workDays: number;
    scopeExceededCount: number;
}

export default async function ProjectsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
            id,
            name,
            client_name,
            status,
            start_date,
            end_date,
            contract_amount,
            ai_estimated_days,
            created_at,
            requests (
                id,
                scope_judgments (
                    result,
                    created_at
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
    }

    const projects: ProjectListUIItem[] = (projectsData || []).map((p: any) => {
        // Calculate scope exceeded count
        const reqs = p.requests || [];
        let exceededCount = 0;
        reqs.forEach((r: any) => {
            const judgements = r.scope_judgments || [];
            if (Array.isArray(judgements)) {
                judgements.forEach((j: any) => {
                    if (j.result === 'out_of_scope') exceededCount++;
                });
            } else if (judgements && judgements.result === 'out_of_scope') {
                exceededCount++;
            }
        });

        // UI status
        let uiStatus: "진행중" | "완료" | "보류" = "진행중";
        if (p.status === 'completed') uiStatus = "완료";
        else if (p.status === 'paused') uiStatus = "보류";

        // Date format (YYYY-MM-DD)
        const formatDt = (dtStr: string) => dtStr ? dtStr.split('T')[0] : '-';

        return {
            id: p.id,
            name: p.name,
            client: p.client_name || '-',
            startDate: formatDt(p.start_date || p.created_at),
            endDate: formatDt(p.end_date || p.created_at),
            status: uiStatus,
            contractAmount: p.contract_amount ? p.contract_amount.toLocaleString() + '원' : '-',
            workDays: p.ai_estimated_days || 0,
            scopeExceededCount: exceededCount,
        };
    });

    return <ProjectsClient initialProjects={projects} />;
}
