import { createClient } from '@/lib/supabase/server';
import ProjectsClient from "./ProjectsClient";
import { ProjectCardProps } from "@/components/projects/ProjectCard";
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
            created_at,
            requests (
                id,
                scope_judgments (
                    created_at
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
    }

    const projects: ProjectCardProps[] = (projectsData || []).map((p: any) => {
        // Calculate total requests and latest judgment date from joined info
        const reqs = p.requests || [];
        const totalReqs = reqs.length;

        // extract all judgment dates
        let latestDateStr = "";
        let maxTime = 0;

        reqs.forEach((r: any) => {
            const judgements = r.scope_judgments || [];
            if (Array.isArray(judgements)) {
                judgements.forEach((j: any) => {
                    const dt = new Date(j.created_at).getTime();
                    if (dt > maxTime) {
                        maxTime = dt;
                        latestDateStr = j.created_at;
                    }
                });
            } else if (judgements && judgements.created_at) {
                // if it's not an array
                const dt = new Date(judgements.created_at).getTime();
                if (dt > maxTime) {
                    maxTime = dt;
                    latestDateStr = judgements.created_at;
                }
            }
        });

        // if no judgments, format created_at date initially
        if (!latestDateStr) {
            latestDateStr = p.created_at || new Date().toISOString();
        }

        return {
            id: p.id,
            name: p.name,
            clientName: p.client_name || '-',
            // mapping DB status to UI status if needed
            status: p.status === 'completed' ? 'COMPLETED' : 'IN_PROGRESS',
            totalRequests: totalReqs,
            lastJudgmentDate: new Date(latestDateStr).toISOString().split('T')[0],
        };
    });

    return <ProjectsClient projects={projects} />;
}
