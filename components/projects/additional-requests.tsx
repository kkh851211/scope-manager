import { useState } from "react";
import { MailOpen } from "lucide-react";
import { JudgmentItem } from "@/app/(dashboard)/projects/[id]/ProjectDetailClient";

export default function AdditionalRequests({ judgments, projectId }: { judgments: JudgmentItem[], projectId: string }) {
    const hasData = judgments && judgments.length > 0;

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
                    {judgments.map((request, index) => {
                        let statusColor = "#f87171"; // 범위 외
                        let accentColor = "#f87171";
                        if (request.result === "범위 내") {
                            statusColor = "#10b981";
                            accentColor = "#10b981";
                        } else if (request.result === "경계") {
                            statusColor = "#fbbf24";
                            accentColor = "#fbbf24";
                        }

                        return (
                            <div
                                key={request.id || index}
                                className="bg-[#1a1f2e] border border-[#232b3e] rounded-xl p-5 relative overflow-hidden"
                            >
                                {/* 왼쪽 액센트 라인 */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                                    style={{ backgroundColor: accentColor }}
                                />

                                <div className="flex items-start justify-between pl-3">
                                    <div className="flex-1">
                                        <div className="text-[#e8eaf0] mb-3 whitespace-pre-wrap">
                                            {request.request}
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-[#8c95aa]">{request.date}</span>
                                            <span className="text-[#8c95aa]">·</span>
                                            {/* 임시 채널 (DB에 아직 없을 수 있으므로 하드코딩 또는 확정된 것만) */}
                                            <span
                                                className="px-3 py-1 rounded-full text-xs border"
                                                style={{
                                                    backgroundColor: `#fbbf2420`,
                                                    color: `#fbbf24`,
                                                    borderColor: `#fbbf2430`,
                                                }}
                                            >
                                                요청
                                            </span>
                                            <span
                                                className="px-3 py-1 rounded-full text-xs border font-medium"
                                                style={{
                                                    backgroundColor: `${statusColor}20`,
                                                    color: statusColor,
                                                    borderColor: `${statusColor}30`,
                                                }}
                                            >
                                                {request.result}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="text-sm text-[#8c95aa] hover:text-[#e8eaf0] transition-colors ml-4 flex-shrink-0">
                                        상세 보기
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
