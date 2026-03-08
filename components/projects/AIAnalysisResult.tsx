import { Pencil, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';

interface AnalysisItem {
    feature: string;
    task: string;
    days: number;
    dailyRate: number;
    amount: number;
}

interface AIAnalysisResultProps {
    items: AnalysisItem[];
    contractAmount: number;
    onReset: () => void;
    onCreateProject: () => void;
}

export function AIAnalysisResult({ items, contractAmount, onReset, onCreateProject }: AIAnalysisResultProps) {
    const totalDays = items.reduce((sum, item) => sum + item.days, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const difference = contractAmount - totalAmount;
    const hasMargin = difference > 0;

    return (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            {/* 헤더 바 */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1f2e] rounded-xl border border-emerald-500/30 dark:border-[#10b981]/30">
                <div className="flex items-center gap-2">
                    <span className="text-lg">✦</span>
                    <span className="font-semibold text-emerald-600 dark:text-[#10b981]">AI 산출 결과</span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-[#10b981]/10 border border-emerald-100 dark:border-[#10b981]/20 text-emerald-600 dark:text-[#10b981] text-xs font-medium rounded-full">
                    한국 에이전시 평균 단가 기준
                </span>
            </div>

            {/* 테이블 카드 */}
            <div className="bg-white dark:bg-[#1a1f2e] rounded-xl overflow-hidden border border-gray-200 dark:border-[#232b3e]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#1e2538] text-gray-500 dark:text-[#8c95aa] text-xs uppercase tracking-wide">
                                <th className="px-4 py-3 text-left font-medium">기능명</th>
                                <th className="px-4 py-3 text-left font-medium">세부 작업</th>
                                <th className="px-4 py-3 text-right font-medium">예상 공수</th>
                                <th className="px-4 py-3 text-right font-medium">일 단가</th>
                                <th className="px-4 py-3 text-right font-medium">산출 금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-200 dark:border-[#232b3e] hover:bg-gray-50 dark:hover:bg-[#1e2538] transition-colors group"
                                >
                                    <td className="px-4 py-3.5 text-gray-900 dark:text-[#e8eaf0]">{item.feature}</td>
                                    <td className="px-4 py-3.5 text-gray-500 dark:text-[#8c95aa] text-sm">{item.task}</td>
                                    <td className="px-4 py-3.5 text-right text-gray-900 dark:text-[#e8eaf0]">{item.days}일</td>
                                    <td className="px-4 py-3.5 text-right text-gray-500 dark:text-[#8c95aa]">
                                        {item.dailyRate.toLocaleString('ko-KR')}원
                                    </td>
                                    <td className="px-4 py-3.5 text-right text-gray-900 dark:text-[#e8eaf0]">
                                        <div className="flex items-center justify-end gap-2">
                                            <span>{item.amount.toLocaleString('ko-KR')}원</span>
                                            <Pencil className="w-4 h-4 text-gray-400 dark:text-[#8c95aa] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-200 dark:border-[#232b3e] bg-gray-50 dark:bg-[#1e2538]">
                                <td colSpan={2} className="px-4 py-4 font-semibold text-gray-900 dark:text-[#e8eaf0]">
                                    총합
                                </td>
                                <td className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-[#e8eaf0]">{totalDays}일</td>
                                <td className="px-4 py-4 text-right text-gray-500 dark:text-[#8c95aa]">―</td>
                                <td className="px-4 py-4 text-right font-bold text-[#4f80ff] text-lg">
                                    {totalAmount.toLocaleString('ko-KR')}원
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* 요약 비교 카드 */}
            <div className="grid grid-cols-2 gap-4">
                {/* AI 산출 금액 */}
                <div className="p-5 bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-2">AI 산출 금액</div>
                    <div className="text-2xl font-bold text-[#4f80ff] mb-1">
                        {totalAmount.toLocaleString('ko-KR')}원
                    </div>
                    <div className="text-xs text-gray-500 dark:text-[#8c95aa]">총 {totalDays}일 기준</div>
                </div>

                {/* 입력한 계약 금액 */}
                <div className="p-5 bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-2">입력한 계약 금액</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-[#e8eaf0] mb-1">
                        {contractAmount.toLocaleString('ko-KR')}원
                    </div>
                    <div className="text-xs text-gray-500 dark:text-[#8c95aa] mb-3">입력값 기준</div>
                    {contractAmount > 0 && (
                        <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${hasMargin
                                ? 'bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]'
                                : 'bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24]'
                                }`}
                        >
                            {hasMargin ? '✓' : '⚠️'}
                            {hasMargin ? '+' : ''}
                            {difference.toLocaleString('ko-KR')}원 {hasMargin ? '여유' : '부족'}
                        </div>
                    )}
                </div>
            </div>

            {/* AI 코멘트 */}
            <div className="p-4 bg-[#4f80ff]/5 dark:bg-[#4f80ff]/8 border-l-[3px] border-[#4f80ff] rounded-lg">
                <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-[#4f80ff] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-900 dark:text-[#e8eaf0] leading-relaxed">
                        결제 연동은 PG사 정책에 따라 공수가 1~2일 추가될 수 있습니다. 관리자 페이지 범위가 넓어질 경우를 대비해
                        계약서에 기능 상세를 명시하는 것을 권장합니다.
                    </p>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 dark:border-[#232b3e] text-gray-600 dark:text-[#c5c8d4] hover:bg-gray-50 dark:hover:bg-[#1e2538] rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    다시 입력
                </button>
                <button
                    type="button"
                    onClick={onCreateProject}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4f80ff] hover:bg-[#6192ff] text-white font-semibold rounded-lg shadow-lg shadow-[#4f80ff]/20 transition-all"
                >
                    이 범위로 프로젝트 생성
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
