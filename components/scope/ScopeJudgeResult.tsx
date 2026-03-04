import { CheckCircle, XCircle, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export type Judgment = "IN_SCOPE" | "OUT_OF_SCOPE" | "AMBIGUOUS";

interface ScopeJudgeResultProps {
    judgment: Judgment;
    confidence: number;
    reason: string;
    suggestion: string;
    onReset: () => void;
}

const config = {
    IN_SCOPE: {
        icon: CheckCircle,
        title: "범위 내 요청이에요",
        colorText: "text-green-600 dark:text-green-500",
        colorBg: "bg-green-100 dark:bg-green-950",
        progressColor: "bg-green-600 dark:bg-green-500",
    },
    OUT_OF_SCOPE: {
        icon: XCircle,
        title: "범위 외 요청이에요",
        colorText: "text-red-600 dark:text-red-500",
        colorBg: "bg-red-100 dark:bg-red-950",
        progressColor: "bg-red-600 dark:bg-red-500",
    },
    AMBIGUOUS: {
        icon: AlertCircle,
        title: "확인이 필요해요",
        colorText: "text-amber-600 dark:text-amber-500",
        colorBg: "bg-amber-100 dark:bg-amber-950",
        progressColor: "bg-amber-600 dark:bg-amber-500",
    }
};

export function ScopeJudgeResult({ judgment, confidence, reason, suggestion, onReset }: ScopeJudgeResultProps) {
    const { icon: Icon, title, colorText, colorBg, progressColor } = config[judgment];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-1">
            <div className={`flex flex-col items-center justify-center p-6 rounded-lg ${colorBg} border border-border/50`}>
                <Icon className={`h-12 w-12 ${colorText} mb-4`} />
                <h3 className={`text-xl font-bold ${colorText} mb-2`}>{title}</h3>

                <div className="w-full max-w-sm flex items-center gap-4 mt-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">신뢰도</span>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${confidence}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold w-12 text-right">{confidence}%</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">판단 근거</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{reason}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">대응 추천</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{suggestion}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center pt-2">
                <Button onClick={onReset} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    다시 판단하기
                </Button>
            </div>
        </div>
    );
}
