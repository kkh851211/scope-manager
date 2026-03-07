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
            <Card className="h-full transition-all bg-white dark:bg-[#1C1F2E] border-gray-200 dark:border-white/10 hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{clientName}</p>
                    </div>
                    <Badge
                        variant={isCompleted ? "secondary" : "default"}
                        className={
                            isCompleted
                                ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border-none"
                        }
                    >
                        {isCompleted ? "완료" : "진행중"}
                    </Badge>
                </CardHeader>

                <CardContent className="pt-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>총 판단 요청: <strong className="text-gray-900 dark:text-white">{totalRequests}건</strong></span>
                        </div>
                        {lastJudgmentDate && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>마지막 판단: {lastJudgmentDate}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                    <div className="w-full flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        상세 보기
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
