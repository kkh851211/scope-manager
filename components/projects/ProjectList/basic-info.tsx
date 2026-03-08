export default function BasicInfo() {
    return (
        <div className="space-y-6">
            {/* 상단 3컬럼 수치 카드 */}
            <div className="grid grid-cols-3 gap-4">
                {/* 계약 금액 */}
                <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5">
                    <div className="text-2xl font-bold text-[#e8eaf0] mb-1">5,000,000원</div>
                    <div className="text-sm text-[#8c95aa]">계약 금액</div>
                </div>

                {/* AI 산출 금액 */}
                <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5">
                    <div className="text-2xl font-bold text-[#4f80ff] mb-1">4,350,000원</div>
                    <div className="text-sm text-[#8c95aa]">AI 산출 금액</div>
                </div>

                {/* 차액 */}
                <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5">
                    <div className="text-2xl font-bold text-[#10b981] mb-1">+650,000원</div>
                    <div className="text-sm text-[#8c95aa] mb-1">계약 여유 금액</div>
                    <div className="text-xs text-[#8c95aa]">계약 금액이 산출 금액보다 높음</div>
                </div>
            </div>

            {/* 상세 정보 카드 */}
            <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">상세 정보</h2>
                    <button className="text-sm text-[#8c95aa] hover:text-[#e8eaf0] transition-colors">
                        수정
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <div className="text-sm text-[#8c95aa] mb-1">프로젝트 이름</div>
                        <div className="text-[#e8eaf0]">올리브영 리뉴얼 웹사이트</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#8c95aa] mb-1">클라이언트명</div>
                        <div className="text-[#e8eaf0]">(주)올리브영</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#8c95aa] mb-1">시작일</div>
                        <div className="text-[#e8eaf0]">2025.03.01</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#8c95aa] mb-1">종료일</div>
                        <div className="text-[#e8eaf0]">2025.05.31</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#8c95aa] mb-1">총 예상 공수</div>
                        <div className="text-[#e8eaf0]">29일</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#8c95aa] mb-1">등록일</div>
                        <div className="text-[#e8eaf0]">2025.02.15</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
