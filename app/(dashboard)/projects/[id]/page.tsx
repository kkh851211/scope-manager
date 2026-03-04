"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScopeJudgeForm } from "@/components/scope/ScopeJudgeForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data
const project = {
    id: "1",
    name: "알파 웹사이트 리뉴얼",
    client: "스타트업 A",
    status: "진행중",
    scopeText: "1. 메인 페이지 디자인 및 퍼블리싱 (반응형)\n2. 회사 소개 페이지\n3. 서비스 소개 페이지\n4. 문의하기 폼 개발 (메일 연동)\n5. 간단한 관리자 페이지 제공\n\n* 포함되지 않는 사항:\n- 결제 기능\n- 다국어 지원\n- 복잡한 애니메이션 효과",
};

const judgmentHistory = [
    {
        id: "1",
        date: "2024-03-01",
        request: "결제 모듈 연동 추가 가능한가요?",
        result: "범위 외",
        confidence: 0.95,
    },
    {
        id: "2",
        date: "2024-03-02",
        request: "문의하기 폼에 파일 첨부 기능 넣어주세요.",
        result: "경계",
        confidence: 0.6,
    },
    {
        id: "3",
        date: "2024-03-04",
        request: "회사 소개 페이지에 연혁 섹션 추가원합니다.",
        result: "범위 내",
        confidence: 0.9,
    },
];

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-muted-foreground">{project.client}</span>
                        <Badge variant={project.status === "진행중" ? "default" : "secondary"}>
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
                    <Card>
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
                                <CardDescription className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                    1. 메인 페이지 디자인 및 퍼블리싱 (반응형) 2. 회사 소개 페이지 3. 서비스 소개 페이지...
                                </CardDescription>
                                <CollapsibleContent className="mt-4">
                                    <div className="rounded-md border p-4 bg-muted/50 whitespace-pre-wrap text-sm">
                                        {project.scopeText}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardHeader>
                        <ScopeJudgeForm
                            projectId={project.id}
                            contractContent={project.scopeText}
                            onResult={(res) => alert(`판단 결과: ${res.result}\n신뢰도: ${(res.confidence * 100).toFixed(0)}%\n이유: ${res.reason}`)}
                        />
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card>
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
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
