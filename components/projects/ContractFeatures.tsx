import { Sparkles } from 'lucide-react';

interface ContractFeaturesProps {
    features: string;
    onChange: (value: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export function ContractFeatures({ features, onChange, onAnalyze, isAnalyzing }: ContractFeaturesProps) {
    return (
        <div className="bg-gray-50 dark:bg-[#1a1f2e] rounded-xl overflow-hidden border border-gray-200 dark:border-[#232b3e]">
            {/* 파란색 액센트 라인 */}
            <div className="h-[3px] bg-[#4f80ff]" />

            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaf0] mb-2">계약 기능 목록</h2>
                <p className="text-sm text-gray-500 dark:text-[#8c95aa] mb-4">
                    클라이언트와 합의한 기능을 자유롭게 입력하세요. AI가 공수와 금액을 자동으로 분석합니다.
                </p>

                <textarea
                    value={features}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`예시:\n- 반응형 메인 웹사이트 제작\n- 관리자 페이지\n- 회원가입 / 로그인\n- 결제 연동 (토스페이먼츠)`}
                    className="w-full h-[120px] px-4 py-3 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg text-gray-900 dark:text-[#e8eaf0] placeholder:text-gray-400 dark:placeholder:text-[#5a5f73] focus:outline-none focus:border-[#4f80ff] focus:ring-1 focus:ring-[#4f80ff] transition-colors resize-none"
                />

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#232b3e]">
                    <button
                        type="button"
                        onClick={onAnalyze}
                        disabled={!features.trim() || isAnalyzing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4f80ff] hover:bg-[#6192ff] disabled:bg-gray-200 dark:disabled:bg-[#2a3348] disabled:text-gray-400 dark:disabled:text-[#5a5f73] text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                        <Sparkles className="w-5 h-5" />
                        {isAnalyzing ? 'AI 분석 중...' : '✨ AI로 공수 · 금액 자동 산출'}
                    </button>
                    <p className="mt-3 text-center text-sm text-gray-500 dark:text-[#8c95aa]">
                        한국 웹 에이전시 평균 단가 기준으로 산출됩니다
                    </p>
                </div>
            </div>
        </div>
    );
}
