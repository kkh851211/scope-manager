import { Download } from 'lucide-react';
import { useParams } from 'react-router';

export function SharedReport() {
    const { reportId } = useParams();

    return (
        <div className="min-h-screen bg-white" style={{
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#1f2937'
        }}>
            {/* Header */}
            <div className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#fafafa' }}>
                <div className="mx-auto px-6 py-6 flex items-center justify-between" style={{ maxWidth: '900px' }}>
                    <div className="flex items-center gap-8">
                        <div style={{ color: '#4f80ff', fontSize: '22px', fontWeight: '600' }}>
                            Scope Manager
                        </div>
                        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937' }}>
                            범위 초과 판정 리포트
                        </h1>
                    </div>
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:brightness-110"
                        style={{ backgroundColor: '#4f80ff', color: 'white', fontWeight: '500' }}
                    >
                        <Download size={18} />
                        PDF 저장
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="mx-auto px-6 py-12" style={{ maxWidth: '900px' }}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                    {/* Report Header */}
                    <div className="p-10" style={{ backgroundColor: '#0f1117' }}>
                        <div className="flex items-start justify-between mb-5">
                            <div style={{ color: '#4f80ff', fontSize: '24px', fontWeight: '600' }}>Scope Manager</div>
                            <div style={{ color: 'white', fontSize: '20px', fontWeight: '500' }}>범위 초과 판정 리포트</div>
                        </div>
                        <div style={{ color: '#8c95aa', fontSize: '14px' }}>생성일: 2025년 3월 15일</div>
                    </div>

                    {/* Report Body */}
                    <div className="p-10">
                        {/* Section 1: Project Info */}
                        <div className="mb-10">
                            <h2 className="mb-5 pb-3" style={{ fontSize: '18px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                프로젝트 정보
                            </h2>
                            <div className="grid grid-cols-2 gap-6" style={{ fontSize: '15px' }}>
                                <div>
                                    <div style={{ color: '#6b7280', marginBottom: '6px', fontSize: '14px' }}>프로젝트명</div>
                                    <div style={{ fontWeight: '500' }}>올리브영 리뉴얼 웹사이트</div>
                                </div>
                                <div>
                                    <div style={{ color: '#6b7280', marginBottom: '6px', fontSize: '14px' }}>클라이언트명</div>
                                    <div style={{ fontWeight: '500' }}>(주)올리브영</div>
                                </div>
                                <div>
                                    <div style={{ color: '#6b7280', marginBottom: '6px', fontSize: '14px' }}>판정일</div>
                                    <div style={{ fontWeight: '500' }}>2025년 3월 15일</div>
                                </div>
                                <div>
                                    <div style={{ color: '#6b7280', marginBottom: '6px', fontSize: '14px' }}>담당 PM</div>
                                    <div style={{ fontWeight: '500' }}>김민수</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Judgment Result */}
                        <div className="mb-10">
                            <div className="rounded-xl p-6" style={{ backgroundColor: '#fef2f2', border: '2px solid #f87171' }}>
                                <div className="flex items-center gap-3 mb-3" style={{ fontSize: '24px', fontWeight: '600', color: '#dc2626' }}>
                                    <span>⚠️</span>
                                    <span>과업 범위 초과</span>
                                </div>
                                <p style={{ fontSize: '15px', color: '#7f1d1d', lineHeight: '1.6' }}>
                                    시스템상 과업 범위를 초과한 것으로 기록되었습니다.
                                </p>
                            </div>
                        </div>

                        {/* Section 3: Contract Scope */}
                        <div className="mb-10">
                            <h2 className="mb-5 pb-3" style={{ fontSize: '18px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                계약 범위 기준
                            </h2>
                            <div style={{ fontSize: '15px', marginBottom: '12px', fontWeight: '500' }}>계약된 기능 목록</div>
                            <div className="overflow-hidden rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
                                <table className="w-full" style={{ fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                            <th className="text-left p-4" style={{ fontWeight: '600' }}>기능명</th>
                                            <th className="text-right p-4" style={{ fontWeight: '600' }}>예상 공수</th>
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
                                            <tr key={idx} style={{ borderBottom: idx < 4 ? '1px solid #f3f4f6' : 'none' }}>
                                                <td className="p-4">{item.name}</td>
                                                <td className="p-4 text-right" style={{ color: '#6b7280' }}>{item.hours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section 4: Additional Request */}
                        <div className="mb-10">
                            <h2 className="mb-5 pb-3" style={{ fontSize: '18px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                추가 요구 내용
                            </h2>
                            <div style={{ fontSize: '15px', marginBottom: '12px', fontWeight: '500', color: '#6b7280' }}>
                                클라이언트 추가 요구
                            </div>
                            <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: '15px', marginBottom: '12px', fontWeight: '500' }}>
                                    메인 페이지에 팝업 배너 추가
                                </p>
                                <div className="flex gap-6" style={{ fontSize: '13px', color: '#6b7280' }}>
                                    <span>요청 채널: 이메일</span>
                                    <span>요청일: 2025.03.14</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: AI Judgment */}
                        <div className="mb-8">
                            <h2 className="mb-5 pb-3" style={{ fontSize: '18px', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>
                                판정 근거
                            </h2>
                            <p style={{ fontSize: '15px', lineHeight: '1.8', marginBottom: '16px', color: '#374151' }}>
                                팝업 배너는 기획 1회, 디자인 작업 1회, 퍼블리싱 및 스크립트 구현이 필요한 별도 기능입니다.
                                계약서상 메인 페이지 구성에는 팝업 기능이 포함되어 있지 않으며,
                                UI/UX 요구사항 명세에도 명시되지 않은 추가 기능으로 판정됩니다.
                            </p>
                            <p style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
                                본 판정은 Scope Manager AI 시스템에 의해 자동 생성되었습니다
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center" style={{ color: '#9ca3af', fontSize: '14px' }}>
                    <p>
                        이 리포트는{' '}
                        <a
                            href="/"
                            className="hover:underline"
                            style={{ color: '#4f80ff', fontWeight: '500' }}
                        >
                            Scope Manager
                        </a>
                        에서 자동 생성되었습니다
                    </p>
                </div>
            </div>
        </div>
    );
}
