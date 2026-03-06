'use client';

import { useTheme } from '@/app/contexts/ThemeContext';

export function Solution() {
  const { theme } = useTheme();

  const features = [
    {
      emoji: "⚖️",
      title: "AI 판정자",
      body: "클라이언트 요구가 계약 범위 내인지 외인지, 시스템이 자동 판정합니다. PM의 주관 대신 데이터가 말합니다.",
      before: "PM이 판단",
      after: "시스템이 판정",
      borderColor: theme === 'dark' ? "border-l-[#4F80FF]" : "border-l-blue-500"
    },
    {
      emoji: "📄",
      title: "근거 생성자",
      body: "'시스템상 과업 범위를 초과하였습니다' — PM이 아닌 도구가 문장을 자동으로 만들어 전달합니다.",
      before: "PM이 설명",
      after: "문서가 말함",
      borderColor: theme === 'dark' ? "border-l-[#10B981]" : "border-l-green-500"
    },
    {
      emoji: "📊",
      title: "수익성 가시화",
      body: "프로젝트별 실제 손익을 누적합니다. 다음 견적과 계약의 기준이 데이터로 만들어집니다.",
      before: "감으로 견적",
      after: "데이터로 견적",
      borderColor: theme === 'dark' ? "border-l-[#FBBF24]" : "border-l-amber-500"
    }
  ];

  return (
    <section id="solution" className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-white'
      }`}>
      <div className="max-w-[1060px] mx-auto">
        {/* Label */}
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 ${theme === 'dark' ? 'text-[#10B981]' : 'text-green-600'
          }`}>
          Scope Manager가 하는 일
        </div>

        {/* Headline */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          시스템이 판정하고, 근거를 만들고,<br className="hidden md:block" /> 수익을 가시화합니다
        </h2>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`border ${feature.borderColor} border-l-4 rounded-xl p-5 sm:p-6 hover:border-opacity-100 transition-all ${theme === 'dark'
                ? 'bg-[#1A1F2E] border-[#232B3E]'
                : 'bg-gray-50 border-gray-200 hover:shadow-lg'
                }`}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.emoji}</div>
              <h3 className={`font-semibold text-base sm:text-lg mb-2 sm:mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {feature.title}
              </h3>
              <p className={`text-sm mb-3 sm:mb-4 leading-relaxed ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                }`}>
                {feature.body}
              </p>
              {/* Before/After */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className={`px-2 sm:px-3 py-1 rounded-full border ${theme === 'dark'
                  ? 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30'
                  : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                  Before: {feature.before}
                </span>
                <span className={theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-400'}>→</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full border ${theme === 'dark'
                  ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                  : 'bg-green-50 text-green-600 border-green-200'
                  }`}>
                  After: {feature.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}