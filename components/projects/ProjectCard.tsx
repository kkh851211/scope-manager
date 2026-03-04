import React from "react";
import Link from "next/link";
import { Calendar, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ProjectCardProps {
    id: string;
    name: string;
    clientName: string;
    status: "IN_PROGRESS" | "COMPLETED";
    totalRequests: number;
    lastJudgmentDate?: string;
}

export function ProjectCard({
    id,
    name,
    clientName,
    status,
    totalRequests,
    lastJudgmentDate,
}: ProjectCardProps) {
    const isCompleted = status === "COMPLETED";

    return (
        <Link href={`/projects/${id}`} className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{clientName}</p>
                    </div>
                    <Badge
                        variant={isCompleted ? "secondary" : "default"}
                        className={
                            isCompleted
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-none"
                        }
                    >
                        {isCompleted ? "완료" : "진행중"}
                    </Badge>
                </CardHeader>

                <CardContent className="pt-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>총 판단 요청: <strong className="text-foreground">{totalRequests}건</strong></span>
                        </div>
                        {lastJudgmentDate && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>마지막 판단: {lastJudgmentDate}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4 border-t mt-auto">
                    <div className="w-full flex items-center justify-between text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        상세 보기
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
