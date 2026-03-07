'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Bell,
    LayoutDashboard,
    FolderKanban,
    Sparkles,
    Settings,
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

const menuItems = [
    { icon: LayoutDashboard, label: '대시보드', href: '/dashboard' },
    { icon: FolderKanban, label: '프로젝트', href: '/projects' },
    { icon: Sparkles, label: '판정 요청', href: '/history/new' },
    { icon: Settings, label: '설정', href: '/settings' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111318] text-gray-900 dark:text-white transition-colors duration-300 font-sans">

            {/* 헤더 */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#111318] border-b border-gray-200 dark:border-white/[0.07] z-50 transition-colors duration-300">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F52B8] to-[#6366F1] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">SM</span>
                        </div>
                        <span className="text-[var(--text-primary)] font-semibold text-lg">Scope Manager</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#1C1F2E] border border-gray-200 dark:border-white/[0.07] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#252838] transition-colors">
                            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F52B8] to-[#6366F1] flex items-center justify-center">
                            <span className="text-white font-medium text-sm">PM</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 사이드바 */}
            <aside className="fixed left-0 top-16 bottom-0 w-[220px] bg-white dark:bg-[#111318] border-r border-gray-200 dark:border-white/[0.07] z-40 transition-colors duration-300">
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-indigo-50 dark:bg-[#4F52B8]/10 text-indigo-600 dark:text-[#6366F1] border border-indigo-100 dark:border-[#4F52B8]/20 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1C1F2E] hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="ml-[220px] pt-16 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}