'use client';

import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`border-t py-10 sm:py-12 px-5 sm:px-7 ${theme === 'dark'
        ? 'bg-[#1A1F2E] border-[#232B3E]'
        : 'bg-gray-50 border-gray-200'
      }`}>
      <div className="max-w-[1060px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-base sm:text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Scope Manager</span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <a href="#" className={`text-sm transition-colors ${theme === 'dark'
                ? 'text-[#8C95AA] hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
              }`}>
              이용약관
            </a>
            <a href="#" className={`text-sm transition-colors ${theme === 'dark'
                ? 'text-[#8C95AA] hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
              }`}>
              개인정보처리방침
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className={`mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center ${theme === 'dark' ? 'border-[#232B3E]' : 'border-gray-200'
          }`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-500'
            }`}>
            © 2025 Scope Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}