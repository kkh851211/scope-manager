'use client'

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type JudgmentState = 'empty' | 'loading' | 'out-of-scope' | 'in-scope';

interface JudgmentResult {
    type: 'out-of-scope' | 'in-scope';
    reason: string;
    estimatedTime: string;
    scopeStatus: string;
    needsQuote: string;
}

export function ScopeJudgmentDemo() {
    const [inputText, setInputText] = useState('');
    const [state, setState] = useState<JudgmentState>('empty');
    const [result, setResult] = useState<JudgmentResult | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const exampleChips = [
        '랜딩 페이지 추가 3개 요청',
        '디자인 수정 요청',
        '로그인 기능 추가 요청',
        '텍스트 수정 요청'
    ];

    const handleChipClick = (text: string) => {
        const fullTexts: Record<string, string> = {
            '랜딩 페이지 추가 3개 요청': '랜딩 페이지 외에 회사 소개 페이지 3개를 추가로 만들어 주실 수 있나요?',
            '디자인 수정 요청': '메인 페이지의 색상을 파란색에서 초록색으로 변경해 주실 수 있나요?',
            '로그인 기능 추가 요청': '처음 계약에는 없었는데 로그인 기능을 추가할 수 있을까요?',
            '텍스트 수정 요청': '홈페이지 상단의 "환영합니다" 문구를 "안녕하세요"로 바꿔주세요'
        };
        setInputText(fullTexts[text] || text);
    };

    const handleJudge = async () => {
        if (!inputText.trim()) return;

        setState('loading');

        try {
            const response = await fetch('/api/judge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ request: inputText }),
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
                estimatedTime: isOutOfScope ? '미정' : '1일',
                scopeStatus: data.result,
                needsQuote: data.needsQuote ? '예' : '아니요'
            });
        } catch (error: any) {
            console.error('Judgment error:', error);
            setState('empty');

            // Try to extract more detail if it was a 500 with details
            const message = error.message || '판정 중 오류가 발생했습니다. 다시 시도해주세요.';
            alert(message);
        }
    };

    const showCTA = state === 'out-of-scope' || state === 'in-scope';

    if (!isMounted) return <div style={{ minHeight: '100vh', background: '#0F1117' }} />;

    return (
        <div style={{ background: '#0F1117', minHeight: '100vh', padding: '80px 24px' }}>
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
                        color: 'white',
                        marginBottom: '12px',
                        lineHeight: '1.3'
                    }}>
                        클라이언트 요청, 범위 초과인지 바로 확인하세요
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#8C95AA'
                    }}>
                        회원가입 없이 무료로 체험할 수 있습니다
                    </p>
                </div>

                {/* Main Demo Card */}
                <div style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    background: '#1A1F2E',
                    border: '1px solid #232B3E',
                    borderRadius: '12px',
                    padding: '32px'
                }}>
                    {/* Input Area */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            color: '#8C95AA',
                            marginBottom: '8px'
                        }}>
                            클라이언트 요청 내용
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="예) 랜딩 페이지 외에 회사 소개 페이지 3개를 추가로 만들어 주실 수 있나요?"
                            style={{
                                width: '100%',
                                height: '120px',
                                background: '#0F1117',
                                border: '1px solid #232B3E',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                color: '#E8EAF0',
                                fontSize: '14px',
                                resize: 'none',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F80FF'}
                            onBlur={(e) => e.target.style.borderColor = '#232B3E'}
                        />

                        {/* Example Chips */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '12px'
                        }}>
                            {exampleChips.map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => handleChipClick(chip)}
                                    style={{
                                        background: 'rgba(79, 128, 255, 0.1)',
                                        border: '1px solid rgba(79, 128, 255, 0.3)',
                                        borderRadius: '20px',
                                        padding: '4px 12px',
                                        fontSize: '12px',
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
                        disabled={!inputText.trim() || state === 'loading'}
                        style={{
                            width: '100%',
                            height: '48px',
                            background: inputText.trim() && state !== 'loading' ? '#4F80FF' : '#232B3E',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: inputText.trim() && state !== 'loading' ? 'pointer' : 'not-allowed',
                            transition: 'background 0.2s',
                            marginBottom: '24px'
                        }}
                        onMouseEnter={(e) => {
                            if (inputText.trim() && state !== 'loading') {
                                e.currentTarget.style.background = '#3A6BDD';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (inputText.trim() && state !== 'loading') {
                                e.currentTarget.style.background = '#4F80FF';
                            }
                        }}
                    >
                        범위 판정하기 →
                    </button>

                    {/* Result Area */}
                    {state === 'empty' && (
                        <div style={{
                            height: '160px',
                            border: '1px dashed #232B3E',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
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
                                AI가 분석 중입니다...
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
                                lineHeight: '1.6',
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
                                    padding: '8px 16px',
                                    flex: '1',
                                    minWidth: '140px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#8C95AA',
                                        marginBottom: '4px'
                                    }}>
                                        추가 예상 시간
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: 'white',
                                        fontWeight: '600'
                                    }}>
                                        {result.estimatedTime}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#0F1117',
                                    border: '1px solid #232B3E',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    flex: '1',
                                    minWidth: '140px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#8C95AA',
                                        marginBottom: '4px'
                                    }}>
                                        계약 범위
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: result.type === 'out-of-scope' ? '#F87171' : '#10B981',
                                        fontWeight: '600'
                                    }}>
                                        {result.scopeStatus}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#0F1117',
                                    border: '1px solid #232B3E',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    flex: '1',
                                    minWidth: '140px'
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#8C95AA',
                                        marginBottom: '4px'
                                    }}>
                                        추가 견적 필요
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: result.type === 'out-of-scope' ? '#F87171' : '#10B981',
                                        fontWeight: '600'
                                    }}>
                                        {result.needsQuote}
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
                                    더 많은 기능이 궁금하다면
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
