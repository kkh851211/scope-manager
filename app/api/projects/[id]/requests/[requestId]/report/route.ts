import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    const { id: projectId, requestId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 이미 생성된 리포트가 있는지 확인
        const { data: existingReport, error } = await supabase
            .from('reports')
            .select('*')
            .eq('request_id', requestId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) throw error;
        if (existingReport) {
            return NextResponse.json(existingReport);
        }

        return NextResponse.json({ message: 'No report found' }, { status: 404 });
    } catch (error: any) {
        console.error('Error in GET /api/report:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    const { id: projectId, requestId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. 중복 체크
        const { data: existingReport } = await supabase
            .from('reports')
            .select('id, report_data')
            .eq('request_id', requestId)
            .single();

        if (existingReport) {
            return NextResponse.json(existingReport, { status: 200 });
        }

        // 2. 데이터 취합 (프로젝트, 요청, 판정 결과)
        const [projectRes, requestRes, featuresRes] = await Promise.all([
            supabase.from('projects').select('name, client_name').eq('id', projectId).single(),
            supabase.from('requests').select('content').eq('id', requestId).single(),
            supabase.from('scope_judgments').select('*').eq('request_id', requestId).single(),
        ]);

        if (projectRes.error) throw projectRes.error;
        if (requestRes.error) throw requestRes.error;
        if (featuresRes.error) throw featuresRes.error;

        // 3. 계약 범위 조회
        const { data: features } = await supabase
            .from('contract_features')
            .select('feature_name, detail_work, estimated_days')
            .eq('project_id', projectId)
            .order('sort_order', { ascending: true });

        const project = projectRes.data as { name: string; client_name: string };
        const requestData = requestRes.data as { content: string };
        const judgment = featuresRes.data as { result: string; reasoning: string; recommendation: string };

        // 4. 리포트 ID 생성
        const initialReportData = {
            project_name: project.name,
            client_name: project.client_name,
            request_content: requestData.content,
            judgment_result: judgment.result,
            reasoning: judgment.reasoning,
            contract_features: features || [],
            created_at: new Date().toISOString().split('T')[0],
            recommendation: judgment.recommendation,
            report_url: ""
        };

        const { data: newReport, error: insertError } = await supabase
            .from('reports')
            .insert({
                project_id: projectId,
                request_id: requestId,
                user_id: user.id,
                report_data: initialReportData,
                is_public: true
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // 5. report_url 업데이트 (id 포함)
        const reportUrl = `/report/${newReport.id}`;
        const updatedReportData = {
            ...initialReportData,
            report_url: reportUrl
        };

        const { data: finalReport, error: updateError } = await supabase
            .from('reports')
            .update({ report_data: updatedReportData })
            .eq('id', newReport.id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json(finalReport, { status: 201 });

    } catch (error: any) {
        console.error('Error in POST /api/report:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
