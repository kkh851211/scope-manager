'use client';

import { Edit3, Brain, FileText, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function DemoPreview() {
  const { theme } = useTheme();

  const steps = [
    { icon: Edit3, label: "클라이언트 요청 입력" },
    { icon: Brain, label: "AI 범위 초과 자동 판정" },
    { icon: FileText, label: "청구 근거 문서 자동 생성" }
  ];

  return (
    <section id="demo" className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-white'
      }`}>
      <div className="max-w-[1060px] mx-auto">
        {/* Label */}
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 text-center ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
          }`}>
          이렇게 작동합니다
        </div>

        {/* Headline */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          실제 화면으로 확인하세요
        </h2>

        {/* 3-step flow */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className={`border rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 ${theme === 'dark'
                    ? 'bg-[#1A1F2E] border-[#232B3E]'
                    : 'bg-gray-50 border-gray-200'
                  }`}>
                  <step.icon size={28} className={`sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
                    }`} />
                </div>
                <p className={`text-xs sm:text-sm text-center max-w-[100px] sm:max-w-[120px] ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                  }`}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight size={20} className={`hidden md:block ${theme === 'dark' ? 'text-[#232B3E]' : 'text-gray-300'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {/* Large Mockup */}
        <div className={`rounded-xl sm:rounded-2xl border p-5 sm:p-8 shadow-2xl mb-6 sm:mb-8 ${theme === 'dark'
            ? 'bg-gradient-to-b from-[#1A1F2E] to-[#0F1117] border-[#232B3E]'
            : 'bg-gradient-to-b from-gray-50 to-white border-gray-200'
          }`}>
          <div className={`rounded-lg sm:rounded-xl border p-4 sm:p-6 backdrop-blur-sm ${theme === 'dark'
              ? 'bg-[#0F1117]/80 border-[#232B3E]'
              : 'bg-white/80 border-gray-200'
            }`}>
            {/* UI Header */}
            <div className={`flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b flex-wrap gap-3 ${theme === 'dark' ? 'border-[#232B3E]' : 'border-gray-200'
              }`}>
              <h3 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>범위 초과 판정 결과</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${theme === 'dark'
                  ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                  : 'bg-green-50 text-green-600 border-green-200'
                }`}>
                판정 완료
              </span>
            </div>

            {/* Result Card */}
            <div className={`border-2 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 ${theme === 'dark'
                ? 'bg-[#4F80FF]/10 border-[#4F80FF]/40'
                : 'bg-blue-50 border-blue-200'
              }`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-[#4F80FF] rounded-full p-1.5 sm:p-2 mt-1 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-base sm:text-lg mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>범위 초과 판정됨</h4>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                    }`}>
                    요청하신 "로그인 페이지 디자인 수정 및 추가 페이지 3개 제작"은 기존 계약 범위를 초과합니다.
                  </p>
                  <div className={`rounded-lg p-3 sm:p-4 ${theme === 'dark'
                      ? 'bg-[#0F1117]/50'
                      : 'bg-white/60'
                    }`}>
                    <p className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>자동 생성된 청구 근거:</p>
                    <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-[#E8EAF0]' : 'text-gray-700'
                      }`}>
                      "시스템 분석 결과, 해당 요청은 계약서 3조 2항의 '디자인 페이지 수정 2회'를 초과하는 작업으로 판정되었습니다. 추가 페이지 제작(3페이지)에 대한 별도 견적이 필요합니다."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className={`border rounded-lg p-3 sm:p-4 ${theme === 'dark'
                  ? 'bg-[#1A1F2E] border-[#232B3E]'
                  : 'bg-gray-50 border-gray-200'
                }`}>
                <div className={`text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
                  }`}>+3</div>
                <div className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                  }`}>추가 페이지</div>
              </div>
              <div className={`border rounded-lg p-3 sm:p-4 ${theme === 'dark'
                  ? 'bg-[#1A1F2E] border-[#232B3E]'
                  : 'bg-gray-50 border-gray-200'
                }`}>
                <div className={`text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-[#FBBF24]' : 'text-amber-500'
                  }`}>24h</div>
                <div className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                  }`}>예상 소요시간</div>
              </div>
              <div className={`border rounded-lg p-3 sm:p-4 ${theme === 'dark'
                  ? 'bg-[#1A1F2E] border-[#232B3E]'
                  : 'bg-gray-50 border-gray-200'
                }`}>
                <div className={`text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 ${theme === 'dark' ? 'text-[#10B981]' : 'text-green-600'
                  }`}>+45%</div>
                <div className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                  }`}>범위 초과율</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all flex items-center gap-2 font-semibold text-base sm:text-lg mx-auto ${theme === 'dark'
              ? 'bg-[#10B981] hover:bg-[#0EA572] text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
            }`}>
            직접 써보기 <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}