import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { claude } from '@/lib/claude/client';
import { buildScopeJudgePrompt } from '@/lib/claude/prompts';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('requests')
            .select(`
                *,
                scope_judgments (*)
            `)
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .order('requested_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`Error in GET /api/projects/${projectId}/requests:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, content, channel, requested_at, requester_name } = body;

        // 1. 요청(requests) 테이블에 INSERT (상태: 'pending')
        const { data: newRequest, error: requestError } = await (supabase
            .from('requests')
            .insert({
                project_id: projectId,
                user_id: user.id,
                title: title || content.substring(0, 50),
                content,
                channel,
                requested_at: requested_at || new Date().toISOString().split('T')[0], // date 타입에 맞춰 포맷
                requester_name,
                status: 'pending'
            } as any)
            .select()
            .single() as any);

        if (requestError) throw requestError;

        // 2. 해당 프로젝트의 contract_features 조회
        const { data: contractFeatures, error: featuresError } = await supabase
            .from('contract_features')
            .select('feature_name, detail_work, estimated_days')
            .eq('project_id', projectId);

        if (featuresError) throw featuresError;

        const contractContent = (contractFeatures as any)?.length > 0
            ? (contractFeatures as any).map((f: any) => `- ${f.feature_name}: ${f.detail_work || ''} (${f.estimated_days}일)`).join('\n')
            : "등록된 계약 범위가 없습니다.";

        // 3. Claude API 호출 (temperature 0.2)
        const systemPrompt = `당신은 웹 에이전시의 프로젝트 범위 판정 전문가입니다.
계약된 기능 목록과 클라이언트의 추가 요구를 비교하여
범위 초과 여부를 판정합니다.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "result": "in_scope" | "out_of_scope" | "needs_review",
  "reasoning": "판정 근거 (한국어, 2~3문장)",
  "confidence_score": 0~100,
  "recommendation": "PM 권고사항 (한국어 1문장)"
}`;

        const userPrompt = `계약 범위: [${contractContent}]
추가 요구: [${content}]`;

        const claudeResponse = await claude.messages.create({
            model: 'claude-sonnet-4-20250514',
            system: systemPrompt,
            max_tokens: 1000,
            temperature: 0.2, // 요청사항: 0.2
            messages: [{ role: 'user', content: userPrompt }],
        });

        const textContent = claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : '';
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Failed to parse AI response');

        const aiResult = JSON.parse(jsonMatch[0]);

        // DB Enum 매핑 (needs_review -> unclear)
        const dbResult = aiResult.result === 'needs_review' ? 'unclear' : aiResult.result;

        // 4. scope_judgments 테이블에 판정 결과 INSERT
        const { error: judgmentError } = await (supabase
            .from('scope_judgments')
            .insert({
                request_id: newRequest.id,
                user_id: user.id,
                result: dbResult,
                reasoning: aiResult.reasoning,
                confidence_score: aiResult.confidence_score,
                recommendation: aiResult.recommendation,
                model_used: 'claude-3-5-sonnet-latest'
            } as any) as any);

        if (judgmentError) throw judgmentError;

        // 5. requests 테이블 status 업데이트
        const { error: updateError } = await (supabase
            .from('requests')
            .update({ status: 'judged' } as any)
            .eq('id', newRequest.id) as any);

        if (updateError) throw updateError;

        // 6. 전체 결과 반환
        return NextResponse.json({
            ...(newRequest as any),
            status: 'judged',
            judgment: aiResult
        }, { status: 201 });

    } catch (error: any) {
        console.error(`Error in POST /api/projects/${projectId}/requests:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
