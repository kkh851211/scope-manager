'use client'

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';

type JudgmentState = 'empty' | 'loading' | 'out-of-scope' | 'in-scope';

interface JudgmentResult {
    type: 'out-of-scope' | 'in-scope';
    reason: string;
    judgmentStatus: string;
    needsQuote: string;
    hasContractBasis: string;
}

export function ScopeJudgmentDemo() {
    const [contractScope, setContractScope] = useState('');
    const [newRequest, setNewRequest] = useState('');
    const [state, setState] = useState<JudgmentState>('empty');
    const [result, setResult] = useState<JudgmentResult | null>(null);
    const { theme } = useTheme();

    const contractExamples = [
        '웹사이트 5페이지 제작',
        '쇼핑몰 기본 기능',
        '랜딩 페이지 1개'
    ];

    const requestExamples = [
        '페이지 3개 추가 요청',
        '로그인 기능 추가',
        '디자인 전면 수정',
        '영문 버전 제작'
    ];

    const handleContractChipClick = (text: string) => {
        const fullTexts: Record<string, string> = {
            '웹사이트 5페이지 제작': '- 메인 페이지 1개\n- 서브 페이지 4개 (회사소개, 서비스, 포트폴리오, 문의)\n- 반응형 디자인 포함\n- 기간: 4주\n- 디자인 수정 2회 포함',
            '쇼핑몰 기본 기능': '- 상품 목록 페이지\n- 상품 상세 페이지\n- 장바구니 기능\n- 결제 연동 (PG사 제공)\n- 관리자 페이지 (상품 등록/수정)\n- 기간: 6주',
            '랜딩 페이지 1개': '- 랜딩 페이지 1개 제작\n- PC/모바일 반응형\n- 애니메이션 효과 포함\n- 디자인 시안 2회 수정\n- 기간: 2주'
        };
        setContractScope(fullTexts[text] || text);
    };

    const handleRequestChipClick = (text: string) => {
        const fullTexts: Record<string, string> = {
            '페이지 3개 추가 요청': '회사 소개 페이지를 3개로 나눠서 만들어주실 수 있나요? CEO 인사말, 연혁, 조직도 페이지로요.',
            '로그인 기능 추가': '회원 로그인 기능이랑 마이페이지도 추가해주실 수 있을까요?',
            '디자인 전면 수정': '전체적인 디자인 컨셉을 바꾸고 싶은데, 처음부터 다시 디자인해주실 수 있나요?',
            '영문 버전 제작': '영어 버전 사이트도 같이 만들어주실 수 있나요? 번역은 저희가 할게요.'
        };
        setNewRequest(fullTexts[text] || text);
    };

    const handleJudge = async () => {
        if (!contractScope.trim() || !newRequest.trim()) return;

        setState('loading');

        try {
            const response = await fetch('/api/judge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contract: contractScope,
                    request: newRequest
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'API request failed');
            }

            const data = await response.json();
            const isOutOfScope = data.result === '초과';

            setState(isOutOfScope ? 'out-of-scope' : 'in-scope');
            setResult({
                type: isOutOfScope ? 'out-of-scope' : 'in-scope',
                reason: data.reason,
                judgmentStatus: data.result,
                needsQuote: data.needsQuote ? '필요' : '불필요',
                hasContractBasis: '있음'
            });
        } catch (error: any) {
            console.error('Judgment error:', error);
            setState('empty');
            alert(error.message || '판정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const showCTA = state === 'out-of-scope' || state === 'in-scope';
    const isButtonDisabled = !contractScope.trim() || !newRequest.trim() || state === 'loading';

    return (
        <div style={{ background: theme === 'dark' ? '#0F1117' : '#F5F7FA', minHeight: '100vh', padding: '80px 24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{
                        color: '#4F80FF',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        직접 체험해보세요
                    </div>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: theme === 'dark' ? '#E8EAF0' : '#1A1F2E',
                        marginBottom: '12px',
                        lineHeight: '1.3'
                    }}>
                        계약 범위 기준으로 AI가 판정합니다
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: theme === 'dark' ? '#8C95AA' : '#5A6478',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        계약서 내용과 새 요청을 입력하면 범위 초과 여부를 즉시 판정해드립니다. 회원가입 없이 무료 체험 가능합니다
                    </p>
                </div>

                {/* Main Demo Card */}
                <div style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    background: theme === 'dark' ? '#1A1F2E' : '#FFFFFF',
                    border: '1px solid ' + (theme === 'dark' ? '#232B3E' : '#D1D9E6'),
                    borderRadius: '12px',
                    padding: '32px'
                }}>
                    {/* Input Area 1 - Contract Scope */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            color: theme === 'dark' ? '#E8EAF0' : '#1A1F2E',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                        }}>
                            📋 계약서 / 요구사항 정의
                        </label>
                        <p style={{
                            fontSize: '12px',
                            color: theme === 'dark' ? '#8C95AA' : '#5A6478',
                            marginBottom: '8px'
                        }}>
                            기존에 합의된 작업 범위를 입력해주세요
                        </p>
                        <textarea
                            value={contractScope}
                            onChange={(e) => setContractScope(e.target.value)}
                            placeholder={'예) \n- 메인 페이지 1개\n- 서브 페이지 3개 (회사소개, 서비스, 문의)\n- 반응형 디자인 포함\n- 기간: 4주\n- 디자인 수정 2회 포함'}
                            style={{
                                width: '100%',
                                height: '140px',
                                background: theme === 'dark' ? '#0F1117' : '#F5F7FA',
                                border: '1px solid ' + (theme === 'dark' ? '#232B3E' : '#D1D9E6'),
                                borderRadius: '8px',
                                padding: '12px 16px',
                                color: theme === 'dark' ? '#E8EAF0' : '#1A1F2E',
                                fontSize: '14px',
                                resize: 'none',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F80FF'}
                            onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#232B3E' : '#D1D9E6'}
                        />

                        {/* Contract Example Chips */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '12px'
                        }}>
                            {contractExamples.map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => handleContractChipClick(chip)}
                                    style={{
                                        background: 'rgba(79, 128, 255, 0.1)',
                                        border: '1px solid rgba(79, 128, 255, 0.3)',
                                        borderRadius: '20px',
                                        padding: '4px 12px',
                                        fontSize: '11px',
                                        color: '#4F80FF',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(79, 128, 255, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(79, 128, 255, 0.1)';
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider with Arrow */}
                    <div style={{
                        position: 'relative',
                        height: '1px',
                        background: '#232B3E',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '32px',
                            height: '32px',
                            background: '#1A1F2E',
                            border: '1px solid #232B3E',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#4F80FF',
                            fontSize: '18px'
                        }}>
                            ↓
                        </div>
                    </div>

                    {/* Input Area 2 - New Request */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            color: theme === 'dark' ? '#E8EAF0' : '#1A1F2E',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                        }}>
                            💬 클라이언트 새 요청
                        </label>
                        <p style={{
                            fontSize: '12px',
                            color: theme === 'dark' ? '#8C95AA' : '#5A6478',
                            marginBottom: '8px'
                        }}>
                            클라이언트가 새로 요청한 내용을 입력해주세요
                        </p>
                        <textarea
                            value={newRequest}
                            onChange={(e) => setNewRequest(e.target.value)}
                            placeholder="예) 쇼핑몰 기능도 추가해주실 수 있나요? 상품 등록이랑 결제 기능이요."
                            style={{
                                width: '100%',
                                height: '100px',
                                background: theme === 'dark' ? '#0F1117' : '#F5F7FA',
                                border: '1px solid ' + (theme === 'dark' ? '#232B3E' : '#D1D9E6'),
                                borderRadius: '8px',
                                padding: '12px 16px',
                                color: theme === 'dark' ? '#E8EAF0' : '#1A1F2E',
                                fontSize: '14px',
                                resize: 'none',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F80FF'}
                            onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#232B3E' : '#D1D9E6'}
                        />

                        {/* Request Example Chips */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '12px'
                        }}>
                            {requestExamples.map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => handleRequestChipClick(chip)}
                                    style={{
                                        background: 'rgba(79, 128, 255, 0.1)',
                                        border: '1px solid rgba(79, 128, 255, 0.3)',
                                        borderRadius: '20px',
                                        padding: '4px 12px',
                                        fontSize: '11px',
                                        color: '#4F80FF',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(79, 128, 255, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(79, 128, 255, 0.1)';
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Judge Button */}
                    <button
                        onClick={handleJudge}
                        disabled={isButtonDisabled}
                        style={{
                            width: '100%',
                            height: '48px',
                            background: !isButtonDisabled ? '#4F80FF' : '#232B3E',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: !isButtonDisabled ? 'pointer' : 'not-allowed',
                            transition: 'background 0.2s',
                            marginBottom: '24px',
                            opacity: isButtonDisabled ? 0.4 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isButtonDisabled) {
                                e.currentTarget.style.background = '#3A6BDD';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isButtonDisabled) {
                                e.currentTarget.style.background = '#4F80FF';
                            }
                        }}
                        title={isButtonDisabled && state !== 'loading' ? '계약 범위와 새 요청을 모두 입력해주세요' : ''}
                    >
                        {isButtonDisabled && state !== 'loading' ? '계약 범위와 새 요청을 모두 입력해주세요' : '범위 판정하기 →'}
                    </button>

                    {/* Result Area */}
                    {state === 'empty' && (
                        <div style={{
                            height: '160px',
                            border: '1px dashed #232B3E',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <div style={{ fontSize: '32px' }}>🔍</div>
                            <p style={{
                                color: '#8C95AA',
                                fontSize: '13px'
                            }}>
                                판정 결과가 여기에 표시됩니다
                            </p>
                        </div>
                    )}

                    {state === 'loading' && (
                        <div style={{
                            height: '160px',
                            border: '1px dashed #232B3E',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}>
                            <Loader2
                                size={32}
                                style={{
                                    color: '#4F80FF',
                                    animation: 'spin 1s linear infinite'
                                }}
                            />
                            <p style={{
                                color: '#8C95AA',
                                fontSize: '13px'
                            }}>
                                계약 내용을 분석 중입니다...
                            </p>
                        </div>
                    )}

                    {(state === 'out-of-scope' || state === 'in-scope') && result && (
                        <div style={{
                            background: result.type === 'out-of-scope'
                                ? 'rgba(248, 113, 113, 0.08)'
                                : 'rgba(16, 185, 129, 0.08)',
                            border: `1px solid ${result.type === 'out-of-scope'
                                ? 'rgba(248, 113, 113, 0.3)'
                                : 'rgba(16, 185, 129, 0.3)'}`,
                            borderRadius: '8px',
                            padding: '20px'
                        }}>
                            {/* Top Row */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    background: result.type === 'out-of-scope'
                                        ? 'rgba(248, 113, 113, 0.15)'
                                        : 'rgba(16, 185, 129, 0.15)',
                                    color: result.type === 'out-of-scope' ? '#F87171' : '#10B981',
                                    borderRadius: '20px',
                                    padding: '4px 12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {result.type === 'out-of-scope' ? '⚠️ 범위 초과' : '✓ 범위 내'}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#8C95AA'
                                }}>
                                    AI 판정 완료
                                </div>
                            </div>

                            {/* Judgment Text */}
                            <p style={{
                                fontSize: '14px',
                                color: '#E8EAF0',
                                lineHeight: '1.7',
                                marginBottom: '16px'
                            }}>
                                {result.reason}
                            </p>

                            {/* Divider */}
                            <div style={{
                                height: '1px',
                                background: '#232B3E',
                                marginBottom: '16px'
                            }} />

                            {/* Bottom Stats */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{
                                    background: '#0F1117',
                                    border: '1px solid #232B3E',
                                    borderRadius: '8px',
                                    padding: '10px 16px',
                                    flex: '1',
                                    minWidth: '140px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#8C95AA',
                                        marginBottom: '4px'
                                    }}>
                                        판정 결과
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: result.type === 'out-of-scope' ? '#F87171' : '#10B981',
                                        fontWeight: '600'
                                    }}>
                                        {result.judgmentStatus}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#0F1117',
                                    border: '1px solid #232B3E',
                                    borderRadius: '8px',
                                    padding: '10px 16px',
                                    flex: '1',
                                    minWidth: '140px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#8C95AA',
                                        marginBottom: '4px'
                                    }}>
                                        추가 견적
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: result.type === 'out-of-scope' ? '#F87171' : '#10B981',
                                        fontWeight: '600'
                                    }}>
                                        {result.needsQuote}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#0F1117',
                                    border: '1px solid #232B3E',
                                    borderRadius: '8px',
                                    padding: '10px 16px',
                                    flex: '1',
                                    minWidth: '140px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#8C95AA',
                                        marginBottom: '4px'
                                    }}>
                                        계약 근거
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#10B981',
                                        fontWeight: '600'
                                    }}>
                                        {result.hasContractBasis}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom CTA */}
                    {showCTA && (
                        <>
                            <div style={{
                                height: '1px',
                                background: '#232B3E',
                                margin: '32px 0 24px'
                            }} />
                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: '13px',
                                    color: '#8C95AA',
                                    marginBottom: '16px'
                                }}>
                                    실제 프로젝트에 적용하고 싶다면
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    <button style={{
                                        background: '#4F80FF',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#3A6BDD'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#4F80FF'}
                                    >
                                        무료로 시작하기 →
                                    </button>
                                    <button style={{
                                        background: 'transparent',
                                        color: '#8C95AA',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        border: '1px solid #232B3E',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#4F80FF';
                                            e.currentTarget.style.color = '#4F80FF';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#232B3E';
                                            e.currentTarget.style.color = '#8C95AA';
                                        }}
                                    >
                                        기능 더 보기
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}