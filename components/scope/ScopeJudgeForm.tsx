"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

        try {
            const res = await fetch("/api/judge-scope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    contractContent,
                    clientRequest: requestContent,
                    requesterName,
                }),
            });

            if (!res.ok) {
                throw new Error("API Error");
            }

            const data = await res.json();
            if (data.success && data.data) {
                onResult({
                    result: data.data.judgment,
                    confidence: data.data.confidence,
                    reason: data.data.reason,
                    suggestion: data.data.suggestion,
                });
            } else {
                throw new Error(data.error || "Unknown Error");
            }
        } catch (error) {
            console.error("판단 실패:", error);
            toast.error("판단 중 오류가 발생했어요. 다시 시도해주세요.");
        } finally {
            setIsAnalyzing(false);
        }
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
