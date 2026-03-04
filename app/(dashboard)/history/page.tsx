"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export type Judgment = "IN_SCOPE" | "OUT_OF_SCOPE" | "AMBIGUOUS";

interface HistoryItem {
    id: string;
    date: string;
    projectName: string;
    request: string;
    judgment: Judgment;
    confidence: number;
    reason: string;
    suggestion: string;
}

// 10 mock data items
const mockHistory: HistoryItem[] = [
    {
        id: "10",
        date: "2024-03-10",
        projectName: "알파 웹사이트 리뉴얼",
        request: "메인 페이지의 로고 사이즈를 조금 더 키우고 색상을 변경해주실 수 있나요?",
        judgment: "IN_SCOPE",
        confidence: 96,
        reason: "간단한 CSS 스타일 변경 및 이미지 크기 조정은 기본 디자인 수정 범위에 포함됩니다.",
        suggestion: "로고 에셋을 전달받아 크기 및 색상을 신속하게 수정 반영하세요."
    },
    {
        id: "9",
        date: "2024-03-09",
        projectName: "알파 웹사이트 리뉴얼",
        request: "사용자 로그인 및 회원가입 페이지에서 카카오, 네이버 간편 로그인을 추가해주세요.",
        judgment: "OUT_OF_SCOPE",
        confidence: 95,
        reason: "소셜 간편 로그인 연동은 백엔드 및 OAuth 설정이 수반되는 추가 기능 개발입니다.",
        suggestion: "고객에게 소셜 로그인 추가 견적을 산정하여 전달하고, 별도의 협의를 진행하세요."
    },
    {
        id: "8",
        date: "2024-03-08",
        projectName: "베타 쇼핑몰 구축",
        request: "메인 슬라이더 배너에 동영상 자동 재생 애니메이션을 추가해주세요. 용량이 좀 큰 영상입니다.",
        judgment: "AMBIGUOUS",
        confidence: 55,
        reason: "배너 영상 삽입은 가능하지만, 대용량 영상의 경우 트래픽 최적화 작업이 별도로 필요할 수 있습니다.",
        suggestion: "영상의 길이나 포맷을 먼저 확인하고 웹 최적화 작업이 추가 과업인지 논의하세요."
    },
    {
        id: "7",
        date: "2024-03-07",
        projectName: "감마 어드민 플랫폼",
        request: "대시보드 통계 페이지에서 사용자 접속 로그 다운로드 (엑셀) 기능을 넣어주세요.",
        judgment: "OUT_OF_SCOPE",
        confidence: 88,
        reason: "Excel 다운로드 기능 구현 및 데이터 포맷팅 로직은 당초 기획 범위에 포함되어 있지 않은 백엔드 작업입니다.",
        suggestion: "Excel 추출 모듈 추가 개발 비용을 산정하여 고객사에 제안하세요."
    },
    {
        id: "6",
        date: "2024-03-06",
        projectName: "알파 웹사이트 리뉴얼",
        request: "회사 소개 페이지 텍스트 중 '2023년'을 '2024년'으로 일괄 수정 요청드립니다.",
        judgment: "IN_SCOPE",
        confidence: 99,
        reason: "단순 텍스트 문구 수정은 통상적인 퍼블리싱/유지보수 작업 범위 내입니다.",
        suggestion: "요청 즉시 담당자에게 할당하여 단순 텍스트 변경을 처리하세요."
    },
    {
        id: "5",
        date: "2024-03-05",
        projectName: "베타 쇼핑몰 구축",
        request: "상품 상세 페이지 하단에 관련 상품을 AI로 추천해주는 영역을 새로 만들어주세요.",
        judgment: "OUT_OF_SCOPE",
        confidence: 98,
        reason: "AI 추천 로직 연동 및 신규 섹션 UI/UX 기획/개발은 계약된 상세 페이지 템플릿 구현 범위를 크게 초과합니다.",
        suggestion: "이 기능은 추천 솔루션 도입이나 별도 엔진 개발이 필요한 '추가 프로젝트'로 안내해야 합니다."
    },
    {
        id: "4",
        date: "2024-03-04",
        projectName: "알파 웹사이트 리뉴얼",
        request: "게시판 리스트 형태를 갤러리 형태로 볼 수 있는 토글 버튼을 추가해주시면 좋겠습니다.",
        judgment: "AMBIGUOUS",
        confidence: 65,
        reason: "기존 데이터 구조로 갤러리 뷰 구현이 가능할지, 아니면 썸네일 추가 등 DB 수정이 수반될지 모호합니다.",
        suggestion: "게시물 내 이미지 필수 첨부 여부를 확인한 후, 프론트엔드 작업만으로 가능한지 파악하세요."
    },
    {
        id: "3",
        date: "2024-03-03",
        projectName: "감마 어드민 플랫폼",
        request: "결제 내역 페이지에서 날짜순 기본 정렬을 금액순 정렬로 변경해주세요.",
        judgment: "IN_SCOPE",
        confidence: 94,
        reason: "테이블 데이터의 기본 정렬 기준 변경은 보통 추가 과업이 아닌 단순 로직 수정에 해당합니다.",
        suggestion: "정렬 기준(orderBy) 파라미터만 금액순으로 변경하여 배포하세요."
    },
    {
        id: "2",
        date: "2024-03-02",
        projectName: "베타 쇼핑몰 구축",
        request: "무통장 입금 결제 시 확인용 자동 SMS 발송 연동을 지원해주세요.",
        judgment: "OUT_OF_SCOPE",
        confidence: 96,
        reason: "외부 SMS API 연동 및 발송 자동화 처리는 명백한 신규 기능(백엔드) 개발입니다.",
        suggestion: "SMS 제공 업체 선정부터 API 연동까지의 비용을 포함한 추가 견적을 제시하세요."
    },
    {
        id: "1",
        date: "2024-03-01",
        projectName: "알파 웹사이트 리뉴얼",
        request: "모바일에서 볼 때 상단 헤더 메뉴가 잘 안 눌리는 것 같습니다. 터치 영역을 늘려주세요.",
        judgment: "IN_SCOPE",
        confidence: 98,
        reason: "반응형 웹의 모바일 사용성 개선(오류 수정)은 통상적인 하자 보수 혹은 퍼블리싱 완성도 영역입니다.",
        suggestion: "CSS padding 설정을 조정하여 모바일 터치 영역을 충분히 확보하세요."
    }
];

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

export default function HistoryPage() {
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

    const filteredItems = mockHistory.filter(item =>
        filter === "ALL" ? true : item.judgment === filter
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const truncateString = (str: string, num: number) => {
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
                        const config = judgmentConfig[item.judgment];
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
