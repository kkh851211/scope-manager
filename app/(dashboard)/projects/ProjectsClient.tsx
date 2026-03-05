"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { useRouter } from "next/navigation";

interface ProjectsClientProps {
    projects: ProjectCardProps[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleNewProject = () => {
        setIsModalOpen(true);
    };

    const handleModalChange = (open: boolean) => {
        setIsModalOpen(open);
        // If modal was closed, refresh the router to fetch new project
        if (!open) {
            router.refresh();
        }
    }

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
                onOpenChange={handleModalChange}
            />
        </>
    );
}
