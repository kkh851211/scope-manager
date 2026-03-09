import { useState } from 'react';
import { ArrowLeft, FileText, Download, Link2, Mail, Check } from 'lucide-react';

export function ReportGenerator() {
    const [options, setOptions] = useState({
        contractScope: true,
        additionalRequirements: true,
        aiJudgment: true,
        judgmentDate: true,
        estimatedCost: false,
        pmRecommendation: false,
    });

    const [reportGenerated, setReportGenerated] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleGenerateReport = () => {
        setReportGenerated(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleCopyLink = () => {
        const reportUrl = `${window.location.origin}/report/oli-20250315`;
        navigator.clipboard.writeText(reportUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <div className="min-h-screen" style={{
            backgroundColor: '#0f1117',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#e8eaf0'
        }}>
            <div className="mx-auto px-6 py-8" style={{ maxWidth: '760px' }}>
                {/* Header */}
                <div className="mb-8">
                    <button className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-70" style={{ color: '#8c95aa' }}>
                        <ArrowLeft size={20} />
                        <span>추가 요구 목록으로</span>
                    </button>

                    <h1 className="mb-2" style={{ fontSize: '28px', fontWeight: '600', color: '#e8eaf0' }}>
                        범위 초과 판정 리포트
                    </h1>
                    <p style={{ color: '#8c95aa', fontSize: '15px' }}>
                        클라이언트에게 전달할 공식 문서를 자동으로 생성합니다
                    </p>
                </div>

                {/* Summary Card */}
                <div className="mb-6 rounded-xl overflow-hidden" style={{ backgroundColor: '#1a1f2e', border: '1px solid #232b3e' }}>
                    <div style={{ height: '3px', backgroundColor: '#f87171' }} />
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div style={{ color: '#8c95aa', fontSize: '13px', marginBottom: '4px' }}>프로젝트명</div>
                                <div style={{ color: '#e8eaf0', fontSize: '15px', fontWeight: '500' }}>올리브영 리뉴얼 웹사이트</div>
                            </div>
                            <div>
                                <div style={{ color: '#8c95aa', fontSize: '13px', marginBottom: '4px' }}>클라이언트</div>
                                <div style={{ color: '#e8eaf0', fontSize: '15px', fontWeight: '500' }}>(주)올리브영</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div style={{ color: '#8c95aa', fontSize: '13px', marginBottom: '4px' }}>추가 요구 내용</div>
                            <div style={{ color: '#e8eaf0', fontSize: '15px' }}>메인 페이지에 팝업 배너 추가</div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#f8717120', border: '1px solid #f8717140' }}>
                                <span>⚠️</span>
                                <span style={{ color: '#f87171', fontWeight: '500', fontSize: '14px' }}>범위 초과</span>
                            </div>

                            <div className="flex items-center gap-4" style={{ fontSize: '13px', color: '#8c95aa' }}>
                                <div>판정일: <span style={{ color: '#e8eaf0' }}>2025.03.15</span></div>
                                <div>신뢰도: <span style={{ color: '#10b981' }}>92%</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Options Card */}
                <div className="mb-6 rounded-xl overflow-hidden" style={{ backgroundColor: '#1a1f2e', border: '1px solid #232b3e' }}>
                    <div style={{ height: '3px', backgroundColor: '#4f80ff' }} />
                    <div className="p-6">
                        <h3 className="mb-4" style={{ fontSize: '16px', fontWeight: '600', color: '#e8eaf0' }}>
                            리포트 포함 항목 선택
                        </h3>

                        <div className="space-y-3">
                            {[
                                { key: 'contractScope', label: '계약 범위 기능 목록' },
                                { key: 'additionalRequirements', label: '추가 요구 내용' },
                                { key: 'aiJudgment', label: 'AI 판정 결과 및 근거' },
                                { key: 'judgmentDate', label: '판정 일시' },
                                { key: 'estimatedCost', label: '예상 추가 금액 (optional)' },
                                { key: 'pmRecommendation', label: 'PM 권고사항 (optional)' },
                            ].map((option) => (
                                <label key={option.key} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={options[option.key as keyof typeof options]}
                                        onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                                        className="w-5 h-5 rounded cursor-pointer"
                                        style={{
                                            accentColor: '#4f80ff',
                                            backgroundColor: options[option.key as keyof typeof options] ? '#4f80ff' : '#1e2538',
                                        }}
                                    />
                                    <span className="group-hover:text-white transition-colors" style={{ color: '#e8eaf0', fontSize: '14px' }}>
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
                        className="w-full rounded-xl py-4 transition-all hover:brightness-110 active:scale-[0.98]"
                        style={{
                            backgroundColor: '#4f80ff',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(79, 128, 255, 0.3)'
                        }}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <FileText size={20} />
                            리포트 자동 생성
                        </span>
                    </button>
                    <p className="text-center mt-3" style={{ color: '#8c95aa', fontSize: '13px' }}>
                        생성된 리포트는 PDF 다운로드 또는 링크 공유가 가능합니다
                    </p>
                </div>

                {/* Report Preview */}
                {reportGenerated && (
                    <div className="mt-12 animate-in fade-in duration-500">
                        {/* Report Document */}
                        <div className="rounded-xl overflow-hidden shadow-2xl mb-6" style={{ backgroundColor: 'white', aspectRatio: '210/297' }}>
                            {/* Report Header */}
                            <div className="p-8" style={{ backgroundColor: '#0f1117' }}>
                                <div className="flex items-start justify-between mb-4">
                                    <div style={{ color: '#4f80ff', fontSize: '20px', fontWeight: '600' }}>Scope Manager</div>
                                    <div style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>범위 초과 판정 리포트</div>
                                </div>
                                <div style={{ color: '#8c95aa', fontSize: '13px' }}>생성일: 2025년 3월 15일</div>
                            </div>

                            {/* Report Body */}
                            <div className="p-8" style={{ color: '#1f2937' }}>
                                {/* Section 1: Project Info */}
                                <div className="mb-8">
                                    <h3 className="mb-4 pb-2" style={{ fontSize: '16px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                        프로젝트 정보
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4" style={{ fontSize: '14px' }}>
                                        <div>
                                            <div style={{ color: '#6b7280', marginBottom: '4px' }}>프로젝트명</div>
                                            <div style={{ fontWeight: '500' }}>올리브영 리뉴얼 웹사이트</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#6b7280', marginBottom: '4px' }}>클라이언트명</div>
                                            <div style={{ fontWeight: '500' }}>(주)올리브영</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#6b7280', marginBottom: '4px' }}>판정일</div>
                                            <div style={{ fontWeight: '500' }}>2025년 3월 15일</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#6b7280', marginBottom: '4px' }}>담당 PM</div>
                                            <div style={{ fontWeight: '500' }}>김민수</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Judgment Result */}
                                <div className="mb-8">
                                    <div className="rounded-lg p-5" style={{ backgroundColor: '#fef2f2', border: '2px solid #f87171' }}>
                                        <div className="flex items-center gap-2 mb-2" style={{ fontSize: '20px', fontWeight: '600', color: '#dc2626' }}>
                                            <span>⚠️</span>
                                            <span>과업 범위 초과</span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#7f1d1d' }}>
                                            시스템상 과업 범위를 초과한 것으로 기록되었습니다.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 3: Contract Scope */}
                                <div className="mb-8">
                                    <h3 className="mb-4 pb-2" style={{ fontSize: '16px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                        계약 범위 기준
                                    </h3>
                                    <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>계약된 기능 목록</div>
                                    <table className="w-full" style={{ fontSize: '13px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th className="text-left p-3" style={{ fontWeight: '600' }}>기능명</th>
                                                <th className="text-right p-3" style={{ fontWeight: '600' }}>예상 공수</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { name: '메인 페이지 디자인 및 퍼블리싱', hours: '40시간' },
                                                { name: '상품 목록 페이지', hours: '32시간' },
                                                { name: '상품 상세 페이지', hours: '36시간' },
                                                { name: '장바구니 및 결제 플로우', hours: '48시간' },
                                                { name: '마이페이지 및 주문내역', hours: '28시간' },
                                            ].map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td className="p-3">{item.name}</td>
                                                    <td className="p-3 text-right" style={{ color: '#6b7280' }}>{item.hours}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Section 4: Additional Request */}
                                <div className="mb-8">
                                    <h3 className="mb-4 pb-2" style={{ fontSize: '16px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                        추가 요구 내용
                                    </h3>
                                    <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '500', color: '#6b7280' }}>
                                        클라이언트 추가 요구
                                    </div>
                                    <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                                        <p style={{ fontSize: '14px', marginBottom: '8px' }}>메인 페이지에 팝업 배너 추가</p>
                                        <div className="flex gap-4" style={{ fontSize: '12px', color: '#6b7280' }}>
                                            <span>요청 채널: 이메일</span>
                                            <span>요청일: 2025.03.14</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 5: AI Judgment */}
                                <div className="mb-6">
                                    <h3 className="mb-4 pb-2" style={{ fontSize: '16px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                        판정 근거
                                    </h3>
                                    <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '12px' }}>
                                        팝업 배너는 기획 1회, 디자인 작업 1회, 퍼블리싱 및 스크립트 구현이 필요한 별도 기능입니다.
                                        계약서상 메인 페이지 구성에는 팝업 기능이 포함되어 있지 않으며,
                                        UI/UX 요구사항 명세에도 명시되지 않은 추가 기능으로 판정됩니다.
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>
                                        본 판정은 Scope Manager AI 시스템에 의해 자동 생성되었습니다
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 flex-wrap">
                            <button
                                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:brightness-110"
                                style={{ backgroundColor: '#4f80ff', color: 'white', fontWeight: '500', flex: '1', minWidth: '180px' }}
                            >
                                <Download size={18} />
                                PDF 다운로드
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:bg-opacity-10"
                                style={{
                                    backgroundColor: linkCopied ? '#10b98120' : 'transparent',
                                    border: linkCopied ? '1px solid #10b981' : '1px solid #232b3e',
                                    color: linkCopied ? '#10b981' : '#e8eaf0',
                                    fontWeight: '500',
                                    flex: '1',
                                    minWidth: '140px'
                                }}
                            >
                                {linkCopied ? <Check size={18} /> : <Link2 size={18} />}
                                {linkCopied ? '링크 복사됨' : '링크 복사'}
                            </button>

                            <button
                                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:bg-opacity-10 relative"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #232b3e',
                                    color: '#e8eaf0',
                                    fontWeight: '500',
                                    flex: '1',
                                    minWidth: '140px'
                                }}
                            >
                                <Mail size={18} />
                                이메일 발송
                                <span
                                    className="absolute -top-1 -right-1 px-2 py-0.5 rounded text-xs"
                                    style={{ backgroundColor: '#fbbf24', color: '#1f2937', fontSize: '10px', fontWeight: '600' }}
                                >
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
