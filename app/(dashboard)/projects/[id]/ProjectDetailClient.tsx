"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScopeJudgeForm } from "@/components/scope/ScopeJudgeForm";
import { ScopeJudgeResult, Judgment } from "@/components/scope/ScopeJudgeResult";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface ProjectDetailClientProps {
    project: {
        id: string;
        name: string;
        client: string;
        status: string;
        scopeText: string;
    };
    judgmentHistory: Array<{
        id: string;
        date: string;
        request: string;
        result: "범위 내" | "범위 외" | "경계";
        confidence: number;
    }>;
}

export default function ProjectDetailClient({ project, judgmentHistory }: ProjectDetailClientProps) {
    const [judgmentResult, setJudgmentResult] = useState<{
        judgment: Judgment;
        confidence: number;
        reason: string;
        suggestion: string;
    } | null>(null);

    return (
        <div className="flex-1 min-h-screen bg-gray-50 dark:bg-[#111318] space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{project.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-gray-500 dark:text-gray-400">{project.client}</span>
                        <Badge variant={project.status === "진행중" ? "default" : "secondary"} className={project.status === "진행중" ? "bg-indigo-600 dark:bg-indigo-600/20 text-white dark:text-indigo-400" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"}>
                            {project.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="judge" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="judge">범위 판단</TabsTrigger>
                    <TabsTrigger value="history">판단 내역</TabsTrigger>
                </TabsList>
                <TabsContent value="judge" className="space-y-4">
                    <Card className="bg-white dark:bg-[#1C1F2E] border-gray-200 dark:border-white/10">
                        <CardHeader className="py-4">
                            <Collapsible>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">계약 범위 (상세)</CardTitle>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <ChevronDown className="h-4 w-4" />
                                            <span className="sr-only">Toggle</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CardDescription className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {project.scopeText?.substring(0, 100)}...
                                </CardDescription>
                                <CollapsibleContent className="mt-4">
                                    <div className="rounded-md border border-gray-100 dark:border-white/5 p-4 bg-gray-50 dark:bg-muted/10 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                                        {project.scopeText}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardHeader>
                        {judgmentResult ? (
                            <div className="p-6 border-t">
                                <ScopeJudgeResult
                                    judgment={judgmentResult.judgment}
                                    confidence={judgmentResult.confidence}
                                    reason={judgmentResult.reason}
                                    suggestion={judgmentResult.suggestion}
                                    onReset={() => setJudgmentResult(null)}
                                />
                            </div>
                        ) : (
                            <ScopeJudgeForm
                                projectId={project.id}
                                contractContent={project.scopeText}
                                onResult={(res) => setJudgmentResult({
                                    judgment: res.result,
                                    confidence: res.confidence,
                                    reason: res.reason,
                                    suggestion: res.suggestion
                                })}
                            />
                        )}
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card className="bg-white dark:bg-[#1C1F2E] border-gray-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle>이 프로젝트의 판단 기록 목록</CardTitle>
                            <CardDescription>
                                AI가 판단한 이전 요청 사항들의 결과입니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>요청일</TableHead>
                                        <TableHead className="w-[400px]">요청 내용</TableHead>
                                        <TableHead>결과</TableHead>
                                        <TableHead className="text-right">신뢰도</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {judgmentHistory.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.date}</TableCell>
                                            <TableCell>{item.request}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.result === "범위 내"
                                                            ? "default"
                                                            : item.result === "범위 외"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {item.result}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(item.confidence * 100).toFixed(0)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {judgmentHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-400 dark:text-gray-500 h-24">
                                                아직 판단 내역이 없습니다.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
