'use client'

// ── 기존 기능 import (건드리지 않음) ─────────────────────────
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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

      <div style={{
        minHeight: '100vh',
        background: '#111318',
        fontFamily: "'Noto Sans KR', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 헤더 */}
        <div style={{ padding: '32px 40px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.4px' }}>
              Scope Manager
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            AI가 스코프를 판정합니다
          </p>
        </div>

        {/* 메인 */}
        <div className="main-wrap" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          gap: '80px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* 좌측 피처 */}
          <div className="brand-col" style={{ flex: '0 0 380px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <p style={{ color: '#F9FAFB', fontWeight: 600, fontSize: '16px', marginBottom: '6px', lineHeight: 1.4 }}>
                      {f.title}
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.7, wordBreak: 'keep-all' }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 로그인 카드 */}
          <div className="login-card" style={{
            flex: '0 0 520px',
            background: '#1C1F2E',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '44px 48px 40px',
          }}>
            <h1 style={{
              color: '#F9FAFB', fontSize: '28px', fontWeight: 700,
              letterSpacing: '-0.5px', marginBottom: '8px',
            }}>
              로그인
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '36px' }}>
              스코프매니저에 오신 것을 환영합니다
            </p>

            {/* ✅ 기존 onSubmit 연결 유지 */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

              {/* ✅ 기존 에러 메시지 */}
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#FCA5A5',
                  fontSize: '13px',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                }}>
                  {error}
                </div>
              )}

              {/* 이메일 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block', color: '#D1D5DB',
                  fontSize: '14px', fontWeight: 500, marginBottom: '8px',
                }}>
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
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: inputBg('email'),
                    border: inputBorder('email'),
                    borderRadius: '8px',
                    color: '#F9FAFB', fontSize: '14px',
                    fontFamily: 'inherit', outline: 'none',
                    transition: 'border-color 0.15s, background 0.15s',
                    boxSizing: 'border-box',
                    opacity: loading ? 0.6 : 1,
                  }}
                />
              </div>

              {/* 비밀번호 */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block', color: '#D1D5DB',
                  fontSize: '14px', fontWeight: 500, marginBottom: '8px',
                }}>
                  비밀번호
                </label>
                <div style={{ position: 'relative' }}>
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
                    style={{
                      width: '100%', padding: '13px 48px 13px 16px',
                      background: inputBg('password'),
                      border: inputBorder('password'),
                      borderRadius: '8px',
                      color: '#F9FAFB', fontSize: '14px',
                      fontFamily: 'inherit', outline: 'none',
                      transition: 'border-color 0.15s, background 0.15s',
                      boxSizing: 'border-box',
                      opacity: loading ? 0.6 : 1,
                    }}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    {showPw ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              {/* ✅ 기존 type="submit" + disabled={loading} 유지 */}
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: '#4F52B8',
                  border: 'none', borderRadius: '8px',
                  color: 'white', fontSize: '15px', fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.15s, transform 0.1s',
                  marginBottom: '24px',
                  letterSpacing: '-0.2px',
                }}
              >
                {loading
                  ? <><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.75s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" /><path d="M8 2C11.314 2 14 4.686 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg> 로그인 중...</>
                  : '로그인'
                }
              </button>

              {/* 하단 링크 — ✅ 기존 Link href="/signup" 유지 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="ghost-btn" style={{ color: '#6B7280', fontSize: '13px' }}>
                  비밀번호를 잊으셨나요?
                </button>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>
                  계정이 없으신가요?{' '}
                  <Link href="/signup" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
                    회원가입
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '20px 40px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ color: '#374151', fontSize: '12px' }}>
            © 2026 Scope Manager. All rights reserved.
          </p>
          <div style={{
            width: '32px', height: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <QuestionIcon />
          </div>
        </div>
      </div>
    </>
  )
}