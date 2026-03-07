'use client';

// ── 기존 기능 import (건드리지 않음) ─────────────────────────
import React from 'react';
import Link from 'next/link';
import { StatusBadge, StatusType } from '@/components/common/StatusBadge';

// ── Figma Make 아이콘 (lucide-react) ─────────────────────────
import {
    FolderOpen,
    Sparkles,
    ShieldAlert,
    ArrowRight,
    Plus,
} from 'lucide-react';

// ── 기존 props 인터페이스 (건드리지 않음) ────────────────────
interface DashboardClientProps {
    summaryData: {
        totalProjects: number;
        thisMonthJudgments: number;
        outOfScopeRate: number;
    };
    recentJudgments: {
        id: string;
        projectName: string;
        requestContent: string;
        status: StatusType;
        date: string;
    }[];
}

// ── 요약 카드 컴포넌트 ────────────────────────────────────────
function SummaryCard({
    icon: Icon,
    value,
    label,
    subtext,
    valueColor = 'text-white',
}: {
    icon: React.ElementType;
    value: string | number;
    label: string;
    subtext: string;
    valueColor?: string;
}) {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:-translate-y-1 transition-all duration-200 cursor-default shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#4F52B8]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#6366F1]" />
                </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${valueColor}`}>{value}</div>
            <div className="text-[var(--text-muted)] text-sm mb-2">{label}</div>
            <div className="text-xs text-[var(--text-muted)]/70">{subtext}</div>
        </div>
    );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function DashboardClient({ summaryData, recentJudgments }: DashboardClientProps) {
    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500">

            {/* 페이지 타이틀 */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[var(--text-primary)] text-2xl font-bold tracking-tight">대시보드</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        전체 프로젝트 현황과 최근 판정 내역을 한눈에 확인하세요.
                    </p>
                </div>
                {/* ✅ 기존 /history/new 링크 유지 */}
                <Link
                    href="/history/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#4F52B8] hover:bg-[#5254CC] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    새로운 판정하기
                </Link>
            </div>

            {/* ── 요약 카드 3개 (Figma Make SummaryCard.tsx) ── */}
            {/* ✅ 기존 summaryData props 그대로 연결 */}
            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    icon={FolderOpen}
                    value={`${summaryData.totalProjects}개`}
                    label="전체 프로젝트 수"
                    subtext="현재 관리 중인 활성 프로젝트"
                />
                <SummaryCard
                    icon={Sparkles}
                    value={`${summaryData.thisMonthJudgments}건`}
                    label="이번 달 판정 수"
                    subtext="이번 달 기준 누적"
                />
                <SummaryCard
                    icon={ShieldAlert}
                    value={`${summaryData.outOfScopeRate}%`}
                    label="범위 외(Out of Scope) 비율"
                    subtext="스코프 크립 방지 효과"
                    valueColor={
                        summaryData.outOfScopeRate >= 40
                            ? 'text-[#EF4444]'
                            : summaryData.outOfScopeRate >= 20
                                ? 'text-[#F59E0B]'
                                : 'text-[#10B981]'
                    }
                />
            </div>

            {/* ── 최근 판정 내역 테이블 (Figma Make RecentJudgmentsTable.tsx) ── */}
            {/* ✅ 기존 recentJudgments props + StatusBadge 유지 */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
                {/* 테이블 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[var(--text-primary)] text-xl font-semibold">최근 판정 내역</h2>
                    {/* ✅ 기존 /history 링크 유지 */}
                    <Link
                        href="/history"
                        className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        전체보기 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="text-left text-[var(--text-muted)] text-sm font-medium pb-3 w-[150px]">프로젝트명</th>
                                <th className="text-left text-[var(--text-muted)] text-sm font-medium pb-3">요청 내용</th>
                                <th className="text-left text-[var(--text-muted)] text-sm font-medium pb-3 w-[120px]">판정 결과</th>
                                <th className="text-right text-[var(--text-muted)] text-sm font-medium pb-3 w-[120px]">날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentJudgments.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-[var(--border)]/50 hover:bg-[var(--text-primary)]/[0.02] transition-colors cursor-pointer"
                                >
                                    <td className="py-4 text-[var(--text-primary)] text-sm font-medium">{item.projectName}</td>
                                    <td className="py-4 text-[var(--text-muted)] text-sm transition-colors group-hover:text-[var(--text-primary)]">
                                        <span className="line-clamp-1">{item.requestContent}</span>
                                    </td>
                                    <td className="py-4">
                                        {/* ✅ 기존 StatusBadge 컴포넌트 유지 */}
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="py-4 text-gray-400 text-sm text-right">{item.date}</td>
                                </tr>
                            ))}

                            {/* ✅ 기존 빈 상태 처리 유지 */}
                            {recentJudgments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-500 h-24 text-sm">
                                        최근 판정 내역이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
