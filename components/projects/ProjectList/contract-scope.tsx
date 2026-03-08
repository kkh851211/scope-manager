export default function ContractScope() {
    const scopeItems = [
        {
            name: "반응형 웹사이트",
            detail: "UI디자인+퍼블리싱",
            days: 10,
            rate: "150,000원",
            amount: "1,500,000원",
        },
        {
            name: "관리자 페이지",
            detail: "기획+프론트+백엔드",
            days: 8,
            rate: "150,000원",
            amount: "1,200,000원",
        },
        {
            name: "회원가입·로그인",
            detail: "개발+테스트",
            days: 3,
            rate: "150,000원",
            amount: "450,000원",
        },
        {
            name: "결제 연동",
            detail: "PG연동+예외처리",
            days: 5,
            rate: "150,000원",
            amount: "750,000원",
        },
        {
            name: "QA·배포",
            detail: "통합테스트+서버배포",
            days: 3,
            rate: "150,000원",
            amount: "450,000원",
        },
    ];

    return (
        <div className="space-y-6">
            {/* 계약 범위 카드 */}
            <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">계약 범위</h2>
                    <button className="text-sm text-[#8c95aa] hover:text-[#e8eaf0] transition-colors">
                        범위 수정
                    </button>
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#1e2538] border-b border-[#232b3e]">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#e8eaf0]">기능명</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[#e8eaf0]">세부 작업</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-[#e8eaf0]">예상 공수</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-[#e8eaf0]">일 단가</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-[#e8eaf0]">금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scopeItems.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#232b3e] hover:bg-[#1e2538] transition-colors"
                                >
                                    <td className="py-3 px-4 text-[#e8eaf0]">{item.name}</td>
                                    <td className="py-3 px-4 text-[#8c95aa] text-sm">{item.detail}</td>
                                    <td className="py-3 px-4 text-right text-[#e8eaf0]">{item.days}일</td>
                                    <td className="py-3 px-4 text-right text-[#8c95aa]">{item.rate}</td>
                                    <td className="py-3 px-4 text-right text-[#e8eaf0]">{item.amount}</td>
                                </tr>
                            ))}

                            {/* 합계 행 */}
                            <tr className="bg-[#1e2538]">
                                <td className="py-4 px-4 font-semibold text-[#e8eaf0]">합계</td>
                                <td className="py-4 px-4"></td>
                                <td className="py-4 px-4 text-right font-semibold text-[#e8eaf0]">29일</td>
                                <td className="py-4 px-4"></td>
                                <td className="py-4 px-4 text-right font-semibold text-[#4f80ff]">4,350,000원</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Callout 박스 */}
            <div className="bg-[#4f80ff]/10 border border-[#4f80ff]/30 rounded-xl p-4">
                <p className="text-sm text-[#e8eaf0]">
                    💡 이 계약 범위가 판정의 기준선입니다. 수정 시 이후 범위 판정 결과에 영향을 줍니다.
                </p>
            </div>
        </div>
    );
}
