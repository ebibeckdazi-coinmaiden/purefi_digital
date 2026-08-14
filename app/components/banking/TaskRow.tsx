import { ArrowDown } from "@solar-icons/react-perf/BoldDuotone";
import { StatusBadge } from "@/app/components/feature/dashboard/primitives";
import type { ReactNode } from "react";

interface TaskRowProps {
  title: string;
  subtitle: string;
  badge?: string;
  badgeTone?: "neutral" | "success" | "warning" | "danger";
  action?: ReactNode;
}

export function TaskRow({ title, subtitle, badge, badgeTone = "warning", action }: TaskRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-db-border bg-db-hover p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-db-border bg-white">
          <ArrowDown size={18} className="text-db-text-primary" />
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-amber-500" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-db-text-primary">{title}</p>
          <p className="truncate text-xs text-db-text-secondary">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {badge && <StatusBadge tone={badgeTone}>{badge}</StatusBadge>}
        {action}
      </div>
    </div>
  );
}
