import { useState } from "react";
import { MailOpen } from "lucide-react";

export default function AdditionalRequests() {
    // 데이터가 있는 상태로 설정 (상태 B)
    const [hasData] = useState(true);

    const requests = [
        {
            content: "메인 배너 슬라이드 자동 재생 기능 추가",
            date: "2025.03.15",
            channel: "카카오톡",
            channelColor: "#fbbf24",
            status: "범위 초과",
            statusColor: "#f87171",
            accentColor: "#f87171",
            action: "리포트 생성",
        },
        {
            content: "기존 기획된 상품 상세 페이지 내 이미지 순서 변경",
            date: "2025.03.18",
            channel: "이메일",
            channelColor: "#4f80ff",
            status: "범위 내",
            statusColor: "#10b981",
            accentColor: "#10b981",
            action: "상세 보기",
        },
    ];

    return (
        <div className="space-y-6">
            {/* 상단 버튼 */}
            <div className="flex justify-end">
                <button className="bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    + 추가 요구 기록
                </button>
            </div>

            {/* 빈 상태 (상태 A) */}
            {!hasData && (
                <div className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <MailOpen className="w-16 h-16 text-[#8c95aa] mb-4" />
                        <div className="text-lg text-[#e8eaf0] mb-2">
                            아직 기록된 추가 요구가 없습니다
                        </div>
                        <div className="text-sm text-[#8c95aa] max-w-md">
                            클라이언트 요청이 생기면 즉시 기록하세요. 범위 초과 여부를 자동으로 판정합니다.
                        </div>
                    </div>
                </div>
            )}

            {/* 데이터 있음 (상태 B) */}
            {hasData && (
                <div className="space-y-4">
                    {requests.map((request, index) => (
                        <div
                            key={index}
                            className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden"
                        >
                            {/* 왼쪽 액센트 라인 */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-[3px]"
                                style={{ backgroundColor: request.accentColor }}
                            />

                            <div className="flex items-start justify-between pl-3">
                                <div className="flex-1">
                                    <div className="text-[#e8eaf0] mb-3">
                                        {request.content}
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-[#8c95aa]">{request.date}</span>
                                        <span className="text-[#8c95aa]">·</span>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs border"
                                            style={{
                                                backgroundColor: `${request.channelColor}20`,
                                                color: request.channelColor,
                                                borderColor: `${request.channelColor}30`,
                                            }}
                                        >
                                            {request.channel}
                                        </span>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs border"
                                            style={{
                                                backgroundColor: `${request.statusColor}20`,
                                                color: request.statusColor,
                                                borderColor: `${request.statusColor}30`,
                                            }}
                                        >
                                            {request.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="text-sm text-[#8c95aa] hover:text-[#e8eaf0] transition-colors ml-4 flex-shrink-0">
                                    {request.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
