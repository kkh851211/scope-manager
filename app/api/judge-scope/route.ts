import { NextResponse } from 'next/server'
import { claude } from '@/lib/claude/client'
import { buildScopeJudgePrompt } from '@/lib/claude/prompts'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { projectId, contractContent, clientRequest, requesterName } = body

        // 1. 입력값 유효성 검사 및 인증
        if (!projectId || !contractContent || !clientRequest) {
            return NextResponse.json(
                { error: 'Missing required fields: projectId, contractContent, clientRequest' },
                { status: 400 }
            )
        }

        // Use service role key for DB writes; allow unauthenticated dev requests
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        // Optional: get user for production auth (skip in dev)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user && process.env.NODE_ENV !== 'development') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. /lib/claude/prompts.ts의 buildScopeJudgePrompt 사용
        const { systemPrompt, userPrompt } = buildScopeJudgePrompt({
            contractContent,
            clientRequest,
        })

        // 3. Claude API 호출
        const response = await claude.messages.create({
            model: 'claude-sonnet-4-20250514',
            system: systemPrompt,
            max_tokens: 1000,
            temperature: 0.2,
            messages: [
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
        })

        // 4. 응답에서 JSON 파싱
        const textContent = response.content[0].type === 'text' ? response.content[0].text : ''

        // 혹시라도 JSON 외의 문자열이 섞여있을 것을 대비해 JSON만 추출
        const jsonMatch = textContent.match(/\{[\s\S]*\}/)

        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from Claude response')
        }

        const jsonString = jsonMatch[0]
        let parsedResult

        try {
            parsedResult = JSON.parse(jsonString)
        } catch (parseError) {
            console.error('JSON parsing failed:', textContent)
            throw new Error('Invalid JSON format returned from Claude')
        }

        // 5. Supabase 저장 로직
        // 5-1. requests 테이블에 데이터 저장
        const title = clientRequest.substring(0, 50) + (clientRequest.length > 50 ? '...' : '')

        const { data: requestDef, error: requestError } = await supabase
            .from('requests')
            .insert({
                project_id: projectId,
                user_id: user.id,
                title: title,
                content: clientRequest,
                requester_name: requesterName || null,
                status: 'judged'
            })
            .select('id')
            .single()

        if (requestError) {
            throw new Error(`Failed to save request: ${requestError.message}`)
        }

        const requestId = requestDef.id

        // 5-2. scope_judgments 테이블에 데이터 저장
        // 클라이언트 결과를 DB Enum으로 매핑
        const judgmentMap: Record<string, string> = {
            IN_SCOPE: 'in_scope',
            OUT_OF_SCOPE: 'out_of_scope',
            AMBIGUOUS: 'unclear'
        }
        const mappedResult = judgmentMap[parsedResult.judgment] || 'unclear'

        const { error: judgmentError } = await supabase
            .from('scope_judgments')
            .insert({
                request_id: requestId,
                user_id: user.id,
                result: mappedResult as any,
                reasoning: parsedResult.reason,
                confidence_score: parsedResult.confidence,
                recommendation: parsedResult.suggestion,
                model_used: 'claude-sonnet-4-20250514'
            })

        if (judgmentError) {
            throw new Error(`Failed to save judgment: ${judgmentError.message}`)
        }

        // 6. 결과 반환
        return NextResponse.json({
            success: true,
            data: {
                ...parsedResult,
                request_id: requestId
            }
        })

    } catch (error: any) {
        console.error('Error in judge-scope API:', error)

        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
