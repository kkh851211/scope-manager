"use client";

import { useState, useEffect } from 'react';
import { Download, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ReportData {
    project_name: string;
    client_name: string;
    request_content: string;
    judgment_result: 'in_scope' | 'out_of_scope' | 'unclear';
    reasoning: string;
    contract_features: any[];
    created_at: string;
    recommendation: string;
}

export default function SharedReport() {
    const params = useParams();
    const reportId = params.reportId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/reports/${reportId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReportData(data.report_data);
                } else {
                    const errData = await res.json();
                    throw new Error(errData.error || '리포트를 찾을 수 없습니다.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (reportId) {
            fetchReport();
        }
    }, [reportId]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-[#4f80ff] animate-spin" />
            </div>
        );
    }

    if (error || !reportData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold mb-2">리포트를 불러올 수 없습니다</h1>
                <p className="text-gray-500 mb-6">{error || '유효하지 않은 링크이거나 만료되었습니다.'}</p>
                <Link href="/" className="text-[#4f80ff] font-medium hover:underline">
                    Scope Manager 홈으로 가기
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background-color: white !important;
                    }
                    .print-shadow-none {
                        shadow: none !important;
                        box-shadow: none !important;
                        border: 1px solid #eee !important;
                    }
                    .print-p-0 {
                        padding: 0 !important;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 transition-colors no-print">
                <div className="mx-auto px-6 py-4 flex items-center justify-between max-w-[900px]">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-[#4f80ff] text-xl font-bold tracking-tight">
                            Scope Manager
                        </Link>
                        <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />
                        <h1 className="text-sm font-medium text-gray-500 hidden sm:block">
                            범위 초과 판정 리포트
                        </h1>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white font-medium transition-all active:scale-[0.98] shadow-lg shadow-[#4f80ff]/20 text-sm"
                    >
                        <Download size={16} />
                        PDF 저장
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-[900px] print-p-0">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 print-shadow-none">
                    {/* Report Header */}
                    <div className="p-8 sm:p-10 bg-[#0f1117] text-white">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                            <div className="text-[#4f80ff] text-2xl font-bold">Scope Manager</div>
                            <div className="text-lg sm:text-xl font-medium">범위 초과 판정 리포트</div>
                        </div>
                        <div className="text-gray-400 text-sm">생성일: {reportData.created_at}</div>
                    </div>

                    {/* Report Body */}
                    <div className="p-6 sm:p-10 text-gray-800 bg-white">
                        {/* Section 1: Project Info */}
                        <div className="mb-10">
                            <h2 className="text-lg font-bold mb-5 pb-3 border-b-2 border-gray-100">
                                프로젝트 정보
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[15px]">
                                <div>
                                    <div className="text-gray-400 mb-1 text-sm">프로젝트명</div>
                                    <div className="font-semibold text-gray-900">{reportData.project_name}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1 text-sm">클라이언트명</div>
                                    <div className="font-semibold text-gray-900">{reportData.client_name}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1 text-sm">판정일</div>
                                    <div className="font-semibold text-gray-900">{reportData.created_at}</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Judgment Result */}
                        <div className="mb-10">
                            <div className={`rounded-xl p-6 border-2 ${reportData.judgment_result === 'in_scope'
                                    ? 'bg-green-50 border-green-100 text-green-800'
                                    : 'bg-red-50 border-red-100 text-red-800'
                                }`}>
                                <div className={`flex items-center gap-3 mb-3 text-2xl font-bold ${reportData.judgment_result === 'in_scope' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <span>{reportData.judgment_result === 'in_scope' ? '✓' : '⚠️'}</span>
                                    <span>{reportData.judgment_result === 'in_scope' ? '과업 범위 내' : '과업 범위 초과'}</span>
                                </div>
                                <p className="text-[15px] leading-relaxed font-medium">
                                    {reportData.judgment_result === 'in_scope'
                                        ? '분석 결과, 본 요청은 계약된 과업 범위 내에 포함되는 것으로 확인되었습니다.'
                                        : '시스템상 과업 범위를 초과한 것으로 기록되었습니다.'}
                                </p>
                            </div>
                        </div>

                        {/* Section 3: Contract Scope */}
                        <div className="mb-10">
                            <h2 className="text-lg font-bold mb-5 pb-3 border-b-2 border-gray-100">
                                계약 범위 기준
                            </h2>
                            <div className="text-[15px] mb-3 font-semibold text-gray-400">계약된 기능 목록</div>
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b-2 border-gray-100 text-left">
                                            <th className="p-4 font-bold text-gray-700">기능명</th>
                                            <th className="p-4 font-bold text-gray-700 text-right">예상 공수</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {reportData.contract_features && reportData.contract_features.map((item: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 font-medium text-gray-900">{item.feature_name}</td>
                                                <td className="p-4 text-right text-gray-500">{item.estimated_days}일</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section 4: Additional Request */}
                        <div className="mb-10">
                            <h2 className="text-lg font-bold mb-5 pb-3 border-b-2 border-gray-100">
                                추가 요구 내용
                            </h2>
                            <div className="text-[15px] mb-3 font-semibold text-gray-400">
                                클라이언트 추가 요구
                            </div>
                            <div className="rounded-xl p-5 bg-gray-50 border border-gray-200">
                                <p className="text-[15px] font-bold text-gray-900">
                                    {reportData.request_content}
                                </p>
                            </div>
                        </div>

                        {/* Section 5: AI Judgment */}
                        <div className={reportData.recommendation ? "mb-10" : ""}>
                            <h2 className="text-lg font-bold mb-5 pb-3 border-b-2 border-gray-100">
                                판정 근거
                            </h2>
                            <p className="text-[15px] leading-relaxed mb-4 text-gray-800">
                                {reportData.reasoning}
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs italic">
                                <span>🤖</span>
                                <span>본 판정은 Scope Manager AI 시스템에 의해 자동 생성되었습니다</span>
                            </div>
                        </div>

                        {/* Section 6: PM Recommendation */}
                        {reportData.recommendation && (
                            <div>
                                <h2 className="text-lg font-bold mb-5 pb-3 border-b-2 border-gray-100 text-gray-900">
                                    PM 권고사항
                                </h2>
                                <p className="text-[15px] leading-relaxed text-gray-800 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    {reportData.recommendation}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Promotional CTA Section - no-print */}
                <div className="mt-12 p-8 bg-gradient-to-br from-[#4f80ff] to-[#3b60ff] rounded-2xl text-white shadow-xl no-print">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">에이전시 PM의 업무 효율을 높이고 싶으신가요?</h3>
                            <p className="text-white/80 text-sm">AI로 프로젝트 범위를 정확하게 판단하고, 리포트를 1초 만에 생성하세요.</p>
                        </div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 bg-white text-[#4f80ff] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            지금 체험하기
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-400 no-print">
                    <p>
                        이 리포트는{' '}
                        <Link
                            href="/"
                            className="text-[#4f80ff] font-semibold hover:underline"
                        >
                            Scope Manager
                        </Link>
                        에서 자동 생성되었습니다
                    </p>
                    <p className="mt-2">© {new Date().getFullYear()} Scope Manager. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
