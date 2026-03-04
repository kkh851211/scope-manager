import Anthropic from '@anthropic-ai/sdk'

// 브라우저 환경에서 이 파일이 불리는 것을 방지하기 위해 'server-only' 사용
import 'server-only'

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not defined in the environment variables.')
}

export const claude = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})
