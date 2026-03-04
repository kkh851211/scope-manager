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

// Mock Data
const summaryData = {
    totalProjects: 12,
    thisMonthJudgments: 45,
    outOfScopeRate: 28,
};

const recentJudgments = [
    {
        id: "J-001",
        projectName: "A 쇼핑몰 리뉴얼",
        requestContent: "결제 페이지 내 네이버페이, 카카오페이 간편결제 수단 추가 연동 및 UI 수정 요청건",
        status: "OUT_OF_SCOPE" as StatusType,
        date: "2026-03-04",
    },
    {
        id: "J-002",
        projectName: "B 그룹웨어 구축",
        requestContent: "메인 대시보드 로그인 영역 폰트 사이즈 14px에서 16px로 변경",
        status: "IN_SCOPE" as StatusType,
        date: "2026-03-03",
    },
    {
        id: "J-003",
        projectName: "C 프로모션 사이트",
        requestContent: "이벤트 응모 시 휴대폰 본인인증(KCB) 단계 추가 도입 및 어드민 확인 기능",
        status: "AMBIGUOUS" as StatusType,
        date: "2026-03-02",
    },
    {
        id: "J-004",
        projectName: "A 쇼핑몰 리뉴얼",
        requestContent: "장바구니 담기 후 애니메이션 효과를 위에서 아래로 떨어지는 형태로 변경",
        status: "IN_SCOPE" as StatusType,
        date: "2026-03-01",
    },
    {
        id: "J-005",
        projectName: "D 스타트업 랜딩",
        requestContent: "뉴스레터 구독 기능을 이메일 수집뿐만 아니라 SMS 알림톡 발송 기능까지 확장",
        status: "OUT_OF_SCOPE" as StatusType,
        date: "2026-02-28",
    },
];

export default function DashboardPage() {
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
                            +12% 지난달 대비 증가
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
