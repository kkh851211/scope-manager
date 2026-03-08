import { ContractFeature, Project } from "@/types/database";

export default function ContractScope({ features, project }: { features: ContractFeature[], project: Project }) {
    const totalDays = features.reduce((sum, f) => sum + (f.estimated_days || 0), 0);
    const totalAmount = features.reduce((sum, f) => sum + (f.amount || 0), 0);

    return (
        <div className="space-y-6">
            {/* 계약 범위 카드 */}
            <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaf0]">계약 범위</h2>
                    <button className="text-sm text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0] transition-colors">
                        범위 수정
                    </button>
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-[#1e2538] border-b border-gray-200 dark:border-[#232b3e]">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#e8eaf0]">기능명</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#e8eaf0]">세부 작업</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#e8eaf0]">예상 공수</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#e8eaf0]">일 단가</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#e8eaf0]">금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 dark:border-[#232b3e] hover:bg-gray-100 dark:hover:bg-[#1e2538] transition-colors"
                                >
                                    <td className="py-3 px-4 text-gray-900 dark:text-[#e8eaf0]">{item.feature_name}</td>
                                    <td className="py-3 px-4 text-gray-500 dark:text-[#8c95aa] text-sm">{item.detail_work || '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-900 dark:text-[#e8eaf0]">{item.estimated_days ? item.estimated_days + '일' : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-500 dark:text-[#8c95aa]">{item.daily_rate ? item.daily_rate.toLocaleString() + '원' : '-'}</td>
                                    <td className="py-3 px-4 text-right text-gray-900 dark:text-[#e8eaf0]">{item.amount ? item.amount.toLocaleString() + '원' : '-'}</td>
                                </tr>
                            ))}

                            {features.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-[#8c95aa]">등록된 기능이 없습니다.</td>
                                </tr>
                            )}

                            {/* 합계 행 */}
                            {features && features.length > 0 && (
                                <tr className="bg-gray-100 dark:bg-[#1e2538]">
                                    <td className="py-4 px-4 font-semibold text-gray-900 dark:text-[#e8eaf0]">합계</td>
                                    <td className="py-4 px-4"></td>
                                    <td className="py-4 px-4 text-right font-semibold text-gray-900 dark:text-[#e8eaf0]">{totalDays}일</td>
                                    <td className="py-4 px-4"></td>
                                    <td className="py-4 px-4 text-right font-semibold text-[#4f80ff]">{totalAmount.toLocaleString()}원</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Callout 박스 */}
            <div className="bg-[#4f80ff]/10 border border-[#4f80ff]/30 rounded-xl p-4">
                <p className="text-sm text-gray-900 dark:text-[#e8eaf0]">
                    💡 이 계약 범위가 판정의 기준선입니다. 수정 시 이후 범위 판정 결과에 영향을 줍니다.
                </p>
            </div>
        </div>
    );
}
