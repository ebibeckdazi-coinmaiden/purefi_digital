import { AltArrowRight } from "@solar-icons/react-perf/BoldDuotone";
import type { ReactNode } from "react";

interface RecipientRowProps {
  initials: string;
  colorClass: string;
  name: string;
  subtitle: string;
  onClick?: () => void;
  children?: ReactNode;
}

export function RecipientRow({ initials, colorClass, name, subtitle, onClick, children }: RecipientRowProps) {
  return (
    <div onClick={onClick} className="-mx-1 flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-db-hover cursor-pointer">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${colorClass}`}>{initials}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-db-text-primary">{name}</p>
          <p className="truncate text-[11px] font-medium text-db-text-muted">{subtitle}</p>
        </div>
      </div>
      {children || <AltArrowRight size={18} className="shrink-0 text-db-text-muted" />}
    </div>
  );
}
