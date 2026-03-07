'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Hydration mismatch 방지
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-9 h-9" />;

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${isDark
                    ? 'bg-[#1C1F2E] border-white/[0.07] hover:bg-[#252838]'
                    : 'bg-white border-black/[0.08] hover:bg-gray-50'
                }`}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-gray-400" />
            ) : (
                <Moon className="w-5 h-5 text-gray-500" />
            )}
        </button>
    );
}
