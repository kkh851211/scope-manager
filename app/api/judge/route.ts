import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Using Node.js runtime for better compatibility with SDK
// export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('ANTHROPIC_API_KEY is missing');
            return NextResponse.json({ error: 'API key setup is incomplete' }, { status: 500 });
        }

        const { contract, request } = await req.json();
        console.log('API Request received:', { contract, request });

        if (!contract || !request) {
            return NextResponse.json({ error: 'Contract scope or request content is missing' }, { status: 400 });
        }

        const systemPrompt = `당신은 웹 에이전시 프로젝트 스코프 판정 AI입니다.

[계약 범위]에 명시된 내용을 기준으로
[새 요청]이 계약 범위 내인지 초과인지 판정하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "result": "초과" 또는 "범위내",
  "reason": "계약서 내용을 근거로 한 판정 이유 (2~3문장, 한국어)",
  "needsQuote": true 또는 false
}`;

        console.log('Calling Anthropic API...');
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `[계약 범위]\n${contract}\n\n[새 요청]\n${request}`,
                },
            ],
        });
        console.log('Anthropic API response received');

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        console.log('Response text:', responseText);

        // Attempt to extract JSON if Claude includes surrounding text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('API Error details:', error);
        return NextResponse.json({
            error: 'Failed to process judgment',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
