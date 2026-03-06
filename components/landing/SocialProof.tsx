'use client';

import { useTheme } from '@/app/contexts/ThemeContext';

export function SocialProof() {
  const { theme } = useTheme();

  const stats = [
    { value: "52%", label: "전 세계 프로젝트 스코프 크리프 발생률" },
    { value: "85%", label: "예산을 초과하는 프로젝트 비율" },
    { value: "27%", label: "평균 비용 초과율" }
  ];

  return (
    <section className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-gray-50'
      }`}>
      <div className="max-w-[1060px] mx-auto">
        {/* Headline */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          이건 특별한 PM만의 문제가 아닙니다
        </h2>

        {/* Stat Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`border rounded-xl p-6 sm:p-8 text-center transition-all ${theme === 'dark'
                ? 'bg-[#1A1F2E] border-[#232B3E] hover:border-[#4F80FF]/50'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
            >
              <div className={`text-4xl sm:text-5xl font-bold mb-2 sm:mb-3 ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
                }`}>
                {stat.value}
              </div>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Block */}
        <div className={`border rounded-xl p-6 sm:p-8 md:p-10 ${theme === 'dark'
          ? 'bg-[#1A1F2E] border-[#232B3E]'
          : 'bg-white border-gray-200'
          }`}>
          <p className={`text-base sm:text-lg md:text-xl italic leading-relaxed mb-3 sm:mb-4 ${theme === 'dark' ? 'text-[#E8EAF0]' : 'text-gray-800'
            }`}>
            "클라이언트들은 AI 때문에 더 낮은 금액을 기대하지만, 그 기대치는 실제 필요 인력을 반영하지 않는다"
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-500'
            }`}>
            — 글로벌 에이전시 실태조사, Productive.io
          </p>
        </div>
      </div>
    </section>
  );
}