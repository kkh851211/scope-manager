import React from "react";

export type StatusType = "IN_SCOPE" | "OUT_OF_SCOPE" | "AMBIGUOUS";

interface StatusBadgeProps {
    status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    let label = "";
    let baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";

    switch (status) {
        case "IN_SCOPE":
            label = "범위 내";
            baseClasses += " bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
            break;
        case "OUT_OF_SCOPE":
            label = "범위 외";
            baseClasses += " bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800";
            break;
        case "AMBIGUOUS":
            label = "확인 필요";
            baseClasses += " bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
            break;
    }

    return <span className={baseClasses}>{label}</span>;
}
