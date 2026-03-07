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
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 font-sans">

            {/* 헤더 */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-base)] border-b border-[var(--border)] z-50 transition-colors duration-300">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F52B8] to-[#6366F1] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">SM</span>
                        </div>
                        <span className="text-[var(--text-primary)] font-semibold text-lg">Scope Manager</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="w-9 h-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center hover:opacity-80 transition-colors">
                            <Bell className="w-5 h-5 text-[var(--text-muted)]" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F52B8] to-[#6366F1] flex items-center justify-center">
                            <span className="text-white font-medium text-sm">PM</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 사이드바 */}
            <aside className="fixed left-0 top-16 bottom-0 w-[220px] bg-[var(--bg-sidebar)] border-r border-[var(--border)] z-40 transition-colors duration-300">
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[var(--point)]/10 text-[var(--point)] border border-[var(--point)]/20 shadow-sm'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
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