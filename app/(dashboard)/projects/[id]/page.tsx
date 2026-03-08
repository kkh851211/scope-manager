import { createClient } from '@/lib/supabase/server';
import ProjectDetailClient from "./ProjectDetailClient";
import { redirect } from 'next/navigation';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 1. 프로젝트 정보 조회
    const { data: projectData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (projErr || !projectData) {
        return <div className="p-8">프로젝트를 찾을 수 없습니다.</div>;
    }

    // 2. 계약 기능 목록 조회 (새로 추가된 테이블)
    const { data: featuresData } = await supabase
        .from('contract_features')
        .select('*')
        .eq('project_id', id)
        .order('sort_order', { ascending: true });

    // 3. 최근 판단 기록 조회
    const { data: judgmentsData } = await supabase
        .from('scope_judgments')
        .select(`
            *,
            requests!inner (
                content,
                project_id
            )
        `)
        .eq('requests.project_id', id)
        .order('created_at', { ascending: false })
        .limit(20);

    const mappedHistory = (judgmentsData || []).map((item: any) => {
        let resultLabel: "범위 내" | "범위 외" | "경계" = "경계";
        if (item.result === "in_scope") resultLabel = "범위 내";
        else if (item.result === "out_of_scope") resultLabel = "범위 외";

        return {
            id: item.id,
            date: new Date(item.created_at).toLocaleDateString(),
            request: item.requests?.content || "-",
            result: resultLabel,
            confidence: (item.confidence_score || 0) / 100,
        };
    });

    return (
        <ProjectDetailClient
            project={projectData}
            features={featuresData || []}
            judgmentHistory={mappedHistory}
        />
    );
}
