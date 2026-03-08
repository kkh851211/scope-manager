"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Grid3x3, List, AlertTriangle, CheckCircle, X } from "lucide-react";
import { ProjectListUIItem } from "./page";

type QuickDateFilter = "이번 달" | "최근 3개월" | "올해" | null;

interface ProjectsClientProps {
    initialProjects: ProjectListUIItem[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"전체" | "진행중" | "완료" | "보류">("전체");
    const [showExceededOnly, setShowExceededOnly] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quickDateFilter, setQuickDateFilter] = useState<QuickDateFilter>(null);

    const projects = initialProjects;

    // 날짜 문자열을 Date 객체로 변환
    const parseDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split(".").map(Number);
        return new Date(year, month - 1, day);
    };

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
    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "전체" || project.status === statusFilter;
        const matchesExceeded = !showExceededOnly || project.scopeExceededCount > 0;

        // 날짜 필터링
        let matchesDate = true;
        if (startDate || endDate) {
            let projectStart: Date | null = null;
            let projectEnd: Date | null = null;
            try {
                if (project.startDate !== '-') projectStart = parseDate(project.startDate);
                if (project.endDate !== '-') projectEnd = parseDate(project.endDate);
            } catch (e) {
                // ignore parsing errors
            }

            if (startDate && projectEnd) {
                const filterStart = new Date(startDate);
                matchesDate = matchesDate && projectEnd >= filterStart;
            }
            if (endDate && projectStart) {
                const filterEnd = new Date(endDate);
                matchesDate = matchesDate && projectStart <= filterEnd;
            }
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
    const totalProjects = projects.length;
    const inProgressProjects = projects.filter((p) => p.status === "진행중").length;
    const exceededProjects = projects.filter((p) => p.scopeExceededCount > 0).length;
    const completedThisMonth = projects.filter((p) => p.status === "완료").length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "진행중":
                return { bg: "bg-[#4f80ff]/20", text: "text-[#4f80ff]", border: "border-[#4f80ff]/30" };
            case "완료":
                return { bg: "bg-[#10b981]/20", text: "text-[#10b981]", border: "border-[#10b981]/30" };
            case "보류":
                return { bg: "bg-[#8c95aa]/20", text: "text-[#8c95aa]", border: "border-[#8c95aa]/30" };
            default:
                return { bg: "bg-[#8c95aa]/20", text: "text-[#8c95aa]", border: "border-[#8c95aa]/30" };
        }
    };

    // 날짜 포맷 변환 (YYYY-MM-DD -> YYYY.MM.DD)
    const formatDateDisplay = (date: string) => {
        return date.replace(/-/g, ".");
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
                        <div className="text-sm text-[#8c95aa]">범위 초과 발생</div>
                    </div>

                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#10b981]" />
                        <div className="text-2xl font-bold text-[#10b981] mb-1">{completedThisMonth}개</div>
                        <div className="text-sm text-[#8c95aa]">이번 달 완료</div>
                    </div>
                </div>

                {/* 검색 & 필터 바 (2줄 구조) */}
                <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-4 mb-6 space-y-4">
                    {/* 1줄: 메인 검색 */}
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

                        <Link href="/projects/new" className="bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 inline-flex items-center justify-center">
                            + 새 프로젝트
                        </Link>
                    </div>

                    {/* 활성 필터 칩 (기간 선택 시) */}
                    {(startDate || endDate) && (
                        <div className="flex items-center gap-2">
                            <span className="bg-[#4f80ff]/[0.12] text-[#4f80ff] border border-[#4f80ff]/30 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                📅 {startDate ? formatDateDisplay(startDate) : "시작일"} ~ {endDate ? formatDateDisplay(endDate) : "종료일"}
                                <button onClick={clearDateFilter} className="hover:text-[#4f80ff]/80">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        </div>
                    )}

                    {/* 2줄: 필터 조건 */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 flex-wrap">
                            {/* 상태 필터 드롭다운 */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="bg-[#1e2538] border border-[#232b3e] rounded-lg px-4 py-2 text-sm text-[#e8eaf0] focus:outline-none focus:border-[#4f80ff]"
                            >
                                <option value="전체">전체</option>
                                <option value="진행중">진행중</option>
                                <option value="완료">완료</option>
                                <option value="보류">보류</option>
                            </select>

                            {/* 범위 초과 필터 토글 */}
                            <button
                                onClick={() => setShowExceededOnly(!showExceededOnly)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showExceededOnly
                                    ? "bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30"
                                    : "bg-[#1e2538] text-[#8c95aa] border border-[#232b3e] hover:text-[#e8eaf0]"
                                    }`}
                            >
                                ⚠️ 범위 초과만
                            </button>

                            {/* 기간 검색 영역 */}
                            <div className="flex items-center gap-2 bg-[#1e2538] border border-[#232b3e] rounded-lg px-3 py-2">
                                <span className="text-xs text-[#8c95aa]">기간</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setQuickDateFilter(null);
                                    }}
                                    className="bg-transparent border-none text-sm text-[#e8eaf0] focus:outline-none w-[110px]"
                                />
                                <span className="text-[#8c95aa]">~</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setQuickDateFilter(null);
                                    }}
                                    className="bg-transparent border-none text-sm text-[#e8eaf0] focus:outline-none w-[110px]"
                                />
                            </div>

                            {/* 빠른 선택 버튼 */}
                            <div className="flex items-center gap-2">
                                {(["이번 달", "최근 3개월", "올해"] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleQuickDateSelect(filter)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${quickDateFilter === filter
                                            ? "bg-[#4f80ff]/20 text-[#4f80ff] border border-[#4f80ff]/30"
                                            : "bg-[#1e2538] text-[#8c95aa] border border-[#232b3e] hover:text-[#e8eaf0]"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* 활성 필터 개수 뱃지 */}
                            {activeFilterCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#4f80ff] font-medium">
                                        필터 {activeFilterCount}개 적용 중
                                    </span>
                                    <button
                                        onClick={resetAllFilters}
                                        className="text-xs text-[#8c95aa] hover:text-[#e8eaf0] transition-colors"
                                    >
                                        초기화
                                    </button>
                                </div>
                            )}

                            {/* 뷰 전환 버튼 */}
                            <div className="flex items-center gap-1 bg-[#1e2538] border border-[#232b3e] rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("card")}
                                    className={`p-2 rounded transition-colors ${viewMode === "card"
                                        ? "bg-[#4f80ff] text-white"
                                        : "text-[#8c95aa] hover:text-[#e8eaf0]"
                                        }`}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`p-2 rounded transition-colors ${viewMode === "table"
                                        ? "bg-[#4f80ff] text-white"
                                        : "text-[#8c95aa] hover:text-[#e8eaf0]"
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 빈 상태 */}
                {filteredProjects.length === 0 && (
                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <Search className="w-16 h-16 text-[#8c95aa] mb-4" />
                            <div className="text-lg text-[#e8eaf0] mb-2">검색 결과가 없습니다</div>
                            <div className="text-sm text-[#8c95aa] mb-4">
                                다른 검색어나 필터를 사용해보세요
                            </div>
                            <button
                                onClick={resetAllFilters}
                                className="text-sm text-[#8c95aa] hover:text-[#e8eaf0] transition-colors"
                            >
                                필터 초기화
                            </button>
                        </div>
                    </div>
                )}

                {/* 카드 뷰 */}
                {viewMode === "card" && filteredProjects.length > 0 && (
                    <div className="grid grid-cols-3 gap-[14px]">
                        {filteredProjects.map((project) => {
                            const statusColors = getStatusColor(project.status);
                            return (
                                <div
                                    key={project.id}
                                    className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl overflow-hidden hover:border-[#4f80ff] hover:-translate-y-1 transition-all duration-200"
                                >
                                    <div className="p-5">
                                        {/* 상단 뱃지 */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span
                                                className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} px-3 py-1 rounded-full text-xs border`}
                                            >
                                                {project.status}
                                            </span>
                                            {project.scopeExceededCount > 0 ? (
                                                <span className="bg-[#f87171]/20 text-[#f87171] px-3 py-1 rounded-full text-xs border border-[#f87171]/30 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {project.scopeExceededCount}건 초과
                                                </span>
                                            ) : (
                                                <span className="bg-[#10b981]/20 text-[#10b981] px-3 py-1 rounded-full text-xs border border-[#10b981]/30 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    정상
                                                </span>
                                            )}
                                        </div>

                                        {/* 본문 */}
                                        <h3 className="text-[15px] font-semibold text-[#e8eaf0] mb-2">
                                            {project.name}
                                        </h3>
                                        <p className="text-[13px] text-[#8c95aa] mb-1">{project.client}</p>
                                        <p className="text-[12px] text-[#8c95aa]">
                                            {project.startDate} ~ {project.endDate}
                                        </p>

                                        {/* 하단 구분선 */}
                                        <div className="border-t border-[#232b3e] mt-4 pt-4 flex items-center justify-between">
                                            <div className="text-[#e8eaf0] font-medium">{project.contractAmount}</div>
                                            <div className="text-sm text-[#8c95aa]">{project.workDays}일</div>
                                        </div>
                                    </div>

                                    {/* 하단 링크 */}
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="block w-full bg-[#1e2538] hover:bg-[#232b3e] px-5 py-3 text-center text-sm text-[#8c95aa] hover:text-[#4f80ff] transition-colors"
                                    >
                                        상세 보기 →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 테이블 뷰 */}
                {viewMode === "table" && filteredProjects.length > 0 && (
                    <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#1e2538] border-b border-[#232b3e]">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        프로젝트명
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        클라이언트
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        기간
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        계약금액
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        공수
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        상태
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        범위초과
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#8c95aa] uppercase">
                                        액션
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project) => {
                                    const statusColors = getStatusColor(project.status);
                                    return (
                                        <tr
                                            key={project.id}
                                            className="border-b border-[#232b3e] hover:bg-[#1e2538] transition-colors"
                                        >
                                            <td className="py-3 px-4 text-[#e8eaf0] font-semibold">{project.name}</td>
                                            <td className="py-3 px-4 text-[#8c95aa]">{project.client}</td>
                                            <td className="py-3 px-4 text-[#8c95aa] text-sm">
                                                {project.startDate} ~ {project.endDate}
                                            </td>
                                            <td className="py-3 px-4 text-right text-[#e8eaf0]">
                                                {project.contractAmount}
                                            </td>
                                            <td className="py-3 px-4 text-right text-[#8c95aa]">{project.workDays}일</td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} px-3 py-1 rounded-full text-xs border inline-block`}
                                                >
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {project.scopeExceededCount > 0 ? (
                                                    <span className="text-[#f87171] text-sm font-medium">
                                                        {project.scopeExceededCount}건
                                                    </span>
                                                ) : (
                                                    <span className="text-[#8c95aa] text-sm">없음</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="text-[#4f80ff] hover:text-[#4f80ff]/80 text-sm transition-colors"
                                                >
                                                    상세 보기
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
