# Scope Manager

## 프로젝트 개요
웹 에이전시의 클라이언트 요청이 계약 범위 내인지 판단해주는 AI SaaS.
PM이 어려운 금전 대화를 하지 않아도 되도록 AI가 판단 근거를 제공함.

## 기술 스택
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL + Auth + RLS)
- AI: Claude API (claude-sonnet-4-20250514)
- 배포: Vercel

## 핵심 규칙
- 모든 텍스트는 한국어로
- 컴포넌트는 /components 폴더에
- API Route는 /app/api 폴더에
- 환경변수는 .env.local 사용
- 코드 스타일: TypeScript strict mode
