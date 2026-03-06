'use client';

import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 border-b ${theme === 'dark'
        ? 'bg-[#1A1F2E] border-[#232B3E]'
        : 'bg-white border-gray-200 shadow-sm'
      }`}>
      <div className="max-w-[1060px] mx-auto px-5 sm:px-7 py-4 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-base sm:text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Scope Manager</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button onClick={() => scrollToSection('solution')} className={`text-sm transition-colors ${theme === 'dark' ? 'text-[#8C95AA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
            제품 소개
          </button>
          <button onClick={() => scrollToSection('demo')} className={`text-sm transition-colors ${theme === 'dark' ? 'text-[#8C95AA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
            기능
          </button>
          <button onClick={() => scrollToSection('pricing')} className={`text-sm transition-colors ${theme === 'dark' ? 'text-[#8C95AA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
            가격
          </button>
          <button onClick={() => scrollToSection('faq')} className={`text-sm transition-colors ${theme === 'dark' ? 'text-[#8C95AA] hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
            FAQ
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${theme === 'dark'
                ? 'bg-[#232B3E] hover:bg-[#2A3346] text-[#8C95AA]'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            aria-label="테마 전환"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('pricing')}
            className="bg-[#4F80FF] text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-[#4070EF] transition-all text-xs sm:text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">얼리 액세스 신청하기</span>
            <span className="inline sm:hidden">신청하기</span>
          </button>
        </div>
      </div>
    </header>
  );
}