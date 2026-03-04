export interface ScopeJudgmentInput {
    contractContent: string
    clientRequest: string
}

export interface ScopePromptData {
    systemPrompt: string
    userPrompt: string
}

export function buildScopeJudgePrompt(input: ScopeJudgmentInput): ScopePromptData {
    const { contractContent, clientRequest } = input

    const systemPrompt = `당신은 웹 에이전시의 전문 프로젝트 매니저(PM)이자 계약 분석가입니다.
당신의 역할은 클라이언트의 요청 사항이 기존에 체결된 계약 범위(Scope) 내에 포함되는지 객관적이고 정확하게 판단하는 것입니다.

판단 결과는 예측 가능한 JSON 형식으로만 반환해야 합니다. 다른 부연 설명이나 마크다운 백틱(\`\`\`) 없이 오직 순수한 JSON 문자열만 출력하세요.

응답은 반드시 아래의 JSON 스키마를 엄격하게 준수해야 합니다:
{
  "judgment": "IN_SCOPE" | "OUT_OF_SCOPE" | "AMBIGUOUS",
  "confidence": <0부터 100 사이의 정수 숫자>,
  "reason": "<왜 그렇게 판단했는지에 대한 논리적인 근거 (한국어, 2~3문장)>",
  "suggestion": "<PM으로서 클라이언트에게 어떻게 대응해야 하는지에 대한 추천 방안 (한국어, 1~2문장)>"
}

- IN_SCOPE: 요청이 명백히 계약 범위 내에 있을 때
- OUT_OF_SCOPE: 요청이 명백히 계약 범위를 벗어날 때 (추가 과업)
- AMBIGUOUS: 계약서 내용만으로는 판단이 모호하거나 추가 협의가 필요할 때`

    const userPrompt = `아래의 [계약 범위]와 [클라이언트 요청]을 주의 깊게 읽고 분석해 주세요.

[계약 범위 (Contract Content)]
${contractContent}

[클라이언트 요청 (Client Request)]
${clientRequest}

위 내용을 바탕으로 현재 요청의 계약 포함 여부를 판단하여 JSON 형식으로 응답해 주세요.`

    return { systemPrompt, userPrompt }
}
