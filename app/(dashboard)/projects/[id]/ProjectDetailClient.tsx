"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

export default function ProjectDetailClient({ project, features, judgmentHistory }: ProjectDetailClientProps) {
    const [activeTab, setActiveTab] = useState<"basic" | "contract" | "requests">("basic");

    const formatDt = (dtStr: string | null) => dtStr ? dtStr.split('T')[0].replace(/-/g, '.') : '-';

    return (
        <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0] py-8 px-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div className="max-w-[900px] mx-auto">
                {/* 헤더 영역 */}
                <div className="mb-8">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-[#8c95aa] hover:text-[#e8eaf0] transition-colors mb-4 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        프로젝트 목록
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[22px] font-bold mb-2">{project.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-[#8c95aa]">
                                <span>{project.client_name || '-'}</span>
                                <span>·</span>
                                <span>{formatDt(project.start_date)} ~ {formatDt(project.end_date)}</span>
                                <span>·</span>
                                <span className="bg-[#4f80ff]/20 text-[#4f80ff] px-3 py-1 rounded-full border border-[#4f80ff]/30 text-xs">
                                    {project.status === 'completed' ? '완료' : project.status === 'paused' ? '보류' : '진행중'}
                                </span>
                            </div>
                        </div>

                        <button className="bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            추가 요구 기록
                        </button>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="border-b border-[#232b3e] mb-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "basic"
                                ? "text-[#4f80ff] font-semibold"
                                : "text-[#8c95aa] hover:text-[#e8eaf0]"
                                }`}
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
                                : "text-[#8c95aa] hover:text-[#e8eaf0]"
                                }`}
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
                                : "text-[#8c95aa] hover:text-[#e8eaf0]"
                                }`}
                        >
                            📌 추가 요구
                            {activeTab === "requests" && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* 탭 컨텐츠 */}
                {activeTab === "basic" && <BasicInfo project={project} />}
                {activeTab === "contract" && <ContractScope features={features} project={project} />}
                {activeTab === "requests" && <AdditionalRequests judgments={judgmentHistory} projectId={project.id} />}
            </div>
        </div>
    );
}
