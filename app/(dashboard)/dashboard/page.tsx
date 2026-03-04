"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="공통 컴포넌트 테스트"
                description="새로 생성된 공통 컴포넌트들의 스타일을 확인합니다."
            >
                <Button variant="outline">액션 1</Button>
                <Button>액션 2</Button>
            </PageHeader>

            <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground">1. StatusBadge (상태 뱃지)</h2>
                <div className="flex gap-4 p-6 border rounded-xl bg-card">
                    <StatusBadge status="IN_SCOPE" />
                    <StatusBadge status="OUT_OF_SCOPE" />
                    <StatusBadge status="AMBIGUOUS" />
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground">2. LoadingSpinner (로딩 스피너)</h2>
                <div className="flex gap-8 p-6 border rounded-xl bg-card items-center">
                    <LoadingSpinner />
                    <LoadingSpinner size={32} className="text-blue-500" />
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <LoadingSpinner size={16} /> 텍스트와 함께
                    </span>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-4 text-foreground">3. EmptyState (빈 상태)</h2>
                <EmptyState
                    title="데이터가 없습니다"
                    description="아직 등록된 프로젝트나 판단 히스토리가 없습니다. 새로운 프로젝트를 생성하여 시작해보세요."
                    actionLabel="새 프로젝트 생성"
                    onAction={() => console.log("Button clicked")}
                />
            </section>
        </div>
    );
}
