"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectBasicInfo as BasicInfo } from "@/components/projects/ProjectBasicInfo";
import { ContractFeatures as ContractScope } from "@/components/projects/ContractFeatures";
import { Project, ContractFeature } from "@/types/database";

interface ProjectDetailClientProps {
    project: Project;
    features: ContractFeature[];
    judgmentHistory: Array<{
        id: string;
        date: string;
        request: string;
        result: "범위 내" | "범위 외" | "경계";
        confidence: number;
    }>;
}

export default function ProjectDetail({ project, features, judgmentHistory }: ProjectDetailClientProps) {
    const [activeTab, setActiveTab] = useState<"basic" | "contract" | "requests">("basic");

    const featuresText = features.map(f => `- ${f.feature_name}: ${f.detail_work || ''}`).join('\n');

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f1117] text-gray-900 dark:text-[#e8eaf0] py-8 px-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div className="max-w-[900px] mx-auto">
                <div className="mb-8">
                    <Link href="/projects" className="inline-flex items-center gap-2 text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0] transition-colors mb-4 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        프로젝트 목록
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[22px] font-bold mb-2 text-gray-900 dark:text-white">{project.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#8c95aa]">
                                <span>{project.client_name}</span>
                                <span>·</span>
                                <span>{project.start_date || '-'} ~ {project.end_date || '-'}</span>
                                <span>·</span>
                                <span className="bg-[#4f80ff]/20 text-[#4f80ff] px-3 py-1 rounded-full border border-[#4f80ff]/30 text-xs">
                                    {project.status === 'active' ? '진행중' : '완료'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-[#232b3e] mb-6">
                    <div className="flex gap-8">
                        <button onClick={() => setActiveTab("basic")} className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "basic" ? "text-[#4f80ff] font-semibold" : "text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"}`}>
                            📋 기본 정보
                            {activeTab === "basic" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />}
                        </button>
                        <button onClick={() => setActiveTab("contract")} className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "contract" ? "text-[#4f80ff] font-semibold" : "text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"}`}>
                            ⚖️ 계약 범위
                            {activeTab === "contract" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />}
                        </button>
                        <button onClick={() => setActiveTab("requests")} className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === "requests" ? "text-[#4f80ff] font-semibold" : "text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"}`}>
                            📌 판단 히스토리
                            {activeTab === "requests" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f80ff]" />}
                        </button>
                    </div>
                </div>

                {activeTab === "basic" && (
                    <BasicInfo
                        projectName={project.name}
                        clientName={project.client_name}
                        startDate={project.start_date || ''}
                        endDate={project.end_date || ''}
                        contractAmount={String(project.contract_amount || '')}
                        onChange={() => { }}
                        readOnly={true}
                    />
                )}
                {activeTab === "contract" && (
                    <ContractScope
                        features={featuresText}
                        onChange={() => { }}
                        onAnalyze={() => { }}
                        isAnalyzing={false}
                    />
                )}
                {activeTab === "requests" && (
                    <div className="space-y-4">
                        {judgmentHistory.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-900 dark:text-[#e8eaf0] font-medium">{item.request}</div>
                                    <div className="text-xs text-gray-500 dark:text-[#8c95aa]">{item.date}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.result === "범위 내" ? "bg-emerald-500/20 text-emerald-500" : item.result === "범위 외" ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"}`}>{item.result}</span>
                            </div>
                        ))}
                        {judgmentHistory.length === 0 && <div className="text-center py-12 text-gray-500 dark:text-[#8c95aa]">기록이 없습니다.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
