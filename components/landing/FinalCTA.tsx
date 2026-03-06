'use client';

import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function FinalCTA() {
  const { theme } = useTheme();

  return (
    <section className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark'
        ? 'bg-gradient-to-br from-[#4F80FF] to-[#2D5FDD]'
        : 'bg-gradient-to-br from-blue-600 to-blue-700'
      }`}>
      <div className="max-w-[1060px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
          PM이 아쉬운 소리를 하지 않아도 되는 구조
        </h2>
        <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8">
          시스템이 말하면, 관계가 지켜집니다
        </p>
        <button className="bg-white px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-gray-50 transition-all font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto shadow-lg text-[#4F80FF]">
          지금 바로 시작하기 <ArrowRight size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}