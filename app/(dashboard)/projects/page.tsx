"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";

// Mock Data
const mockProjects: ProjectCardProps[] = [
    {
        id: "proj-001",
        name: "A 쇼핑몰 리뉴얼",
        clientName: "(주)알파커머스",
        status: "IN_PROGRESS",
        totalRequests: 24,
        lastJudgmentDate: "2026-03-04",
    },
    {
        id: "proj-002",
        name: "B 그룹웨어 구축",
        clientName: "베타소프트",
        status: "IN_PROGRESS",
        totalRequests: 8,
        lastJudgmentDate: "2026-03-03",
    },
    {
        id: "proj-003",
        name: "C 프로모션 사이트",
        clientName: "감마마케팅",
        status: "COMPLETED",
        totalRequests: 45,
        lastJudgmentDate: "2026-02-15",
    },
];

export default function ProjectsPage() {
    // 테스트를 위해 mock 데이터를 상태로 관리 (EmptyState 확인 용도 등)
    const [projects] = useState<ProjectCardProps[]>(mockProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNewProject = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="space-y-8 animate-in fade-in-50 duration-500">
                <PageHeader
                    title="프로젝트 관리"
                    description="진행 중이거나 완료된 모든 프로젝트를 확인하고 관리하세요."
                >
                    <Button onClick={handleNewProject} className="gap-2">
                        <Plus className="h-4 w-4" />
                        새 프로젝트
                    </Button>
                </PageHeader>

                {projects.length === 0 ? (
                    <EmptyState
                        title="등록된 프로젝트가 없습니다"
                        description="새로운 프로젝트를 생성하여 클라이언트의 요구사항을 스코프 매니저로 관리하기 시작하세요."
                        actionLabel="새 프로젝트 생성"
                        onAction={handleNewProject}
                    />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} {...project} />
                        ))}
                    </div>
                )}
            </div>

            <CreateProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}
