# Scope Manager

## 프로젝트 개요
웹 에이전시 PM이 클라이언트 요청의 계약 범위 포함 여부를
AI로 판단해주는 SaaS

## 기술 스택
- Next.js 14 App Router, TypeScript
- Tailwind CSS, shadcn/ui
- Supabase (DB + Auth + RLS)
- Claude API (judge-scope)
- Vercel 배포

## 규칙
- UI 텍스트는 모두 한국어
- 컴포넌트는 /components 폴더
- API Route는 /app/api 폴더
- 환경변수는 .env.local
- 브라우저로 결과 확인 후 다음 작업 진행
