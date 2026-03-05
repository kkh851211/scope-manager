"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusType } from "@/components/common/StatusBadge";

export type Judgment = "IN_SCOPE" | "OUT_OF_SCOPE" | "AMBIGUOUS";

export interface HistoryItem {
    id: string;
    date: string;
    projectName: string;
    request: string;
    judgment: Judgment;
    confidence: number;
    reason: string;
    suggestion: string;
}

const judgmentConfig = {
    IN_SCOPE: {
        label: "범위 내",
        color: "bg-green-100 text-green-700 hover:bg-green-100",
        icon: CheckCircle,
        iconColor: "text-green-600"
    },
    OUT_OF_SCOPE: {
        label: "범위 외",
        color: "bg-red-100 text-red-700 hover:bg-red-100",
        icon: XCircle,
        iconColor: "text-red-600"
    },
    AMBIGUOUS: {
        label: "확인 필요",
        color: "bg-amber-100 text-amber-700 hover:bg-amber-100",
        icon: AlertCircle,
        iconColor: "text-amber-600"
    }
};

type FilterType = "ALL" | Judgment;

interface HistoryClientProps {
    historyData: HistoryItem[];
}

export default function HistoryClient({ historyData }: HistoryClientProps) {
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Accordion state - tracking open items
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredItems = historyData.filter(item =>
        filter === "ALL" ? true : item.judgment === filter
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const truncateString = (str: string, num: number) => {
        if (!str) return '';
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    };

    // Filter change handler explicitly resetting page
    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
        setCurrentPage(1);
        setOpenItems({}); // Reset accordions on filter change
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">판단 히스토리</h2>
                    <p className="text-muted-foreground mt-2">
                        모든 프로젝트의 AI 계약 범위 판단 내역을 확인할 수 있습니다.
                    </p>
                </div>
            </div>

            <div className="flex space-x-2 border-b pb-4">
                <Button
                    variant={filter === "ALL" ? "default" : "outline"}
                    onClick={() => handleFilterChange("ALL")}
                >
                    전체
                </Button>
                <Button
                    variant={filter === "IN_SCOPE" ? "default" : "outline"}
                    className={filter === "IN_SCOPE" ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : "border-gray-200 text-gray-700"}
                    onClick={() => handleFilterChange("IN_SCOPE")}
                >
                    범위 내
                </Button>
                <Button
                    variant={filter === "OUT_OF_SCOPE" ? "default" : "outline"}
                    className={filter === "OUT_OF_SCOPE" ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : "border-gray-200 text-gray-700"}
                    onClick={() => handleFilterChange("OUT_OF_SCOPE")}
                >
                    범위 외
                </Button>
                <Button
                    variant={filter === "AMBIGUOUS" ? "default" : "outline"}
                    className={filter === "AMBIGUOUS" ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" : "border-gray-200 text-gray-700"}
                    onClick={() => handleFilterChange("AMBIGUOUS")}
                >
                    확인 필요
                </Button>
            </div>

            <div className="space-y-4">
                {paginatedItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-gray-50/50">
                        선택한 조건의 판단 내역이 없습니다.
                    </div>
                ) : (
                    paginatedItems.map((item) => {
                        const config = judgmentConfig[item.judgment] || judgmentConfig["AMBIGUOUS"];
                        const Icon = config.icon;
                        const isOpen = !!openItems[item.id];

                        return (
                            <Collapsible
                                key={item.id}
                                open={isOpen}
                                onOpenChange={() => toggleItem(item.id)}
                            >
                                <Card className={`overflow-hidden transition-colors ${isOpen ? 'border-primary/50 shadow-sm' : 'hover:border-primary/30'}`}>
                                    <CollapsibleTrigger asChild>
                                        <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/5 transition-colors">
                                            <div className="text-sm font-medium text-muted-foreground whitespace-nowrap w-24">
                                                {item.date}
                                            </div>

                                            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 overflow-hidden">
                                                <div className="font-semibold text-sm truncate md:w-48 whitespace-nowrap flex-shrink-0">
                                                    {item.projectName}
                                                </div>
                                                <div className="text-sm text-foreground truncate hidden md:block" title={item.request}>
                                                    {truncateString(item.request, 50)}
                                                </div>
                                                <div className="text-sm text-foreground md:hidden mt-1 line-clamp-2">
                                                    {item.request}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-background shrink-0">
                                                    <div className="text-xs font-medium text-muted-foreground">신뢰도</div>
                                                    <div className="text-sm font-bold">{item.confidence}%</div>
                                                </div>
                                                <Badge className={`${config.color} shrink-0`} variant="secondary">
                                                    {config.label}
                                                </Badge>
                                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <div className="px-4 pb-4 pt-2 border-t bg-muted/20">
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold mb-1 text-muted-foreground">전체 요청 내용</h4>
                                                <p className="text-sm bg-background p-3 rounded border text-foreground leading-relaxed whitespace-pre-wrap">
                                                    {item.request}
                                                </p>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="flex flex-col gap-1.5 p-4 rounded-lg border bg-background">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`h-4 w-4 ${config.iconColor}`} />
                                                        <h4 className="text-sm font-semibold">판단 근거</h4>
                                                    </div>
                                                    <p className="text-sm mt-1 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                        {item.reason}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-1.5 p-4 rounded-lg border bg-background">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4 text-primary" />
                                                        <h4 className="text-sm font-semibold">대응 추천</h4>
                                                    </div>
                                                    <p className="text-sm mt-1 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                        {item.suggestion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
                <div className="flex items-center justify-center space-x-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        이전
                    </Button>
                    <div className="flex items-center text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        다음
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}
