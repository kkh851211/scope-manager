'use client';

import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

export function Hero() {
  const { theme } = useTheme();

  return (
    <section className={`py-16 sm:py-20 md:py-32 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-white'
      }`}>
      <div className="max-w-[1060px] mx-auto text-center">
        {/* Badge */}
        <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6 ${theme === 'dark'
          ? 'bg-[#4F80FF]/10 border border-[#4F80FF]/20'
          : 'bg-blue-50 border border-blue-200'
          }`}>
          <span className={`text-xs sm:text-sm font-semibold ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
            }`}>5~20인 웹 에이전시 PM을 위한 도구</span>
        </div>

        {/* Main Headline */}
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          추가 요금 청구, 이제 PM이<br />말 안 해도 됩니다
        </h1>

        {/* Subheadline */}
        <p className={`text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto px-4 ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
          }`}>
          클라이언트 추가 요구를 자동 판정하고, 청구 근거를 만들어드립니다
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6 px-4">
          <button className="w-full sm:w-auto bg-[#4F80FF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#4070EF] transition-all flex items-center justify-center gap-2 font-semibold text-base sm:text-lg">
            얼리 액세스 신청하기 <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all font-semibold text-base sm:text-lg ${theme === 'dark'
            ? 'border border-white/20 text-white hover:bg-white/5'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
            데모 보기
          </button>
        </div>

        {/* Small text */}
        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-500'
          }`}>
          신용카드 불필요 · 가입 30초 · 언제든 취소
        </p>

        {/* Dashboard Mockup */}
        <div className="mt-16 sm:mt-24 relative px-2">
          <div className={`absolute inset-0 bg-gradient-to-t h-32 bottom-0 z-10 ${theme === 'dark' ? 'from-[#0F1117] via-transparent to-transparent' : 'from-white via-transparent to-transparent'
            }`}></div>
          <div className={`relative rounded-xl sm:rounded-3xl border p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl ${theme === 'dark'
            ? 'bg-gradient-to-b from-[#1A1F2E]/60 to-[#0F1117]/60 border-[#232B3E]/50'
            : 'bg-gradient-to-b from-gray-50/90 to-white/90 border-gray-200'
            }`}>
            {/* Browser Chrome */}
            <div className={`flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b ${theme === 'dark' ? 'border-[#232B3E]/50' : 'border-gray-200'
              }`}>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F87171]/80 backdrop-blur-sm"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FBBF24]/80 backdrop-blur-sm"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981]/80 backdrop-blur-sm"></div>
              <div className={`ml-2 sm:ml-4 flex-1 rounded-md sm:rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm ${theme === 'dark' ? 'bg-[#0F1117]/60' : 'bg-white/60'
                }`}>
                <span className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-500'
                  }`}>scope-manager.app/dashboard</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
                <div>
                  <h3 className={`font-semibold text-sm sm:text-lg backdrop-blur-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'
                    }`}>프로젝트 대시보드</h3>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                    }`}>실시간 범위 관리 현황</p>
                </div>
                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-md border ${theme === 'dark'
                  ? 'bg-[#4F80FF]/20 border-[#4F80FF]/30'
                  : 'bg-blue-50 border-blue-200'
                  }`}>
                  <span className={`text-xs sm:text-sm font-semibold ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
                    }`}>3건 검토 대기</span>
                </div>
              </div>

              {/* Main Result Card - Frosted Glass */}
              <div className={`border rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-2xl shadow-lg ${theme === 'dark'
                ? 'bg-[#1A1F2E]/30 border-[#4F80FF]/40'
                : 'bg-white/50 border-blue-200'
                }`}>
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="bg-[#4F80FF]/80 rounded-full p-2 sm:p-2.5 backdrop-blur-sm flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'
                        }`}>범위 초과 판정됨</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold border backdrop-blur-sm ${theme === 'dark'
                        ? 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]/30'
                        : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                        초과
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                      }`}>
                      "추가 페이지 3개 제작 요청" - 계약 범위 초과로 자동 판정되었습니다
                    </p>
                    <div className={`rounded-md sm:rounded-lg p-2 sm:p-3 backdrop-blur-sm border ${theme === 'dark'
                      ? 'bg-[#0F1117]/50 border-[#232B3E]/50'
                      : 'bg-gray-50/80 border-gray-200'
                      }`}>
                      <p className={`text-[10px] sm:text-xs leading-relaxed ${theme === 'dark' ? 'text-[#E8EAF0]/90' : 'text-gray-700'
                        }`}>
                        💬 자동 생성된 메시지: "시스템 분석 결과, 계약서 3조의 페이지 수를 초과하는 작업으로 확인되었습니다."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Frosted Glass */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className={`border rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-xl ${theme === 'dark'
                  ? 'bg-[#1A1F2E]/20 border-[#232B3E]/50'
                  : 'bg-white/40 border-gray-200'
                  }`}>
                  <div className={`text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
                    }`}>+3</div>
                  <div className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                    }`}>추가 페이지</div>
                </div>
                <div className={`border rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-xl ${theme === 'dark'
                  ? 'bg-[#1A1F2E]/20 border-[#232B3E]/50'
                  : 'bg-white/40 border-gray-200'
                  }`}>
                  <div className={`text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-[#FBBF24]' : 'text-amber-500'
                    }`}>24h</div>
                  <div className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                    }`}>예상 시간</div>
                </div>
                <div className={`border rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-xl ${theme === 'dark'
                  ? 'bg-[#1A1F2E]/20 border-[#232B3E]/50'
                  : 'bg-white/40 border-gray-200'
                  }`}>
                  <div className={`text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-[#10B981]' : 'text-green-600'
                    }`}>+45%</div>
                  <div className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                    }`}>범위 초과</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`border rounded-md sm:rounded-lg p-3 sm:p-4 backdrop-blur-xl ${theme === 'dark'
                ? 'bg-[#1A1F2E]/20 border-[#232B3E]/50'
                : 'bg-white/40 border-gray-200'
                }`}>
                <h5 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'
                  }`}>최근 판정 내역</h5>
                <div className="space-y-1.5 sm:space-y-2">
                  {['디자인 수정 요청 - 범위 내', '로그인 기능 추가 - 범위 초과', '텍스트 수정 - 범위 내'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] sm:text-xs">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${i === 1
                        ? theme === 'dark' ? 'bg-[#F87171]' : 'bg-red-500'
                        : theme === 'dark' ? 'bg-[#10B981]' : 'bg-green-500'
                        }`}></div>
                      <span className={theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}