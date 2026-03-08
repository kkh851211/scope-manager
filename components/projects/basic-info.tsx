import { Project } from "@/types/database";

export default function BasicInfo({ project }: { project: Project }) {
    const aiAmount = project.ai_estimated_amount || 0;
    const contractAmountStr = project.contract_amount ? project.contract_amount.toLocaleString() + '원' : '-';
    // 차액 계산
    let diff = (project.contract_amount || 0) - aiAmount;
    const diffAbsStr = Math.abs(diff).toLocaleString() + '원';

    let diffColor = "text-gray-500 dark:text-[#8c95aa]";
    let diffSign = "";
    let diffLabel = "계약 금액 미정 또는 AI 산출 금액 미정";

    if (project.contract_amount && aiAmount) {
        if (diff > 0) {
            diffColor = "text-[#10b981]";
            diffSign = "+";
            diffLabel = "계약 금액이 산출 금액보다 높음";
        } else if (diff < 0) {
            diffColor = "text-[#f87171]";
            diffSign = "-";
            diffLabel = "계약 금액이 산출 금액보다 낮음";
        } else {
            diffColor = "text-[#8c95aa]";
            diffLabel = "계약 금액과 AI 산출 금액 동일";
        }
    }

    const formatDt = (dtStr: string | null) => dtStr ? dtStr.split('T')[0].replace(/-/g, '.') : '-';

    return (
        <div className="space-y-6">
            {/* 상단 3컬럼 수치 카드 */}
            <div className="grid grid-cols-3 gap-4">
                {/* 계약 금액 */}
                <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-5">
                    <div className="text-2xl font-bold text-gray-900 dark:text-[#e8eaf0] mb-1">
                        {project.contract_amount ? project.contract_amount.toLocaleString() + '원' : '미정'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#8c95aa]">계약 금액</div>
                </div>

                {/* AI 산출 금액 */}
                <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-5">
                    <div className="text-2xl font-bold text-[#4f80ff] mb-1">
                        {project.ai_estimated_amount ? project.ai_estimated_amount.toLocaleString() + '원' : '미정'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#8c95aa]">AI 산출 금액</div>
                </div>

                {/* 차액 */}
                <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-5">
                    <div className={`text-2xl font-bold ${diffColor} mb-1`}>
                        {diffSign}{diffAbsStr}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">계약 여유 금액</div>
                    <div className="text-xs text-gray-400 dark:text-[#8c95aa]">{diffLabel}</div>
                </div>
            </div>

            {/* 상세 정보 카드 */}
            <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaf0]">상세 정보</h2>
                    <button className="text-sm text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0] transition-colors">
                        수정
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">프로젝트 이름</div>
                        <div className="text-gray-900 dark:text-[#e8eaf0]">{project.name}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">클라이언트명</div>
                        <div className="text-gray-900 dark:text-[#e8eaf0]">{project.client_name || '-'}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">시작일</div>
                        <div className="text-gray-900 dark:text-[#e8eaf0]">{formatDt(project.start_date)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">종료일</div>
                        <div className="text-gray-900 dark:text-[#e8eaf0]">{formatDt(project.end_date)}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">총 예상 공수</div>
                        <div className="text-gray-900 dark:text-[#e8eaf0]">{project.ai_estimated_days ? project.ai_estimated_days + '일' : '-'}</div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-500 dark:text-[#8c95aa] mb-1">등록일</div>
                        <div className="text-gray-900 dark:text-[#e8eaf0]">{formatDt(project.created_at)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
