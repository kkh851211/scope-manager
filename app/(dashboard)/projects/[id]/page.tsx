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

    // 2. 최근 계약 범위 조회
    const { data: contractData } = await supabase
        .from('contracts')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    const scopeText = contractData ? contractData.content : "등록된 계약 내용이 없습니다.";

    // 3. 최근 5개 판단 기록
    const { data: judgmentsData } = await supabase
        .from('scope_judgments')
        .select(`
            *,
            requests:request_id (
                content
            )
        `)
        .eq('requests.project_id', id)
        .order('created_at', { ascending: false })
        .limit(5);

    // Filter out judgments where the joined request doesn't match the project
    // (Supabase inner join vs left join behavior handling)
    const validJudgments = (judgmentsData || []).filter((j: any) => j.requests != null);

    const mappedHistory = validJudgments.map((item: any) => {
        let resultLabel = "경계";
        if (item.result === "in_scope") resultLabel = "범위 내";
        if (item.result === "out_of_scope") resultLabel = "범위 외";

        return {
            id: item.id,
            date: new Date(item.created_at).toISOString().split('T')[0],
            request: item.requests.content,
            result: resultLabel as "범위 내" | "범위 외" | "경계",
            confidence: item.confidence_score / 100, // DB has 0-100, original UI showed it as 0-1 ratio
        };
    });

    const projectViewModel = {
        id: projectData.id,
        name: projectData.name,
        client: projectData.client_name,
        status: projectData.status === 'active' ? '진행중' : '완료',
        scopeText: scopeText
    };

    return <ProjectDetailClient project={projectViewModel} judgmentHistory={mappedHistory} />;
}
