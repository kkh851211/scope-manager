"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
    const router = useRouter();
    const [projectName, setProjectName] = useState("");
    const [clientName, setClientName] = useState("");
    const [contractScope, setContractScope] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 유효성 검사
        if (!projectName.trim()) {
            setError("프로젝트명을 입력해주세요.");
            return;
        }
        if (!clientName.trim()) {
            setError("클라이언트명을 입력해주세요.");
            return;
        }
        if (!contractScope.trim()) {
            setError("계약 범위를 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: projectName,
                    clientName,
                    contractScope,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "프로젝트 저장 중 오류가 발생했습니다.");
            }

            // 폼 초기화
            setProjectName("");
            setClientName("");
            setContractScope("");

            // 모달 닫기
            onOpenChange(false);

            // 프로젝트 목록 새로고침 
            router.refresh();
            toast.success("프로젝트가 생성되었습니다.");

        } catch (err: any) {
            console.error("Project creation failed:", err);
            setError(err.message || "프로젝트 저장 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>새 프로젝트 생성</DialogTitle>
                    <DialogDescription>
                        클라이언트와 합의된 계약 범위를 등록하여 스코프 관리를 시작하세요.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">프로젝트명 <span className="text-red-500">*</span></Label>
                        <Input
                            id="projectName"
                            placeholder="예) A 쇼핑몰 리뉴얼 프로젝트"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clientName">클라이언트명 <span className="text-red-500">*</span></Label>
                        <Input
                            id="clientName"
                            placeholder="예) (주)알파커머스"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contractScope">계약 범위 (상세) <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="contractScope"
                            placeholder="예) 메인 페이지, 회원가입/로그인, 게시판 CRUD..."
                            value={contractScope}
                            onChange={(e) => setContractScope(e.target.value)}
                            className="min-h-[120px]"
                            disabled={isLoading}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "저장 중..." : "저장"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
