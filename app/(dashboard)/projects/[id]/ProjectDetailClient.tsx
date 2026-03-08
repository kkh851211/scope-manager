"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import BasicInfo from "@/components/projects/basic-info";
import ContractScope from "@/components/projects/contract-scope";
import AdditionalRequests from "@/components/projects/additional-requests";
import { Project, ContractFeature } from "@/types/database";

export interface JudgmentItem {
    id: string;
    date: string;
    request: string;
    result: "범위 내" | "범위 외" | "경계";
    confidence: number;
}

export interface ProjectDetailClientProps {
    project: Project;
    features: ContractFeature[];
    judgmentHistory: JudgmentItem[];
}

export default function ProjectDetailClient({
    project: initialProject,
    features: initialFeatures,
    judgmentHistory: initialJudgmentHistory
}: ProjectDetailClientProps) {
    const [project, setProject] = useState<Project>(initialProject);
    const [features, setFeatures] = useState<ContractFeature[]>(initialFeatures);
    const [judgmentHistory, setJudgmentHistory] = useState<JudgmentItem[]>(initialJudgmentHistory);

    const [activeTab, setActiveTab] = useState<"basic" | "contract" | "requests">("basic");
    const [isLoading, setIsLoading] = useState(false);

    const formatDt = (dtStr: string | null) => dtStr ? dtStr.split('T')[0].replace(/-/g, '.') : '-';

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 프로젝트 기본 정보 갱신
            const projRes = await fetch(`/api/projects/${initialProject.id}`);
            if (projRes.ok) setProject(await projRes.ok ? await projRes.json() : initialProject);

            // 기능 목록 갱신 (계약 범위 탭 접근 시 또는 초기 로드)
            const featRes = await fetch(`/api/projects/${initialProject.id}/contract-features`);
            if (featRes.ok) setFeatures(await featRes.json());

            // 추가 요구 목록 갱신
            const reqRes = await fetch(`/api/projects/${initialProject.id}/requests`);
            if (reqRes.ok) {
                const reqData = await reqRes.json();
                const mappedHistory: JudgmentItem[] = reqData.map((r: any) => {
                    const latestJudgment = r.scope_judgments?.[0]; // Assuming order by created_at desc

                    let result: "범위 내" | "범위 외" | "경계" = "경계";
                    if (latestJudgment?.result === 'in_scope') result = "범위 내";
                    else if (latestJudgment?.result === 'out_of_scope') result = "범위 외";

                    return {
                        id: r.id,
                        date: r.requested_at ? r.requested_at.split('T')[0].replace(/-/g, '.') : '-',
                        request: r.title,
                        result: result,
                        confidence: latestJudgment?.confidence_score || 0
                    };
                });
                setJudgmentHistory(mappedHistory);
            }
        } catch (err) {
            console.error("Failed to refresh data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [initialProject.id]);

    // 초기 로드 시 한 번 갱신 (필요한 경우)
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f1117] text-gray-900 dark:text-[#e8eaf0] py-8 px-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div className="max-w-[900px] mx-auto">
                {/* 헤더 영역 */}
                <div className="mb-8">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0] transition-colors mb-4 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        프로젝트 목록
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-[22px] font-bold text-gray-900 dark:text-[#e8eaf0]">{project.name}</h1>
                                {isLoading && <Loader2 className="w-4 h-4 text-[#4f80ff] animate-spin" />}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#8c95aa]">
                                <span>{project.client_name || '-'}</span>
                                <span>·</span>
                                <span>{formatDt(project.start_date)} ~ {formatDt(project.end_date)}</span>
                                <span>·</span>
                                <span className="bg-[#4f80ff]/20 text-[#4f80ff] px-3 py-1 rounded-full border border-[#4f80ff]/30 text-xs">
                                    {project.status === 'completed' ? '완료' : project.status === 'paused' ? '보류' : '진행중'}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/projects/${project.id}/requests/new`}
                            className="bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            추가 요구 기록
                        </Link>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="border-b border-gray-200 dark:border-[#232b3e] mb-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "basic"
                                ? "text-[#4f80ff] font-semibold"
                                : "text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"
                                } font-['Noto_Sans_KR']`}
                        >
                            📋 기본 정보
                            {activeTab === "basic" && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("contract")}
                            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "contract"
                                ? "text-[#4f80ff] font-semibold"
                                : "text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"
                                } font-['Noto_Sans_KR']`}
                        >
                            ⚖️ 계약 범위
                            {activeTab === "contract" && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "requests"
                                ? "text-[#4f80ff] font-semibold"
                                : "text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"
                                } font-['Noto_Sans_KR']`}
                        >
                            📌 추가 요구
                            {activeTab === "requests" && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* 탭 컨텐츠 */}
                <div className="relative">
                    {activeTab === "basic" && <BasicInfo project={project} />}
                    {activeTab === "contract" && <ContractScope features={features} project={project} />}
                    {activeTab === "requests" && <AdditionalRequests judgments={judgmentHistory} projectId={project.id} />}
                </div>
            </div>
        </div>
    );
}
