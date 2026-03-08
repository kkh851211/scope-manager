import { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { toast } from "sonner";

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [teamSize, setTeamSize] = useState<string>('');
    const [additionalChargeExperience, setAdditionalChargeExperience] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agencySize: teamSize,
                    hasGivenUpBilling: additionalChargeExperience
                }),
            });

            if (!response.ok) throw new Error('설문 저장 실패');

            toast.success("설문이 저장되었습니다.");
            onClose();
        } catch (error: any) {
            toast.error("설문 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleSkip}
            />

            {/* Modal */}
            <div className="relative w-full max-w-[440px] bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#232b3e] rounded-xl shadow-2xl p-6 animate-[fadeIn_0.2s_ease-out]">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-[#e8eaf0] mb-1.5">
                        잠깐, 2가지만 여쭤볼게요 👋
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-[#8c95aa]">
                        더 나은 서비스를 위해 활용됩니다 (30초)
                    </p>
                </div>

                <div className="h-px bg-gray-100 dark:bg-[#232b3e] mb-6" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Question 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-[#e8eaf0] mb-3">
                            에이전시 규모는 어떻게 되시나요?
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { value: '1인', label: '1인' },
                                { value: '2~5인', label: '2~5인' },
                                { value: '6~10인', label: '6~10인' },
                                { value: '11~20인', label: '11~20인' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setTeamSize(option.value)}
                                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${teamSize === option.value
                                        ? 'bg-[#4f80ff]/10 border-[#4f80ff] text-[#4f80ff]'
                                        : 'bg-gray-50 dark:bg-[#1e2538] border-gray-200 dark:border-[#232b3e] text-gray-600 dark:text-[#c5c8d4] hover:border-[#4f80ff]'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-[#e8eaf0] mb-3">
                            추가 요구로 인해 추가 청구를 포기한 경험이 있으신가요?
                        </label>
                        <div className="space-y-2">
                            {[
                                { value: '자주 있다', label: '자주 있다' },
                                { value: '가끔 있다', label: '가끔 있다' },
                                { value: '없다', label: '없다' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setAdditionalChargeExperience(option.value)}
                                    className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all ${additionalChargeExperience === option.value
                                        ? 'bg-[#4f80ff]/10 border-[#4f80ff] text-[#4f80ff]'
                                        : 'bg-gray-50 dark:bg-[#1e2538] border-gray-200 dark:border-[#232b3e] text-gray-600 dark:text-[#c5c8d4] hover:border-[#4f80ff]'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!teamSize || !additionalChargeExperience || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4f80ff] hover:bg-[#6192ff] disabled:bg-[#2a3348] disabled:text-[#5a5f73] text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                시작하기
                                <Rocket className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Skip Link */}
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="w-full text-center text-sm text-gray-500 dark:text-[#8c95aa] hover:text-gray-700 dark:hover:text-[#c5c8d4] transition-colors"
                    >
                        건너뛰기
                    </button>
                </form>
            </div>
        </div>
    );
}
