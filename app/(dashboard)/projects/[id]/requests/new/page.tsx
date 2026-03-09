"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

type Channel = "카카오톡" | "이메일" | "전화" | "미팅" | "기타";
type JudgmentResult = "범위 초과" | "범위 내" | "판단 필요" | null;

export default function AddRequest() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    // 폼 상태
    const [content, setContent] = useState("");
    const [channel, setChannel] = useState<Channel | null>(null);
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split("T")[0]);
    const [requesterName, setRequesterName] = useState("");

    // 판정 상태
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [judgmentResult, setJudgmentResult] = useState<JudgmentResult>(null);
    const [confidence, setConfidence] = useState(0);
    const [aiReason, setAiReason] = useState("");
    const [aiRecommendation, setAiRecommendation] = useState("");
    const [requestId, setRequestId] = useState<string | null>(null);

    // 프로젝트 정보 상태
    const [projectName, setProjectName] = useState("");
    const [scope, setScope] = useState<{ feature_name: string; estimated_days: number }[]>([]);
    const [isLoadingProject, setIsLoadingProject] = useState(true);

    // 프로젝트 정보 및 계약 범위 조회
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;
            setIsLoadingProject(true);
            try {
                const [projectRes, featuresRes] = await Promise.all([
                    fetch(`/api/projects/${id}`),
                    fetch(`/api/projects/${id}/contract-features`)
                ]);

                if (projectRes.ok) {
                    const projectData = await projectRes.json();
                    setProjectName(projectData.name);
                }

                if (featuresRes.ok) {
                    const featuresData = await featuresRes.json();
                    setScope(featuresData);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            } finally {
                setIsLoadingProject(false);
            }
        };

        fetchProjectData();
    }, [id]);

    // AI 판정 요청
    const handleJudgment = async () => {
        if (!content.trim() || !channel) return;

        setIsAnalyzing(true);
        setAnalysisStep(0);
        setJudgmentResult(null);

        try {
            // 단계별 시뮬레이션 (사용자 경험용)
            await new Promise((resolve) => setTimeout(resolve, 800));
            setAnalysisStep(1);
            await new Promise((resolve) => setTimeout(resolve, 800));
            setAnalysisStep(2);

            const response = await fetch(`/api/projects/${id}/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    channel: channel === "카카오톡" ? "kakao" : channel === "이메일" ? "email" : channel === "전화" ? "phone" : channel === "미팅" ? "meeting" : "other",
                    requested_at: requestDate,
                    requester_name: requesterName,
                }),
            });

            if (!response.ok) throw new Error("AI 판정에 실패했습니다.");

            const data = await response.json();
            const { judgment } = data;

            // 상세 결과 저장
            setConfidence(judgment.confidence_score);
            setAiReason(judgment.reasoning);
            setAiRecommendation(judgment.recommendation);
            setRequestId(data.id);

            // 상태 매핑
            if (judgment.result === "in_scope") setJudgmentResult("범위 내");
            else if (judgment.result === "out_of_scope") setJudgmentResult("범위 초과");
            else setJudgmentResult("판단 필요");

        } catch (error) {
            console.error("Judgment error:", error);
            alert("AI 판정 중 오류가 발생했습니다.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 최종 확인
    const handleConfirm = () => {
        router.push(`/projects/${id}?tab=requests`);
    };

    const channels: Channel[] = ["카카오톡", "이메일", "전화", "미팅", "기타"];

    return (
        <div
            className="min-h-screen bg-white dark:bg-[#0f1117] text-gray-900 dark:text-[#e8eaf0] py-8 px-4"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
            <div className="max-w-[720px] mx-auto">
                {/* 상단 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#8c95aa] mb-4">
                        <Link
                            href={`/projects/${id}?tab=requests`}
                            className="hover:text-gray-900 dark:hover:text-[#e8eaf0] transition-colors flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {isLoadingProject ? "로딩 중..." : projectName}
                        </Link>
                        <span>·</span>
                        <span className="text-gray-900 dark:text-[#e8eaf0] font-medium">추가 요구 기록</span>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">추가 요구 기록</h1>
                    <p className="text-sm text-gray-500 dark:text-[#8c95aa]">
                        클라이언트 요청을 입력하면 AI가 계약 범위를 자동으로 판정합니다
                    </p>
                </div>

                {/* 입력 카드 */}
                <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden mb-6">
                    <div className="h-[3px] bg-[#f87171]" />
                    <div className="p-6 space-y-5">
                        {/* 요구 내용 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">요구 내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="예: 메인 페이지에 팝업 배너 추가해달라고 합니다"
                                className="w-full h-[120px] bg-gray-100 dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg px-4 py-3 text-gray-900 dark:text-[#e8eaf0] placeholder:text-gray-400 dark:placeholder:text-[#5a5f73] focus:outline-none focus:border-[#4f80ff] resize-none"
                            />
                        </div>

                        {/* 요청 채널 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">요청 채널</label>
                            <div className="flex gap-2 flex-wrap">
                                {channels.map((ch) => (
                                    <button
                                        key={ch}
                                        onClick={() => setChannel(ch)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${channel === ch
                                            ? "bg-[#4f80ff] text-white"
                                            : "bg-gray-100 dark:bg-[#1e2538] text-gray-700 dark:text-[#e8eaf0] border border-gray-200 dark:border-[#232b3e] hover:text-gray-900 dark:hover:text-[#e8eaf0]"
                                            }`}
                                    >
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 요청 일자 & 요청자명 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">요청 일자</label>
                                <input
                                    type="date"
                                    value={requestDate}
                                    onChange={(e) => setRequestDate(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-[#e8eaf0] focus:outline-none focus:border-[#4f80ff] dark:[color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    요청자명 <span className="text-gray-500 dark:text-[#8c95aa] text-xs">(선택사항)</span>
                                </label>
                                <input
                                    type="text"
                                    value={requesterName}
                                    onChange={(e) => setRequesterName(e.target.value)}
                                    placeholder="예: 김대리"
                                    className="w-full bg-gray-100 dark:bg-[#1e2538] border border-gray-200 dark:border-[#232b3e] rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-[#e8eaf0] placeholder:text-gray-400 dark:placeholder:text-[#5a5f73] focus:outline-none focus:border-[#4f80ff]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 계약 범위 미리보기 카드 */}
                <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden mb-6">
                    <div className="h-[3px] bg-[#4f80ff]" />
                    <div className="p-6">
                        <div className="flex items-baseline gap-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaf0]">현재 계약 범위</h2>
                            <span className="text-xs text-gray-500 dark:text-[#8c95aa]">AI 판정의 기준선</span>
                        </div>

                        <div className="space-y-2">
                            {isLoadingProject ? (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    범위 로딩 중...
                                </div>
                            ) : scope.length > 0 ? (
                                scope.map((item, index) => (
                                    <div key={index} className="text-sm text-gray-500 dark:text-[#8c95aa]">
                                        · {item.feature_name} — {item.estimated_days}일
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-400">기록된 계약 범위가 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI 범위 판정 버튼 */}
                {!isAnalyzing && !judgmentResult && (
                    <div className="mb-6">
                        <button
                            onClick={handleJudgment}
                            disabled={!content || !channel}
                            className="w-full bg-[#4f80ff] hover:bg-[#4f80ff]/90 disabled:bg-gray-200 dark:disabled:bg-[#232b3e] disabled:text-gray-400 dark:disabled:text-[#8c95aa] text-white px-6 py-4 rounded-xl text-base font-semibold transition-colors"
                        >
                            AI 범위 판정 요청
                        </button>
                        <p className="text-center text-xs text-gray-500 dark:text-[#8c95aa] mt-2">
                            판정 결과는 3초 이내에 표시됩니다
                        </p>
                    </div>
                )}

                {/* 로딩 상태 */}
                {isAnalyzing && (
                    <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden mb-6">
                        <div className="h-[3px] bg-[#a78bfa]" />
                        <div className="p-6">
                            <div className="flex flex-col items-center mb-6">
                                <Loader2 className="w-12 h-12 text-[#a78bfa] animate-spin mb-4" />
                                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-[#e8eaf0]">AI가 계약 범위를 분석 중입니다...</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${analysisStep >= 0 ? "bg-[#10b981] text-white" : "bg-gray-200 dark:bg-[#232b3e] text-gray-500 dark:text-[#8c95aa]"
                                            }`}
                                    >
                                        {analysisStep >= 0 ? "✓" : "○"}
                                    </div>
                                    <span className={analysisStep >= 0 ? "text-gray-900 dark:text-[#e8eaf0]" : "text-gray-500 dark:text-[#8c95aa]"}>
                                        추가 요구 내용 파악 중
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${analysisStep >= 1
                                            ? analysisStep === 1
                                                ? "bg-[#a78bfa] text-white"
                                                : "bg-[#10b981] text-white"
                                            : "bg-gray-200 dark:bg-[#232b3e] text-gray-500 dark:text-[#8c95aa]"
                                            }`}
                                    >
                                        {analysisStep >= 2 ? "✓" : analysisStep === 1 ? "⟳" : "○"}
                                    </div>
                                    <span
                                        className={analysisStep >= 1 ? "text-gray-900 dark:text-[#e8eaf0]" : "text-gray-500 dark:text-[#8c95aa]"}
                                    >
                                        계약 범위와 비교 분석 중
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${analysisStep >= 2 ? "bg-[#a78bfa] text-white" : "bg-gray-200 dark:bg-[#232b3e] text-gray-500 dark:text-[#8c95aa]"
                                            }`}
                                    >
                                        {analysisStep >= 2 ? "⟳" : "○"}
                                    </div>
                                    <span className={analysisStep >= 2 ? "text-gray-900 dark:text-[#e8eaf0]" : "text-gray-500 dark:text-[#8c95aa]"}>
                                        판정 결과 생성 중
                                    </span>
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-500 dark:text-[#8c95aa] mt-6">
                                Claude AI가 계약서 조건을 검토하고 있습니다
                            </p>
                        </div>
                    </div>
                )}

                {/* 판정 결과: 범위 초과 */}
                {judgmentResult === "범위 초과" && (
                    <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-[3px] bg-[#f87171]" />
                        <div className="p-6 space-y-4">
                            {/* 헤더 */}
                            <div className="flex items-center justify-between">
                                <span className="bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30 px-4 py-2 rounded-full text-base font-semibold">
                                    ⚠️ 범위 초과
                                </span>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 dark:text-[#8c95aa] mb-1">신뢰도</div>
                                    <div className="text-2xl font-bold text-[#f87171]">{confidence}%</div>
                                </div>
                            </div>

                            {/* 요청 내용 요약 */}
                            <div className="bg-gray-100 dark:bg-[#1e2538] rounded-lg p-4">
                                <p className="text-gray-900 dark:text-[#e8eaf0]">{content}</p>
                            </div>

                            {/* 판정 근거 */}
                            <div className="bg-[#4f80ff]/10 border-l-[3px] border-[#4f80ff] rounded-lg p-4">
                                <div className="font-semibold text-[#4f80ff] mb-2">💡 판정 근거</div>
                                <p className="text-sm text-gray-900 dark:text-[#e8eaf0] leading-relaxed">
                                    {aiReason}
                                </p>
                            </div>

                            {/* PM 권고 */}
                            <div className="bg-[#fbbf24]/10 border-l-[3px] border-[#fbbf24] rounded-lg p-4">
                                <div className="font-semibold text-[#fbbf24] mb-2">📋 PM 권고사항</div>
                                <p className="text-sm text-gray-900 dark:text-[#e8eaf0]">
                                    {aiRecommendation}
                                </p>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex gap-3 pt-2">
                                <Link
                                    href={`/projects/${id}/requests/${requestId}/report`}
                                    className="flex-1 bg-[#4f80ff] hover:bg-[#4f80ff]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
                                >
                                    📄 리포트 자동 생성
                                </Link>
                                <button className="px-6 py-3 rounded-lg text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0] hover:bg-gray-100 dark:hover:bg-[#1e2538] transition-colors">
                                    ✏️ 판정 결과 수정
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 판정 결과: 범위 내 */}
                {judgmentResult === "범위 내" && (
                    <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-[3px] bg-[#10b981]" />
                        <div className="p-6 space-y-4">
                            {/* 헤더 */}
                            <div className="flex items-center justify-between">
                                <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 px-4 py-2 rounded-full text-base font-semibold">
                                    ✓ 범위 내
                                </span>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 dark:text-[#8c95aa] mb-1">신뢰도</div>
                                    <div className="text-2xl font-bold text-[#10b981]">{confidence}%</div>
                                </div>
                            </div>

                            {/* 요청 내용 요약 */}
                            <div className="bg-gray-100 dark:bg-[#1e2538] rounded-lg p-4">
                                <p className="text-gray-900 dark:text-[#e8eaf0]">{content}</p>
                            </div>

                            {/* 판정 근거 */}
                            <div className="bg-[#10b981]/10 border-l-[3px] border-[#10b981] rounded-lg p-4">
                                <div className="font-semibold text-[#10b981] mb-2">💡 판정 근거</div>
                                <p className="text-sm text-gray-900 dark:text-[#e8eaf0] leading-relaxed">
                                    {aiReason}
                                </p>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    ✓ 확인 완료
                                </button>
                                <button className="px-6 py-3 rounded-lg text-gray-500 dark:text-[#8c95aa] hover:text-gray-900 dark:hover:text-[#e8eaf0] hover:bg-gray-100 dark:hover:bg-[#1e2538] transition-colors">
                                    ✏️ 판정 결과 수정
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 판정 결과: 판단 필요 */}
                {judgmentResult === "판단 필요" && (
                    <div className="bg-gray-50 dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-[3px] bg-[#fbbf24]" />
                        <div className="p-6 space-y-4">
                            {/* 헤더 */}
                            <div className="flex items-center justify-between">
                                <span className="bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30 px-4 py-2 rounded-full text-base font-semibold">
                                    🤔 판단 필요
                                </span>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 dark:text-[#8c95aa] mb-1">신뢰도</div>
                                    <div className="text-2xl font-bold text-[#fbbf24]">{confidence}%</div>
                                </div>
                            </div>

                            {/* 요청 내용 요약 */}
                            <div className="bg-gray-100 dark:bg-[#1e2538] rounded-lg p-4">
                                <p className="text-gray-900 dark:text-[#e8eaf0]">{content}</p>
                            </div>

                            {/* 판정 근거 */}
                            <div className="bg-[#fbbf24]/10 border-l-[3px] border-[#fbbf24] rounded-lg p-4">
                                <div className="font-semibold text-[#fbbf24] mb-2">💡 판정 근거</div>
                                <p className="text-sm text-gray-900 dark:text-[#e8eaf0] leading-relaxed">
                                    {aiReason}
                                </p>
                            </div>

                            {/* PM 선택 버튼 */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={() => {
                                        setJudgmentResult("범위 내");
                                        setConfidence(95);
                                    }}
                                    className="w-full bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/30 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    범위 내로 확정
                                </button>
                                <button
                                    onClick={() => {
                                        setJudgmentResult("범위 초과");
                                        setConfidence(95);
                                    }}
                                    className="w-full bg-[#f87171]/20 hover:bg-[#f87171]/30 text-[#f87171] border border-[#f87171]/30 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    범위 초과로 확정
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
