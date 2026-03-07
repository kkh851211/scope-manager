'use client'

// ── 기존 기능 import (건드리지 않음) ─────────────────────────
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from '@/components/common/ThemeToggle'

// ── 아이콘 컴포넌트 ──────────────────────────────────────────
const ScopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="#818CF8" strokeWidth="1.5" />
    <circle cx="9" cy="9" r="3" stroke="#818CF8" strokeWidth="1.5" />
    <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L3 4.5v4c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5v-4L9 2z" stroke="#818CF8" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 9l2 2 4-4" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 13l4-4 3 3 5-6" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6h4v4" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const EyeOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="2.5" stroke="#6B7280" strokeWidth="1.5" />
  </svg>
)

const EyeClosedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="2.5" stroke="#6B7280" strokeWidth="1.5" />
    <path d="M3 3L17 17" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const QuestionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="#6B7280" strokeWidth="1.5" />
    <path d="M8 11v.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 9C8 7.5 9.5 7 9.5 5.5C9.5 4.5 8.8 4 8 4C7.2 4 6.5 4.5 6.5 5.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ── 피처 데이터 ──────────────────────────────────────────────
const features = [
  {
    icon: <ScopeIcon />,
    title: '계약 범위 내/외 AI 자동 판정',
    desc: '클라이언트의 추가 요청이 계약 범위에 포함되는지 AI가 즉시 분석하고 판정해드립니다',
  },
  {
    icon: <ShieldIcon />,
    title: '변경 요청 공식 기록 및 승인 관리',
    desc: '모든 변경 요청을 체계적으로 기록하고 승인 프로세스를 투명하게 관리합니다',
  },
  {
    icon: <TrendIcon />,
    title: '프로젝트별 수익성 실시간 확인',
    desc: '각 프로젝트의 수익성을 실시간으로 추적하고 데이터 기반 의사결정을 지원합니다',
  },
]

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function LoginPage() {

  // ✅ 기존 기능 로직 — 절대 수정하지 말 것
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  // 🎨 UI 전용 상태 (디자인용, 기능과 무관)
  const [showPw, setShowPw] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const inputBorder = (field: string) => {
    if (field === 'email' && error) return '1.5px solid #EF4444'
    if (field === 'password' && error) return '1.5px solid #EF4444'
    if (focused === field) return '1.5px solid #6366F1'
    return '1.5px solid rgba(255,255,255,0.08)'
  }

  const inputBg = (field: string) =>
    focused === field ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.04)'

  // 🎨 UI — return 부분만 교체
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-btn:hover:not(:disabled) { background: #5254CC !important; }
        .login-btn:active:not(:disabled) { transform: scale(0.99); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .ghost-btn { background: none; border: none; cursor: pointer; font-family: inherit; }
        .ghost-btn:hover { opacity: 0.7; }
        .eye-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; }
        ::placeholder { color: #4B5563; font-size: 14px; }
        @media (max-width: 800px) {
          .brand-col { display: none !important; }
          .main-wrap { padding: 32px 20px !important; }
          .login-card { width: 100% !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 dark:bg-[#111318] transition-colors duration-300 font-sans flex flex-col">
        {/* 헤더 */}
        <div className="pt-8 px-10">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-gray-900 dark:text-white font-bold text-2xl tracking-tight">
              Scope Manager
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AI가 스코프를 판정합니다
          </p>
        </div>

        {/* 메인 */}
        <div className="main-wrap flex-1 flex items-center justify-center p-10 gap-20 max-w-[1200px] mx-auto w-full">
          {/* 좌측 피처 */}
          <div className="brand-col flex-[0_0_380px]">
            <div className="flex flex-col gap-9">
              {features.map((f, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-11 h-11 flex-shrink-0 bg-indigo-50 dark:bg-[#4F52B8]/10 border border-indigo-100 dark:border-[#4F52B8]/20 rounded-xl flex items-center justify-center">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold text-base mb-1.5 leading-tight">
                      {f.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed break-keep">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 로그인 카드 */}
          <div className="login-card flex-[0_0_520px] bg-white dark:bg-[#1C1F2E] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-11 px-12 pb-10 shadow-xl">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight mb-2">
              로그인
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-9">
              스코프매니저에 오신 것을 환영합니다
            </p>

            {/* ✅ 기존 onSubmit 연결 유지 */}
            <form onSubmit={handleLogin} className="flex flex-col gap-0">

              {/* ✅ 기존 에러 메시지 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-lg p-3 px-4 mb-5">
                  {error}
                </div>
              )}

              {/* 이메일 */}
              <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  이메일
                </label>
                {/* ✅ 기존 onChange, value, disabled 유지 */}
                <input
                  type="email"
                  value={email}
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  disabled={loading}
                  className={`w-full px-4 py-3.5 rounded-lg text-sm transition-all outline-none box-border ${focused === 'email'
                      ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-500'
                      : error
                        ? 'bg-red-50 dark:bg-red-500/5 border border-red-500'
                        : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
                    } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* 비밀번호 */}
              <div className="mb-7">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  {/* ✅ 기존 onChange, value, disabled 유지 */}
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    required
                    disabled={loading}
                    className={`w-full pl-4 pr-12 py-3.5 rounded-lg text-sm transition-all outline-none box-border ${focused === 'password'
                        ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-500 text-gray-900 dark:text-white'
                        : error
                          ? 'bg-red-50 dark:bg-red-500/5 border border-red-500 text-gray-900 dark:text-white'
                          : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
                      } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  <button
                    type="button"
                    className="eye-btn absolute right-3.5 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              {/* ✅ 기존 type="submit" + disabled={loading} 유지 */}
              <button
                type="submit"
                className="login-btn w-full p-3.5 bg-indigo-600 dark:bg-[#4F52B8] hover:bg-indigo-700 dark:hover:bg-[#5254CC] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mb-6 tracking-tight"
                disabled={loading}
              >
                {loading
                  ? <><svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" /><path d="M8 2C11.314 2 14 4.686 14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> 로그인 중...</>
                  : '로그인'
                }
              </button>

              {/* 하단 링크 — ✅ 기존 Link href="/signup" 유지 */}
              <div className="flex justify-between items-center">
                <button type="button" className="ghost-btn text-gray-500 dark:text-gray-400 text-xs hover:opacity-70">
                  비밀번호를 잊으셨나요?
                </button>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  계정이 없으신가요?{' '}
                  <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold no-underline hover:opacity-70">
                    회원가입
                  </Link>
                </span>
                <div className="ml-4">
                  <ThemeToggle />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* 푸터 */}
        <div className="py-5 px-10 border-t border-gray-200 dark:border-white/5 flex justify-between items-center">
          <p className="text-gray-400 dark:text-gray-600 text-xs">
            © 2026 Scope Manager. All rights reserved.
          </p>
          <div className="w-8 h-8 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <QuestionIcon />
          </div>
        </div>
      </div>
    </>
  )
}