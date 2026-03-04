"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ScopeJudgeForm() {
    const [requestText, setRequestText] = useState("");
    const [isJudging, setIsJudging] = useState(false);

    const handleJudge = () => {
        setIsJudging(true);
        setTimeout(() => {
            setIsJudging(false);
            alert("판단 결과: 계약 범위 내입니다.");
        }, 1000);
    };

    return (
        <div className="space-y-4 pt-4">
            <div>
                <h3 className="text-lg font-medium">새로운 요청 판단하기</h3>
                <p className="text-sm text-muted-foreground">
                    클라이언트의 새로운 요청 사항을 입력하면 AI가 계약 범위 포함 여부를 판단합니다.
                </p>
            </div>
            <Textarea
                placeholder="요청 사항을 입력하세요..."
                className="min-h-[150px]"
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
            />
            <div className="flex justify-end">
                <Button onClick={handleJudge} disabled={!requestText || isJudging}>
                    {isJudging ? "판단 중..." : "AI 판단 요청하기"}
                </Button>
            </div>
        </div>
    );
}
