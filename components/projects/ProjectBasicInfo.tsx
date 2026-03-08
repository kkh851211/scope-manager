interface ProjectBasicInfoProps {
    projectName: string;
    clientName: string;
    startDate: string;
    endDate: string;
    contractAmount: string;
    onChange: (field: string, value: string) => void;
    readOnly?: boolean;
}

export function ProjectBasicInfo({
    projectName,
    clientName,
    startDate,
    endDate,
    contractAmount,
    onChange,
    readOnly = false
}: ProjectBasicInfoProps) {
    return (
        <div className="bg-gray-50 dark:bg-[#1a1f2e] rounded-xl overflow-hidden border border-gray-200 dark:border-[#232b3e]">
            {/* 빨간색 액센트 라인 */}
            <div className="h-[3px] bg-[#f87171]" />

            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaf0] mb-5">프로젝트 기본 정보</h2>

                <div className="space-y-4">
                    {/* 프로젝트 이름 */}
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-500 dark:text-[#8c95aa] mb-2">
                            프로젝트 이름
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={projectName}
                            onChange={(e) => onChange('projectName', e.target.value)}
                            placeholder="예: 올리브영 리뉴얼 웹사이트"
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg text-gray-900 dark:text-[#e8eaf0] placeholder:text-gray-400 dark:placeholder:text-[#5a5f73] focus:outline-none focus:border-[#4f80ff] focus:ring-1 focus:ring-[#4f80ff] transition-colors"
                        />
                    </div>

                    {/* 클라이언트명 */}
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-500 dark:text-[#8c95aa] mb-2">
                            클라이언트명
                        </label>
                        <input
                            id="clientName"
                            type="text"
                            value={clientName}
                            onChange={(e) => onChange('clientName', e.target.value)}
                            disabled={readOnly}
                            placeholder="예: (주)올리브영"
                            className="w-full px-4 py-2.5 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg text-gray-900 dark:text-[#e8eaf0] placeholder:text-gray-400 dark:placeholder:text-[#5a5f73] focus:outline-none focus:border-[#4f80ff] focus:ring-1 focus:ring-[#4f80ff] transition-colors disabled:opacity-70"
                        />
                    </div>

                    {/* 시작일 ~ 종료일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-[#8c95aa] mb-2">
                            프로젝트 기간
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => onChange('startDate', e.target.value)}
                                disabled={readOnly}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg text-gray-900 dark:text-[#e8eaf0] focus:outline-none focus:border-[#4f80ff] focus:ring-1 focus:ring-[#4f80ff] transition-colors dark:[color-scheme:dark] disabled:opacity-70"
                            />
                            <span className="text-gray-500 dark:text-[#8c95aa]">~</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => onChange('endDate', e.target.value)}
                                disabled={readOnly}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg text-gray-900 dark:text-[#e8eaf0] focus:outline-none focus:border-[#4f80ff] focus:ring-1 focus:ring-[#4f80ff] transition-colors dark:[color-scheme:dark] disabled:opacity-70"
                            />
                        </div>
                    </div>

                    {/* 계약 금액 */}
                    <div>
                        <label htmlFor="contractAmount" className="block text-sm font-medium text-gray-500 dark:text-[#8c95aa] mb-2">
                            계약 금액
                        </label>
                        <div className="relative">
                            <input
                                id="contractAmount"
                                type="text"
                                value={contractAmount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    onChange('contractAmount', value);
                                }}
                                disabled={readOnly}
                                placeholder="5,000,000"
                                className="w-full px-4 py-2.5 pr-12 bg-white dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg text-gray-900 dark:text-[#e8eaf0] placeholder:text-gray-400 dark:placeholder:text-[#5a5f73] focus:outline-none focus:border-[#4f80ff] focus:ring-1 focus:ring-[#4f80ff] transition-colors disabled:opacity-70"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8c95aa]">원</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
