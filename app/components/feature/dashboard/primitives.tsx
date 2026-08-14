/* eslint-disable react/no-children-prop */
"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { CircleFlag } from "react-circle-flags";
import { cn } from "@/lib/utils";
import Card from "@/app/components/base/Card";
import RiIcon from "@/app/components/ui/RiIcon";


export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-db-text-primary">{title}</h1>{description && <p className="mt-1 text-sm text-db-text-secondary">{description}</p>}</div>{actions && <div className="flex flex-wrap gap-2">{actions}</div>}</div>;
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-base font-semibold text-db-text-primary">{title}</h2>{action}</div>;
}

export function MoneyAmount({ value, currency, className, suffix }: { value: number; currency: string; className?: string; suffix?: ReactNode }) {
  return <span className={cn("font-bold tracking-tight text-db-text-primary", className)}>{value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="ml-1 text-[0.62em] font-semibold text-db-text-secondary">{currency}</span>{suffix}</span>;
}

export function StatusBadge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "danger"; children: ReactNode }) {
  const tones = { neutral: "bg-db-hover text-db-text-secondary", success: "bg-emerald-50 text-emerald-800", warning: "bg-amber-50 text-amber-800", danger: "bg-red-50 text-red-700" };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold", tones[tone])}>{children}</span>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-db-border bg-db-bg px-5 text-center"><p className="font-semibold text-db-text-primary">{title}</p><p className="mt-1 max-w-sm text-xs leading-5 text-db-text-secondary">{description}</p>{action && <div className="mt-3">{action}</div>}</div>;
}

export function LoadingCard({ className }: { className?: string }) {
  return <Card className={cn("min-h-32 animate-pulse bg-db-bg", className)} aria-label="Loading" children={undefined} />;
}

const countryByCurrency: Record<string, string> = { GBP: "gb", EUR: "eu", USD: "us", AUD: "au", CAD: "ca", CHF: "ch", JPY: "jp", NGN: "ng" };

const cardBgColors = ["bg-db-bg", "bg-stone-50/90"];

export function AccountCurrencyCard({ currency, balance, number, onClick, index = 0, className }: { currency: string; balance: number; number?: string; onClick?: () => void; index?: number; className?: string }) {
  const cardBg = cardBgColors[index % cardBgColors.length];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative h-47.5 w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] lg:w-96 shrink-0 snap-start overflow-hidden rounded-2xl p-5 text-left sm:h-55 sm:w-72 sm:min-w-72",
        cardBg,
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <CircleFlag countryCode={countryByCurrency[currency] ?? "us"} className="size-12 rounded-full ring-1 ring-black/5 sm:size-14" />
        <span className="text-sm font-medium uppercase tracking-wider text-black/90 sm:text-base">{currency}</span>
      </div>
      <div className="mt-6">
        <span className="block text-2xl font-semibold tracking-tight text-db-text-primary tabular-nums sm:text-3xl">
          {balance.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <p className="mt-2 text-sm opacity-70">
          {number ? `•••• ${number.slice(-4)}` : "No account number"}
        </p>
      </div>
    </motion.button>
  );
}

export function AddAccountCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-47.5 w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-db-border text-sm font-medium text-db-text-muted transition-colors hover:bg-db-hover sm:w-72 sm:min-w-72"
    >
      <RiIcon className="ri-add-circle-line text-2xl" />
      <span>Add account</span>
    </button>
  );
}
