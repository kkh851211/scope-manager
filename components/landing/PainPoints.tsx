'use client';

import { useTheme } from 'next-themes';

export function PainPoints() {
  const { theme } = useTheme();

  const pains = [
    {
      emoji: "💬",
      title: "돈 달라는 말을 PM이 직접 해야 한다",
      body: "추가 작업인 건 저도 알아요. 근데 말을 어떻게 꺼내요.",
      tag: "감정 노동",
      tagColor: theme === 'dark'
        ? "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30"
        : "bg-red-50 text-red-600 border-red-200"
    },
    {
      emoji: "🤖",
      title: "AI 때문에 더 싸야 한다는 클라이언트",
      body: "AI가 다 해줬으면 왜 이렇게 시간이 걸리냐고 하더라고요.",
      tag: "AI 인식 격차",
      tagColor: theme === 'dark'
        ? "bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30"
        : "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      emoji: "📱",
      title: "카카오톡·엑셀로 범위 관리하는 현실",
      body: "카카오톡에서 언제 뭘 요청했는지 뒤져봐야 하는 상황.",
      tag: "도구 공백",
      tagColor: theme === 'dark'
        ? "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30"
        : "bg-red-50 text-red-600 border-red-200"
    }
  ];

  return (
    <section className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-gray-50'
      }`}>
      <div className="max-w-[1060px] mx-auto">
        {/* Label */}
        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
          }`}>
          왜 지금 이 문제인가
        </div>

        {/* Headline */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          에이전시 PM이라면 누구나 겪는 3가지 고통
        </h2>

        {/* Pain Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {pains.map((pain, index) => (
            <div
              key={index}
              className={`border rounded-xl p-5 sm:p-6 transition-all group ${theme === 'dark'
                ? 'bg-[#1A1F2E] border-[#232B3E] hover:border-[#4F80FF]/50'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{pain.emoji}</div>
              <h3 className={`font-semibold text-base sm:text-lg mb-2 sm:mb-3 leading-snug ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {pain.title}
              </h3>
              <p className={`text-sm mb-3 sm:mb-4 leading-relaxed ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                }`}>
                {pain.body}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${pain.tagColor}`}>
                {pain.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Stat Callout */}
        <div className={`border rounded-xl p-5 sm:p-6 text-center ${theme === 'dark'
          ? 'bg-[#1A1F2E] border-[#232B3E]'
          : 'bg-white border-gray-200'
          }`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'}`}>
            전 세계 프로젝트의 <span className={`font-bold ${theme === 'dark' ? 'text-[#4F80FF]' : 'text-blue-600'
              }`}>52%</span>가 스코프 크리프를 경험합니다{' '}
            <span className={theme === 'dark' ? 'text-[#8C95AA]/60' : 'text-gray-400'}>— Productive.io</span>
          </p>
        </div>
      </div>
    </section>
  );
}