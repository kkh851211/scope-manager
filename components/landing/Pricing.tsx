'use client';

import { Check, ArrowRight } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

export function Pricing() {
  const { theme } = useTheme();

  const features = [
    "AI 범위 초과 판정 무제한",
    "청구 근거 문서 자동 생성",
    "프로젝트 손익 추적",
    "피드백 반영 우선 적용",
    "정식 출시 시 얼리버드 할인"
  ];

  return (
    <section id="pricing" className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-gray-50'
      }`}>
      <div className="max-w-[1060px] mx-auto">
        {/* Label */}
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 text-center ${theme === 'dark' ? 'text-[#10B981]' : 'text-green-600'
          }`}>
          얼리 액세스
        </div>

        {/* Headline */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          지금 신청하면 베타 기간 동안 무료입니다
        </h2>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className={`border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl ${theme === 'dark'
            ? 'bg-gradient-to-b from-[#1A1F2E] to-[#0F1117] border-[#4F80FF]'
            : 'bg-gradient-to-b from-white to-gray-50 border-blue-500'
            }`}>
            {/* Badge */}
            <div className={`inline-block px-3 sm:px-4 py-1.5 rounded-full text-sm font-semibold border mb-4 sm:mb-6 ${theme === 'dark'
              ? 'bg-[#4F80FF]/15 text-[#4F80FF] border-[#4F80FF]/30'
              : 'bg-blue-50 text-blue-600 border-blue-200'
              }`}>
              얼리버드
            </div>

            {/* Price */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>₩0</span>
                <span className={theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'}>/ 베타 기간</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                }`}>
                정식 출시 후 별도 안내
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`rounded-full p-1 mt-0.5 ${theme === 'dark'
                    ? 'bg-[#10B981]/15'
                    : 'bg-green-50'
                    }`}>
                    <Check size={16} className={theme === 'dark' ? 'text-[#10B981]' : 'text-green-600'} />
                  </div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-[#E8EAF0]' : 'text-gray-700'
                    }`}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="w-full bg-[#4F80FF] text-white py-3 sm:py-4 rounded-full hover:bg-[#4070EF] transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-2 mb-3 sm:mb-4">
              베타 무료 체험 시작하기 <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Below CTA text */}
            <p className={`text-center text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
              }`}>
              신용카드 불필요 · 지금 <span className={`font-semibold ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
                }`}>127명</span>이 대기 중
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}