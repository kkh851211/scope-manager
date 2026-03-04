"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ScopeJudgeFormProps {
    projectId: string;
    contractContent: string;
    onResult: (result: { result: "IN_SCOPE" | "OUT_OF_SCOPE" | "AMBIGUOUS"; confidence: number; reason: string; suggestion: string }) => void;
}

export function ScopeJudgeForm({ projectId, contractContent, onResult }: ScopeJudgeFormProps) {
    const [requesterName, setRequesterName] = useState("");
    const [requestContent, setRequestContent] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!requestContent.trim()) return;

        setIsAnalyzing(true);

        // Mock 2초 지연 후 결과 반환
        setTimeout(() => {
            setIsAnalyzing(false);
            let mockResult;
            if (requestContent.includes("결제") || requestContent.includes("거절")) {
                mockResult = {
                    result: "OUT_OF_SCOPE" as const,
                    confidence: 95,
                    reason: "명시적으로 제외된 결제 기능이 포함되어 있습니다. 이는 계약 범위를 벗어납니다.",
                    suggestion: "클라이언트에게 해당 기능이 추가 과업임을 안내하고, 별도의 기능 추가 계약이나 별도 견적을 안내하세요."
                };
            } else if (requestContent.includes("애매") || requestContent.includes("추가")) {
                mockResult = {
                    result: "AMBIGUOUS" as const,
                    confidence: 60,
                    reason: "요청하신 내용이 서비스 소개 페이지에 포함될 수 있으나, 요구하는 애니메이션 수준이나 페이지 분량에 따라 범위 내가 아닐 수 있습니다.",
                    suggestion: "클라이언트와 미팅을 통해 구체적인 페이지 분량과 애니메이션 요구사항을 파악한 후 범위를 다시 산정하세요."
                };
            } else {
                mockResult = {
                    result: "IN_SCOPE" as const,
                    confidence: 92,
                    reason: "해당 요청은 디자인 및 퍼블리싱 기본 계약 범위에 포함되는 일반적인 수정 혹은 구현 사항입니다.",
                    suggestion: "디자인/개발팀에 전달하여 일정 내 작업을 진행할 수 있도록 일정을 조정하세요."
                };
            }

            onResult(mockResult);
            // 폼 초기화는 지금은 선택사항
            // setRequestContent("");
            // setRequesterName("");
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                    <Label htmlFor="requesterName">요청자 이름 (선택)</Label>
                    <Input
                        id="requesterName"
                        placeholder="홍길동 PM"
                        value={requesterName}
                        onChange={(e) => setRequesterName(e.target.value)}
                        disabled={isAnalyzing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="requestContent">요청 내용 <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="requestContent"
                        placeholder="클라이언트가 요청한 내용을 입력하세요"
                        className="min-h-[120px] resize-none"
                        value={requestContent}
                        onChange={(e) => setRequestContent(e.target.value)}
                        disabled={isAnalyzing}
                        required
                    />
                </div>
            </CardContent>

            <CardFooter>
                <Button type="submit" className="w-full" disabled={isAnalyzing || !requestContent.trim()}>
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            AI가 계약 범위를 분석하고 있어요...
                        </>
                    ) : (
                        "판단하기"
                    )}
                </Button>
            </CardFooter>
        </form>
    );
}
