"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, FileText, Download, Link2, Mail, Check, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface ReportData {
    project_name: string;
    client_name: string;
    request_content: string;
    judgment_result: 'in_scope' | 'out_of_scope' | 'unclear';
    reasoning: string;
    contract_features: any[];
    created_at: string;
    recommendation: string;
    report_url: string;
}

export default function ReportGenerator() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const requestId = params.requestId as string;

    const [options, setOptions] = useState({
        contractScope: true,
        additionalRequirements: true,
        aiJudgment: true,
        judgmentDate: true,
        estimatedCost: false,
        pmRecommendation: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. 기존 리포트 여부 확인
    const fetchReport = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/projects/${id}/requests/${requestId}/report`);
            if (res.ok) {
                const data = await res.json();
                setReportData(data.report_data);
            }
        } catch (err) {
            console.error('Failed to fetch report:', err);
        } finally {
            setIsLoading(false);
        }
    }, [id, requestId]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    // 2. 리포트 생성 요청
    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const res = await fetch(`/api/projects/${id}/requests/${requestId}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ options })
            });
            if (res.ok) {
                const data = await res.json();
                setReportData(data.report_data);
            } else {
                const errData = await res.json();
                throw new Error(errData.error || '리포트 생성에 실패했습니다.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    };

    const handleCopyLink = () => {
        if (!reportData) return;
        const reportUrl = `${window.location.origin}${reportData.report_url}`;
        navigator.clipboard.writeText(reportUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f1117]">
                <Loader2 className="w-8 h-8 text-[#4f80ff] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f1117] text-gray-900 dark:text-[#e8eaf0] py-8 px-4" style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background-color: white !important;
                        color: black !important;
                    }
                    .mx-auto {
                        margin: 0 !important;
                        max-width: 100% !important;
                    }
                    .shadow-2xl {
                        box-shadow: none !important;
                        border: 1px solid #eee !important;
                    }
                    .py-8 {
                        padding: 0 !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-[760px]">
                {/* Header - no-print */}
                <div className="mb-8 no-print">
                    <Link
                        href={`/projects/${id}?tab=requests`}
                        className="flex items-center gap-2 mb-6 text-gray-500 dark:text-[#8c95aa] transition-colors hover:text-gray-900 dark:hover:text-[#e8eaf0]"
                    >
                        <ArrowLeft size={20} />
                        <span>추가 요구 목록으로</span>
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                        범위 초과 판정 리포트
                    </h1>
                    <p className="text-gray-500 dark:text-[#8c95aa] text-sm sm:text-base">
                        클라이언트에게 전달할 공식 문서를 자동으로 생성합니다
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 no-print">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Summary Card - no-print */}
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] no-print">
                    <div className={`h-[3px] ${reportData?.judgment_result === 'in_scope' ? 'bg-[#10b981]' : 'bg-[#f87171]'}`} />
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-gray-500 dark:text-[#8c95aa] text-xs mb-1">프로젝트명</div>
                                <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{reportData?.project_name || '로딩 중...'}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-[#8c95aa] text-xs mb-1">클라이언트</div>
                                <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{reportData?.client_name || '-'}</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-gray-500 dark:text-[#8c95aa] text-xs mb-1">추가 요구 내용</div>
                            <div className="text-sm sm:text-base text-gray-900 dark:text-white">{reportData?.request_content || '-'}</div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${reportData?.judgment_result === 'in_scope'
                                ? 'bg-[#10b9811a] border-[#10b98140] text-[#10b981]'
                                : 'bg-[#f871711a] border-[#f8717140] text-[#f87171]'
                                }`}>
                                <span>{reportData?.judgment_result === 'in_scope' ? '✓' : '⚠️'}</span>
                                <span className="font-medium text-sm">
                                    {reportData?.judgment_result === 'in_scope' ? '범위 내' : reportData?.judgment_result === 'out_of_scope' ? '범위 초과' : '판단 필요'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-[#8c95aa]">
                                <div>판정일: <span className="text-gray-900 dark:text-[#e8eaf0]">{reportData?.created_at || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {!reportData && (
                    <div className="no-print">
                        {/* Options Card */}
                        <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e]">
                            <div className="h-[3px] bg-[#4f80ff]" />
                            <div className="p-6 text-gray-900 dark:text-white">
                                <h3 className="mb-4 text-base font-semibold">
                                    리포트 포함 항목 선택
                                </h3>

                                <div className="space-y-3">
                                    {[
                                        { key: 'contractScope', label: '계약 범위 기능 목록' },
                                        { key: 'additionalRequirements', label: '추가 요구 내용' },
                                        { key: 'aiJudgment', label: 'AI 판정 결과 및 근거' },
                                        { key: 'judgmentDate', label: '판정 일시' },
                                        { key: 'pmRecommendation', label: 'PM 권고사항' },
                                    ].map((option) => (
                                        <label key={option.key} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={options[option.key as keyof typeof options]}
                                                onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                                                className="w-5 h-5 rounded cursor-pointer accent-[#4f80ff]"
                                            />
                                            <span className="text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="mb-8">
                            <button
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className="w-full bg-[#4f80ff] hover:bg-[#4f80ff]/90 disabled:opacity-50 text-white rounded-xl py-4 text-base font-semibold transition-all active:scale-[0.98] shadow-lg shadow-[#4f80ff]/20"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                                    {isGenerating ? '리포트 생성 중...' : '리포트 자동 생성'}
                                </span>
                            </button>
                            <p className="text-center mt-3 text-gray-500 dark:text-[#8c95aa] text-xs">
                                생성된 리포트는 PDF 다운로드 또는 링크 공유가 가능합니다
                            </p>
                        </div>
                    </div>
                )}

                {/* Report Preview */}
                {reportData && (
                    <div className="mt-8 animate-in fade-in duration-500">
                        {/* Report Document */}
                        <div className="rounded-xl overflow-hidden shadow-2xl mb-6 bg-white border border-gray-200">
                            {/* Report Header */}
                            <div className="p-8 bg-[#0f1117]">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-[#4f80ff] text-xl font-semibold">Scope Manager</div>
                                    <div className="text-white text-lg font-medium">범위 초과 판정 리포트</div>
                                </div>
                                <div className="text-gray-400 text-xs sm:text-sm">생성일: {reportData.created_at}</div>
                            </div>

                            {/* Report Body */}
                            <div className="p-8 text-gray-800">
                                {/* Section 1: Project Info */}
                                <div className="mb-8">
                                    <h3 className="mb-4 pb-2 text-base font-bold border-b border-gray-200">
                                        프로젝트 정보
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-400 mb-1">프로젝트명</div>
                                            <div className="font-medium text-gray-900">{reportData.project_name}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 mb-1">클라이언트명</div>
                                            <div className="font-medium text-gray-900">{reportData.client_name}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 mb-1">판정일</div>
                                            <div className="font-medium text-gray-900">{reportData.created_at}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Judgment Result */}
                                <div className="mb-8">
                                    <div className={`rounded-lg p-5 border-2 ${reportData.judgment_result === 'in_scope'
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : 'bg-red-50 border-red-200 text-red-800'
                                        }`}>
                                        <div className={`flex items-center gap-2 mb-2 text-xl font-bold ${reportData.judgment_result === 'in_scope' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            <span>{reportData.judgment_result === 'in_scope' ? '✓' : '⚠️'}</span>
                                            <span>{reportData.judgment_result === 'in_scope' ? '과업 범위 내' : '과업 범위 초과'}</span>
                                        </div>
                                        <p className="text-sm">
                                            {reportData.judgment_result === 'in_scope'
                                                ? '분석 결과, 본 요청은 계약된 과업 범위 내에 포함되는 것으로 확인되었습니다.'
                                                : '시스템상 과업 범위를 초과한 것으로 기록되었습니다.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Section 3: Contract Scope */}
                                {options.contractScope && (
                                    <div className="mb-8">
                                        <h3 className="mb-4 pb-2 text-base font-bold border-b border-gray-200">
                                            계약 범위 기준
                                        </h3>
                                        <div className="text-sm font-medium mb-2 text-gray-500">계약된 기능 목록</div>
                                        <div className="border border-gray-100 rounded-lg overflow-hidden">
                                            <table className="w-full text-xs sm:text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100 text-left text-gray-600">
                                                        <th className="p-3 font-semibold">기능명</th>
                                                        <th className="p-3 font-semibold text-right">예상 공수</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-700">
                                                    {reportData.contract_features.map((item: any, idx: number) => (
                                                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                            <td className="p-3 text-gray-900">{item.feature_name}</td>
                                                            <td className="p-3 text-right text-gray-500">{item.estimated_days}일</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Section 4: Additional Request */}
                                {options.additionalRequirements && (
                                    <div className="mb-8">
                                        <h3 className="mb-4 pb-2 text-base font-bold border-b border-gray-200">
                                            추가 요구 내용
                                        </h3>
                                        <div className="text-sm font-semibold text-gray-400 mb-2">
                                            클라이언트 추가 요구
                                        </div>
                                        <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 text-gray-900">
                                            <p className="text-sm">{reportData.request_content}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Section 5: AI Judgment */}
                                {options.aiJudgment && (
                                    <div className={options.pmRecommendation ? "mb-8" : ""}>
                                        <h3 className="mb-4 pb-2 text-base font-bold border-b border-gray-200">
                                            판정 근거
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-3 text-gray-800">
                                            {reportData.reasoning}
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-gray-500 text-[10px] italic">
                                            <span>🤖</span>
                                            <span>본 판정은 Scope Manager AI 시스템에 의해 자동 생성되었습니다</span>
                                        </div>
                                    </div>
                                )}

                                {/* Section 6: PM Recommendation */}
                                {options.pmRecommendation && reportData.recommendation && (
                                    <div>
                                        <h3 className="mb-4 pb-2 text-base font-bold border-b border-gray-200">
                                            PM 권고사항
                                        </h3>
                                        <p className="text-sm text-gray-800 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                            {reportData.recommendation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 flex-wrap no-print">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white font-medium flex-1 min-w-[180px] transition-colors shadow-lg shadow-[#4f80ff]/20"
                            >
                                <Download size={18} />
                                PDF 다운로드
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium flex-1 min-w-[140px] transition-all border ${linkCopied
                                    ? 'bg-green-500/10 border-green-500 text-green-500'
                                    : 'bg-transparent border-gray-200 dark:border-[#232b3e] text-gray-900 dark:text-[#e8eaf0] hover:bg-gray-100 dark:hover:bg-[#1e2538]'
                                    }`}
                            >
                                {linkCopied ? <Check size={18} /> : <Link2 size={18} />}
                                {linkCopied ? '링크 복사됨' : '링크 복사'}
                            </button>

                            <button
                                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-[#232b3e] text-gray-900 dark:text-[#e8eaf0] font-medium flex-1 min-w-[140px] transition-colors hover:bg-gray-100 dark:hover:bg-[#1e2538] relative"
                            >
                                <Mail size={18} />
                                이메일 발송
                                <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded bg-yellow-400 text-gray-900 text-[10px] font-bold shadow-sm">
                                    Starter+
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
