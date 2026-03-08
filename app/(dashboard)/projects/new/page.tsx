"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ProjectBasicInfo } from '@/components/projects/ProjectBasicInfo';
import { ContractFeatures } from '@/components/projects/ContractFeatures';
import { AIAnalysisResult } from '@/components/projects/AIAnalysisResult';
import { OnboardingModal } from '@/components/projects/OnboardingModal';
import { toast } from "sonner";

// Types
interface AnalysisItem {
    feature: string;
    task: string;
    days: number;
    dailyRate: number;
    amount: number;
}

interface ProjectFormData {
    projectName: string;
    clientName: string;
    startDate: string;
    endDate: string;
    contractAmount: string;
}

export default function NewProjectPage() {
    const router = useRouter();

    // State
    const [formData, setFormData] = useState<ProjectFormData>({
        projectName: '',
        clientName: '',
        startDate: '',
        endDate: '',
        contractAmount: '',
    });

    const [features, setFeatures] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisItem[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Onboarding status check
    const [hasCompletedSurvey, setHasCompletedSurvey] = useState<boolean>(false);
    const [newProjectId, setNewProjectId] = useState<string | null>(null);

    useEffect(() => {
        const checkSurveyStatus = async () => {
            try {
                const res = await fetch('/api/user/onboarding-status');
                if (res.ok) {
                    const { hasCompleted } = await res.json();
                    setHasCompletedSurvey(hasCompleted);
                }
            } catch (error) {
                console.error("Failed to check onboarding status:", error);
            }
        };
        checkSurveyStatus();
    }, []);

    // Handlers
    const handleBasicInfoChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAnalyze = async () => {
        if (!features.trim()) {
            toast.error("기능 설명을 입력해주세요.");
            return;
        }

        setIsAnalyzing(true);

        try {
            // Real API call for analysis (Placeholder for now, keeping mock logic as requested or can use real Claude API)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockResult: AnalysisItem[] = [
                {
                    feature: '반응형 메인 웹사이트',
                    task: 'UI/UX 디자인 및 퍼블리싱',
                    days: 5,
                    dailyRate: 350000,
                    amount: 1750000,
                },
                {
                    feature: '관리자 페이지',
                    task: '대시보드 및 콘텐츠 관리 로직',
                    days: 7,
                    dailyRate: 350000,
                    amount: 2450000,
                }
            ];

            setAnalysisResult(mockResult);

            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        } catch (error) {
            toast.error("분석 중 오류가 발생했습니다.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setAnalysisResult(null);
        setFeatures('');
    };

    const handleCreateProject = async () => {
        if (!formData.projectName || !formData.clientName) {
            toast.error("기본 정보를 모두 입력해주세요.");
            return;
        }

        setIsCreating(true);
        try {
            // 1. Create Project
            const projectResponse = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.projectName,
                    client_name: formData.clientName,
                    start_date: formData.startDate || null,
                    end_date: formData.endDate || null,
                    contract_amount: Number(formData.contractAmount.replace(/[^0-9]/g, "")) || 0,
                    ai_estimated_amount: analysisResult?.reduce((sum, item) => sum + item.amount, 0),
                    ai_estimated_days: analysisResult?.reduce((sum, item) => sum + item.days, 0),
                    status: 'active'
                }),
            });

            if (!projectResponse.ok) throw new Error('프로젝트 생성 실패');
            const project = await projectResponse.json();
            const projectId = project.id;
            setNewProjectId(projectId);

            // 2. Create Contract Features if exist
            if (analysisResult && analysisResult.length > 0) {
                const featuresResponse = await fetch(`/api/projects/${projectId}/contract-features`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(analysisResult.map((item, index) => ({
                        feature_name: item.feature,
                        detail_work: item.task,
                        estimated_days: item.days,
                        daily_rate: item.dailyRate,
                        amount: item.amount,
                        sort_order: index
                    }))),
                });
                if (!featuresResponse.ok) throw new Error('계약 기능 저장 실패');
            }

            toast.success("프로젝트가 생성되었습니다.");

            // 3. Conditional Onboarding Modal or Redirect
            if (!hasCompletedSurvey) {
                setIsModalOpen(true);
            } else {
                router.push(`/projects/${projectId}`);
            }
        } catch (error: any) {
            toast.error(error.message || "프로젝트 생성 중 오류가 발생했습니다.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleModalClose = (surveyResult?: any) => {
        setIsModalOpen(false);

        // Survey result가 있으면 DB 저장 (surveyResult는 OnboardingModal에서 완성된 설문 데이터)
        if (surveyResult) {
            fetch('/api/user/onboarding-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(surveyResult)
            }).catch(err => console.error("Survey submission failed:", err));
        }

        if (newProjectId) {
            router.push(`/projects/${newProjectId}`);
        } else {
            router.push('/projects');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f1117] text-gray-900 dark:text-[#e8eaf0] pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#232b3e]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-[#1e2538] rounded-lg transition-colors text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold">새 프로젝트 생성</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 pt-10 space-y-8">
                {/* Intro Section */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">프로젝트 설계를 시작합니다</h2>
                    <p className="text-gray-500 dark:text-[#8c95aa]">기본 정보와 계약 내용을 입력하면 AI가 적정 범위를 분석해 드립니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <ProjectBasicInfo
                        {...formData}
                        onChange={handleBasicInfoChange}
                    />

                    {/* Features Input */}
                    <ContractFeatures
                        features={features}
                        onChange={setFeatures}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                    />
                </div>

                {/* AI Analysis Result (Inline Display) */}
                {analysisResult && (
                    <div className="pt-4">
                        <AIAnalysisResult
                            items={analysisResult}
                            contractAmount={Number(formData.contractAmount)}
                            onReset={handleReset}
                            onCreateProject={handleCreateProject}
                            isSubmitting={isCreating}
                        />
                    </div>
                )}
            </main>

            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}
