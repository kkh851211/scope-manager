"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Grid3x3, List, AlertTriangle, CheckCircle, X } from "lucide-react";

interface Project {
    id: string;
    name: string;
    clientName: string;
    status: "IN_PROGRESS" | "COMPLETED";
    totalRequests: number;
    lastJudgmentDate: string;
}

interface ProjectsClientProps {
    projects: Project[];
}

type QuickDateFilter = "이번 달" | "최근 3개월" | "올해" | null;

export default function ProjectList({ projects: initialProjects }: ProjectsClientProps) {
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"전체" | "진행중" | "완료" | "보류">("전체");
    const [showExceededOnly, setShowExceededOnly] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quickDateFilter, setQuickDateFilter] = useState<QuickDateFilter>(null);

    // 빠른 날짜 선택
    const handleQuickDateSelect = (filter: QuickDateFilter) => {
        const today = new Date();
        let start = "";
        let end = "";

        if (filter === "이번 달") {
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            start = `${year}-${String(month).padStart(2, "0")}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            end = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;
        } else if (filter === "최근 3개월") {
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(today.getMonth() - 3);
            start = threeMonthsAgo.toISOString().split("T")[0];
            end = today.toISOString().split("T")[0];
        } else if (filter === "올해") {
            const year = today.getFullYear();
            start = `${year}-01-01`;
            end = `${year}-12-31`;
        }

        setStartDate(start);
        setEndDate(end);
        setQuickDateFilter(filter);
    };

    // 날짜 필터 초기화
    const clearDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setQuickDateFilter(null);
    };

    // 필터링 로직
    const filteredProjects = initialProjects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.clientName.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === "진행중") matchesStatus = project.status === "IN_PROGRESS";
        else if (statusFilter === "완료") matchesStatus = project.status === "COMPLETED";

        const matchesExceeded = !showExceededOnly || project.totalRequests > 0;

        // 날짜 필터링
        let matchesDate = true;
        if (startDate || endDate) {
            const projectDate = new Date(project.lastJudgmentDate);
            if (startDate) matchesDate = matchesDate && projectDate >= new Date(startDate);
            if (endDate) matchesDate = matchesDate && projectDate <= new Date(endDate);
        }

        return matchesSearch && matchesStatus && matchesExceeded && matchesDate;
    });

    // 활성 필터 개수 계산
    const activeFilterCount = [
        statusFilter !== "전체",
        showExceededOnly,
        startDate || endDate,
    ].filter(Boolean).length;

    // 모든 필터 초기화
    const resetAllFilters = () => {
        setSearchQuery("");
        setStatusFilter("전체");
        setShowExceededOnly(false);
        clearDateFilter();
    };

    // 통계 계산
    const totalProjects = initialProjects.length;
    const inProgressProjects = initialProjects.filter((p) => p.status === "IN_PROGRESS").length;
    const exceededProjects = initialProjects.filter((p) => p.totalRequests > 0).length;
    const completedThisMonth = initialProjects.filter(p => p.status === "COMPLETED").length;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "IN_PROGRESS":
                return { bg: "bg-[#4f80ff]/20", text: "text-[#4f80ff]", border: "border-[#4f80ff]/30", label: "진행중" };
            case "COMPLETED":
                return { bg: "bg-[#10b981]/20", text: "text-[#10b981]", border: "border-[#10b981]/30", label: "완료" };
            default:
                return { bg: "bg-[#8c95aa]/20", text: "text-[#8c95aa]", border: "border-[#8c95aa]/30", label: "기타" };
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0] py-12 px-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div className="max-w-[1060px] mx-auto">
                <h1 className="text-2xl font-bold mb-8">프로젝트 목록</h1>

                {/* 상단 요약 대시보드 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden">
                        <div className="text-2xl font-bold text-[#e8eaf0] mb-1">{totalProjects}개</div>
                        <div className="text-sm text-[#8c95aa]">전체 프로젝트</div>
                    </div>

                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#4f80ff]" />
                        <div className="text-2xl font-bold text-[#4f80ff] mb-1">{inProgressProjects}개</div>
                        <div className="text-sm text-[#8c95aa]">진행중</div>
                    </div>

                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#f87171]" />
                        <div className="text-2xl font-bold text-[#f87171] mb-1">{exceededProjects}개</div>
                        <div className="text-sm text-[#8c95aa]">판단 기록 보유</div>
                    </div>

                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#10b981]" />
                        <div className="text-2xl font-bold text-[#10b981] mb-1">{completedThisMonth}개</div>
                        <div className="text-sm text-[#8c95aa]">완료</div>
                    </div>
                </div>

                {/* 검색 & 필터 바 */}
                <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-4 mb-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c95aa]" />
                            <input
                                type="text"
                                placeholder="프로젝트명 또는 클라이언트명 검색"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1e2538] border border-[#232b3e] rounded-lg pl-10 pr-4 py-2 text-sm text-[#e8eaf0] placeholder:text-[#8c95aa] focus:outline-none focus:border-[#4f80ff]"
                            />
                        </div>

                        <Link href="/projects/new">
                            <button className="bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0">
                                + 새 프로젝트
                            </button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 flex-wrap">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="bg-[#1e2538] border border-[#232b3e] rounded-lg px-4 py-2 text-sm text-[#e8eaf0] focus:outline-none focus:border-[#4f80ff]"
                            >
                                <option value="전체">전체 상태</option>
                                <option value="진행중">진행중</option>
                                <option value="완료">완료</option>
                            </select>

                            <button
                                onClick={() => setShowExceededOnly(!showExceededOnly)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showExceededOnly
                                    ? "bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30"
                                    : "bg-[#1e2538] text-[#8c95aa] border border-[#232b3e]"
                                    }`}
                            >
                                ⚠️ 기록 있음
                            </button>
                        </div>

                        <div className="flex items-center gap-1 bg-[#1e2538] border border-[#232b3e] rounded-lg p-1">
                            <button onClick={() => setViewMode("card")} className={`p-2 rounded ${viewMode === "card" ? "bg-[#4f80ff] text-white" : "text-[#8c95aa]"}`}><Grid3x3 className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode("table")} className={`p-2 rounded ${viewMode === "table" ? "bg-[#4f80ff] text-white" : "text-[#8c95aa]"}`}><List className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* 카드 뷰 */}
                {viewMode === "card" && (
                    <div className="grid grid-cols-3 gap-4">
                        {filteredProjects.map((p) => {
                            const info = getStatusInfo(p.status);
                            return (
                                <Link href={`/projects/${p.id}`} key={p.id}>
                                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 hover:border-[#4f80ff] transition-all">
                                        <div className="flex justify-between mb-4">
                                            <span className={`${info.bg} ${info.text} px-3 py-1 rounded-full text-xs border ${info.border}`}>{info.label}</span>
                                            {p.totalRequests > 0 && <span className="bg-[#f87171]/20 text-[#f87171] px-3 py-1 rounded-full text-xs border border-[#f87171]/30">{p.totalRequests}건</span>}
                                        </div>
                                        <h3 className="font-semibold text-[#e8eaf0] mb-2">{p.name}</h3>
                                        <p className="text-sm text-[#8c95aa]">{p.clientName}</p>
                                        <p className="text-xs text-[#5a5f73] mt-2">최근 활동: {p.lastJudgmentDate}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
