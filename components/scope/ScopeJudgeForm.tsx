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
    onResult: (result: { result: string; confidence: number; reason: string }) => void;
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
            onResult({
                result: "범위 내",
                confidence: 0.92,
                reason: "해당 요청은 디자인 및 퍼블리싱 기본 범위에 포함되는 일반적인 변경 사항입니다."
            });
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
