import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 이메일 인증 완료 → 대시보드로 이동
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // 인증 실패 → 로그인 페이지로 이동 (오류 메시지 포함)
  return NextResponse.redirect(`${origin}/login?error=인증에 실패했습니다. 다시 시도해주세요.`)
}
