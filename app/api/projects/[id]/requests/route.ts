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

        // 1. 계약 범위(features) 가져오기
        const { data: features, error: featuresError } = await supabase
            .from('contract_features')
            .select('feature_name, detail_work, estimated_days')
            .eq('project_id', projectId);

        if (featuresError) throw featuresError;

        // 2. Claude AI 판정
        const contractContent = (features as any)?.map((f: any) =>
            `- ${f.feature_name}: ${f.detail_work || ''} (${f.estimated_days}일)`
        ).join('\n') || "등록된 계약 범위가 없습니다.";

        const { systemPrompt, userPrompt } = buildScopeJudgePrompt({
            contractContent,
            clientRequest: content,
        });

        const claudeResponse = await claude.messages.create({
            model: 'claude-3-5-sonnet-latest',
            system: systemPrompt,
            max_tokens: 1000,
            temperature: 0,
            messages: [{ role: 'user', content: userPrompt }],
        });

        const textContent = claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : '';
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Failed to parse AI response');

        const aiResult = JSON.parse(jsonMatch[0]);

        // DB Enum 매핑
        const judgmentMap: Record<string, 'in_scope' | 'out_of_scope' | 'needs_review'> = {
            IN_SCOPE: 'in_scope',
            OUT_OF_SCOPE: 'out_of_scope',
            AMBIGUOUS: 'needs_review'
        };
        const mappedStatus = judgmentMap[aiResult.judgment] || 'needs_review';

        // 3. 요청(requests) 저장
        const { data: newRequest, error: requestError } = await (supabase
            .from('requests')
            .insert({
                project_id: projectId,
                user_id: user.id,
                title: title || content.substring(0, 50),
                content,
                channel,
                requested_at: requested_at || new Date().toISOString(),
                requester_name,
                status: mappedStatus
            } as any)
            .select()
            .single() as any);

        if (requestError) throw (requestError as any);

        // 4. 판정 결과(scope_judgments) 저장
        const { error: judgmentError } = await (supabase
            .from('scope_judgments')
            .insert({
                request_id: (newRequest as any).id,
                user_id: user.id,
                result: aiResult.judgment, // AI 원본 타입 저장 혹은 매핑된 타입
                reasoning: aiResult.reason,
                confidence_score: aiResult.confidence,
                recommendation: aiResult.suggestion,
                model_used: 'claude-3-5-sonnet-20240620'
            } as any) as any);

        if (judgmentError) throw (judgmentError as any);

        return NextResponse.json({
            ...(newRequest as any),
            judgment: {
                result: mappedStatus,
                reasoning: aiResult.reason,
                confidence_score: aiResult.confidence,
                recommendation: aiResult.suggestion
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error(`Error in POST /api/projects/${projectId}/requests:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
