"use client";

import React from "react";
import { ArrowRight, FileText, Pickaxe, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, StatusType } from "@/components/common/StatusBadge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface DashboardClientProps {
    summaryData: {
        totalProjects: number;
        thisMonthJudgments: number;
        outOfScopeRate: number;
    };
    recentJudgments: {
        id: string;
        projectName: string;
        requestContent: string;
        status: StatusType;
        date: string;
    }[];
}

export default function DashboardClient({ summaryData, recentJudgments }: DashboardClientProps) {
    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
            <PageHeader
                title="대시보드"
                description="전체 프로젝트 현황과 최근 판단 내역을 한눈에 확인하세요."
            >
                <Button asChild className="gap-2">
                    <Link href="/history/new">
                        <Pickaxe className="h-4 w-4" />
                        새로운 판단하기
                    </Link>
                </Button>
            </PageHeader>

            {/* 1. 요약 카드 3개 */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">전체 프로젝트 수</CardTitle>
                        <FolderOpenIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryData.totalProjects}개</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            현재 관리 중인 활성 프로젝트
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">이번 달 판단 수</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryData.thisMonthJudgments}건</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            이번 달 기준 누적
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">범위 외(Out of Scope) 비율</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-600">{summaryData.outOfScopeRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            스코프 크립 방지 효과
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. 최근 판단 내역 5개 */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">최근 판단 내역</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground gap-1">
                        <Link href="/history">
                            전체보기 <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[150px]">프로젝트명</TableHead>
                                    <TableHead>요청 내용</TableHead>
                                    <TableHead className="w-[120px] text-center">결과</TableHead>
                                    <TableHead className="w-[120px] text-right">날짜</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentJudgments.map((item) => (
                                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-medium text-foreground">{item.projectName}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <span className="line-clamp-1">{item.requestContent}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground text-sm">{item.date}</TableCell>
                                    </TableRow>
                                ))}
                                {recentJudgments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                            최근 판단 내역이 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// 아이콘 헬퍼용
function FolderOpenIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
        </svg>
    );
}
