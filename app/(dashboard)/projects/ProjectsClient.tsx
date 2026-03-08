"use client";

import React, { useState, useMemo } from "react";
import {
    Plus,
    Search,
    Filter,
    LayoutGrid,
    List,
    AlertCircle,
    CheckCircle2,
    Clock,
    Calendar as CalendarIcon,
    ChevronDown,
    X,
    ArrowRight,
    FileText,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ProjectCardProps } from "@/components/projects/ProjectCard";

// Types
type ProjectStatus = "IN_PROGRESS" | "COMPLETED";

interface Project extends ProjectCardProps {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    totalRequests: number;
    lastJudgmentDate: string;
    isScopeExceeded: boolean;
    createdAt: string;
    amount: number;
}

interface FilterState {
    search: string;
    status: "ALL" | ProjectStatus;
    showExceededOnly: boolean;
    startDate: string;
    endDate: string;
}

// Mock Data
const mockProjects: Project[] = [
    {
        id: "1",
        name: "올리브영 리뉴얼 웹사이트",
        clientName: "(주)올리브영",
        status: "IN_PROGRESS",
        totalRequests: 8,
        lastJudgmentDate: "2025-03-08",
        isScopeExceeded: true,
        createdAt: "2025-02-15",
        amount: 5000000
    },
    {
        id: "2",
        name: "스타벅스 프로모션 페이지",
        clientName: "SCK컴퍼니",
        status: "IN_PROGRESS",
        totalRequests: 3,
        lastJudgmentDate: "2025-03-05",
        isScopeExceeded: false,
        createdAt: "2025-02-28",
        amount: 3500000
    },
    {
        id: "3",
        name: "당근마켓 관리자 시스템",
        clientName: "(주)당근",
        status: "COMPLETED",
        totalRequests: 12,
        lastJudgmentDate: "2025-02-20",
        isScopeExceeded: false,
        createdAt: "2024-12-10",
        amount: 8000000
    },
    {
        id: "4",
        name: "토스 하반기 캠페인",
        clientName: "비바리퍼블리카",
        status: "IN_PROGRESS",
        totalRequests: 0,
        lastJudgmentDate: "-",
        isScopeExceeded: false,
        createdAt: "2025-03-01",
        amount: 4500000
    },
    {
        id: "5",
        name: "배달의민족 API 연동",
        clientName: "(주)우아한형제들",
        status: "COMPLETED",
        totalRequests: 5,
        lastJudgmentDate: "2025-03-02",
        isScopeExceeded: true,
        createdAt: "2025-01-20",
        amount: 6200000
    },
    {
        id: "6",
        name: "무신사 스토어 고도화",
        clientName: "(주)무신사",
        status: "IN_PROGRESS",
        totalRequests: 15,
        lastJudgmentDate: "2025-03-07",
        isScopeExceeded: true,
        createdAt: "2025-01-15",
        amount: 12000000
    }
];

export default function ProjectsClient() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"CARD" | "TABLE">("CARD");
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        status: "ALL",
        showExceededOnly: false,
        startDate: "",
        endDate: ""
    });

    // Stats calculation
    const stats = useMemo(() => {
        const total = mockProjects.length;
        const inProgress = mockProjects.filter(p => p.status === "IN_PROGRESS").length;
        const exceeded = mockProjects.filter(p => p.isScopeExceeded).length;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const completedThisMonth = mockProjects.filter(p => {
            const date = new Date(p.lastJudgmentDate);
            return p.status === "COMPLETED" &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;
        }).length;

        return [
            { label: "전체 프로젝트", value: total, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "진행 중", value: inProgress, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "범위 초과", value: exceeded, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "이번 달 완료", value: completedThisMonth, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ];
    }, []);

    // Filtering logic
    const filteredProjects = useMemo(() => {
        return mockProjects.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.clientName.toLowerCase().includes(filters.search.toLowerCase());
            const matchesStatus = filters.status === "ALL" || p.status === filters.status;
            const matchesExceeded = !filters.showExceededOnly || p.isScopeExceeded;

            let matchesDate = true;
            if (filters.startDate) {
                matchesDate = matchesDate && new Date(p.createdAt) >= new Date(filters.startDate);
            }
            if (filters.endDate) {
                matchesDate = matchesDate && new Date(p.createdAt) <= new Date(filters.endDate);
            }

            return matchesSearch && matchesStatus && matchesExceeded && matchesDate;
        });
    }, [filters]);

    const handleNewProject = () => {
        router.push('/projects/new');
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            status: "ALL",
            showExceededOnly: false,
            startDate: "",
            endDate: ""
        });
    };

    const setQuickDate = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        setFilters(prev => ({
            ...prev,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f1117] p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="프로젝트 관리"
                description="진행 중이거나 완료된 모든 프로젝트를 확인하고 관리하세요."
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 dark:bg-[#1e2538] p-1 rounded-lg border border-gray-200 dark:border-[#232b3e]">
                        <button
                            onClick={() => setViewMode("CARD")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "CARD" ? 'bg-white dark:bg-[#2a3348] text-[#4f80ff] shadow-sm' : 'text-gray-500 dark:text-[#8c95aa]'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("TABLE")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "TABLE" ? 'bg-white dark:bg-[#2a3348] text-[#4f80ff] shadow-sm' : 'text-gray-500 dark:text-[#8c95aa]'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <Button onClick={handleNewProject} className="bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white gap-2">
                        <Plus className="h-4 w-4" />
                        새 프로젝트
                    </Button>
                </div>
            </PageHeader>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-5 transition-all hover:border-[#4f80ff]/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <TrendingUp size={16} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-[#e8eaf0]">{stat.value}</div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#5a5f73]" size={18} />
                        <Input
                            placeholder="프로젝트명 또는 클라이언트명 검색"
                            className="pl-10 bg-white dark:bg-[#1e2538] border-gray-200 dark:border-[#232b3e] text-gray-900 dark:text-[#e8eaf0] focus:ring-[#4f80ff]/20 placeholder:text-gray-400 dark:placeholder:text-[#5a5f73]"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    {/* Status Select */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-[#c5c8d4]">상태:</span>
                        <div className="flex bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg p-1">
                            {["ALL", "IN_PROGRESS", "COMPLETED"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilters(prev => ({ ...prev, status: s as any }))}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filters.status === s
                                            ? 'bg-[#4f80ff] text-white shadow-sm'
                                            : 'text-gray-500 dark:text-[#8c95aa] hover:text-gray-700 dark:hover:text-[#c5c8d4]'
                                        }`}
                                >
                                    {s === "ALL" ? "전체" : s === "IN_PROGRESS" ? "진행 중" : "완료"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Exceeded Toggle */}
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, showExceededOnly: !prev.showExceededOnly }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${filters.showExceededOnly
                                ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                : 'bg-white dark:bg-[#1e2538] border-gray-200 dark:border-[#232b3e] text-gray-600 dark:text-[#c5c8d4] hover:border-red-500/30'
                            }`}
                    >
                        <AlertCircle size={16} />
                        범위 초과만 보기
                    </button>
                </div>

                {/* Date Filter & Quick Select */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-[#232b3e]">
                    <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-gray-400 dark:text-[#8c95aa]" />
                        <span className="text-sm font-medium text-gray-700 dark:text-[#c5c8d4]">등록 기간:</span>
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                className="w-40 bg-white dark:bg-[#1e2538] border-gray-200 dark:border-[#232b3e] text-sm h-9"
                                value={filters.startDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                            <span className="text-gray-400">~</span>
                            <Input
                                type="date"
                                className="w-40 bg-white dark:bg-[#1e2538] border-gray-200 dark:border-[#232b3e] text-sm h-9"
                                value={filters.endDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {[
                            { label: "오늘", days: 0 },
                            { label: "최근 7일", days: 7 },
                            { label: "최근 30일", days: 30 },
                        ].map((q) => (
                            <button
                                key={q.label}
                                onClick={() => setQuickDate(q.days)}
                                className="px-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] text-gray-600 dark:text-[#c5c8d4] hover:border-[#4f80ff] hover:text-[#4f80ff] transition-all"
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.status !== "ALL" || filters.showExceededOnly || filters.startDate || filters.endDate) && (
                <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-semibold text-gray-400 dark:text-[#5a5f73] uppercase tracking-wider mr-1">활성 필터:</span>
                    {filters.search && (
                        <Badge className="bg-[#4f80ff]/10 text-[#4f80ff] border border-[#4f80ff]/20 gap-1 pr-1.5">
                            검색: {filters.search}
                            <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({ ...prev, search: "" }))} />
                        </Badge>
                    )}
                    {filters.status !== "ALL" && (
                        <Badge className="bg-[#4f80ff]/10 text-[#4f80ff] border border-[#4f80ff]/20 gap-1 pr-1.5">
                            상태: {filters.status === "IN_PROGRESS" ? "진행 중" : "완료"}
                            <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({ ...prev, status: "ALL" }))} />
                        </Badge>
                    )}
                    {filters.showExceededOnly && (
                        <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 gap-1 pr-1.5">
                            범위 초과
                            <X size={14} className="cursor-pointer hover:text-gray-700" onClick={() => setFilters(prev => ({ ...prev, showExceededOnly: false }))} />
                        </Badge>
                    )}
                    {(filters.startDate || filters.endDate) && (
                        <Badge className="bg-[#4f80ff]/10 text-[#4f80ff] border border-[#4f80ff]/20 gap-1 pr-1.5">
                            기간: {filters.startDate || '...'} ~ {filters.endDate || '...'}
                            <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setFilters(prev => ({ ...prev, startDate: "", endDate: "" }))} />
                        </Badge>
                    )}
                    <button
                        onClick={resetFilters}
                        className="text-xs text-gray-500 dark:text-[#8c95aa] hover:text-[#4f80ff] flex items-center gap-1 ml-2 transition-colors font-medium"
                    >
                        <X size={14} /> 필터 초기화
                    </button>
                </div>
            )}

            {/* Content Area */}
            {filteredProjects.length === 0 ? (
                <EmptyState
                    title="검색 결과가 없습니다"
                    description="필터 조건을 변경하거나 새로운 프로젝트를 생성해 보세요."
                    actionLabel="필터 초기화"
                    onAction={resetFilters}
                />
            ) : viewMode === "CARD" ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group relative">
                            {project.isScopeExceeded && (
                                <div className="absolute -top-2 -right-2 z-10 animate-bounce">
                                    <Badge className="bg-red-500 text-white border-none shadow-lg px-2 py-0.5 text-xs font-bold">
                                        범위 초과 주의!
                                    </Badge>
                                </div>
                            )}
                            <div className={`h-full transition-all bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden hover:border-[#4f80ff] hover:shadow-xl hover:shadow-[#4f80ff]/5 ${project.isScopeExceeded ? 'ring-1 ring-red-500/30' : ''}`}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-[#e8eaf0] group-hover:text-[#4f80ff] transition-colors mb-1">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-[#8c95aa]">{project.clientName}</p>
                                        </div>
                                        <Badge className={`${project.status === "COMPLETED"
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-[#4f80ff]/10 text-[#4f80ff] border-[#4f80ff]/20"
                                            }`}>
                                            {project.status === "COMPLETED" ? "완료" : "진행 중"}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3 py-4 border-t border-gray-100 dark:border-[#232b3e]">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-[#c5c8d4]">
                                            <FileText className="w-4 h-4 mr-2.5 text-gray-400 dark:text-[#8c95aa]" />
                                            <span>총 판단 요청: <strong className="text-gray-900 dark:text-[#e8eaf0]">{project.totalRequests}건</strong></span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-[#c5c8d4]">
                                            <Clock className="w-4 h-4 mr-2.5 text-gray-400 dark:text-[#8c95aa]" />
                                            <span>마지막 판단: <span className="text-gray-900 dark:text-[#e8eaf0]">{project.lastJudgmentDate}</span></span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between mt-2 text-gray-500 dark:text-[#8c95aa] hover:text-[#4f80ff] hover:bg-[#4f80ff]/5 group-hover:bg-[#4f80ff]/5"
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                    >
                                        상세 정보 보기
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#1e2538] border-b border-gray-200 dark:border-[#232b3e]">
                                    <th className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-[#e8eaf0]">프로젝트명 / 클라이언트</th>
                                    <th className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-[#e8eaf0]">상태</th>
                                    <th className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-[#e8eaf0]">판단 요청</th>
                                    <th className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-[#e8eaf0]">마지막 판단일</th>
                                    <th className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-[#e8eaf0]">계약 금액</th>
                                    <th className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-[#e8eaf0] text-right">작업</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#232b3e]">
                                {filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-gray-50 dark:hover:bg-[#1e2538]/50 transition-colors group cursor-pointer"
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-[#e8eaf0] group-hover:text-[#4f80ff] transition-colors">{project.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-[#8c95aa]">{project.clientName}</div>
                                                </div>
                                                {project.isScopeExceeded && (
                                                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] h-5 px-1.5 uppercase font-bold">
                                                        범위 초과
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge className={
                                                project.status === "COMPLETED"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-[#4f80ff]/10 text-[#4f80ff] border-[#4f80ff]/20"
                                            }>
                                                {project.status === "COMPLETED" ? "완료" : "진행 중"}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-gray-700 dark:text-[#c5c8d4] font-medium">{project.totalRequests}건</td>
                                        <td className="py-4 px-6 text-gray-500 dark:text-[#8c95aa] text-sm">{project.lastJudgmentDate}</td>
                                        <td className="py-4 px-6 text-gray-700 dark:text-[#c5c8d4] font-mono">₩{project.amount.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-right">
                                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#4f80ff]">
                                                <ArrowRight size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
