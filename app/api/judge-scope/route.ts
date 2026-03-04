import { NextResponse } from 'next/server'
import { claude } from '@/lib/claude/client'
import { buildScopeJudgePrompt } from '@/lib/claude/prompts'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { projectId, contractContent, clientRequest, requesterName } = body

        // 1. 입력값 유효성 검사
        if (!projectId || !contractContent || !clientRequest) {
            return NextResponse.json(
                { error: 'Missing required fields: projectId, contractContent, clientRequest' },
                { status: 400 }
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

        // 5. 결과 반환
        return NextResponse.json({
            success: true,
            data: parsedResult
        })

    } catch (error: any) {
        console.error('Error in judge-scope API:', error)

        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
