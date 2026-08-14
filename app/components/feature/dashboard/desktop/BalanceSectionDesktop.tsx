"use client"
import { useQuery } from "convex/react";
import { Plain, CashOut, TransferHorizontal } from "@solar-icons/react-perf/BoldDuotone";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { MoneyAmount } from "../primitives";

export function BalanceSectionDesktop() {
  const router = useRouter();
  const accounts = useQuery(api.accounts.getAccounts);
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance ?? 0), 0) ?? 0;
  const currency = accounts?.[0]?.currency ?? "GBP";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-db-text-secondary tracking-wide">Total balance</p>
        {accounts === undefined ? (
          <div className="h-12 w-72 max-w-full animate-pulse rounded-lg bg-db-bg" />
        ) : (
          <h1 className="leading-none"><MoneyAmount value={totalBalance} currency={currency} className="text-[clamp(2rem,4vw,3rem)]" /></h1>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-3">
        <button
          onClick={() => router.push("/transfers")}
          className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-db-primary px-1 py-2 text-xs font-bold text-db-text-primary shadow-sm transition-all hover:bg-db-primary-hover active:scale-[0.97] sm:flex-row sm:gap-2 sm:rounded-full sm:px-6 sm:py-2.5 sm:text-sm"
        >
          <Plain size={18} className="shrink-0" />
          <span className="truncate w-full text-center">Send</span>
        </button>
        <button
          onClick={() => router.push("/deposit")}
          className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-db-border bg-white px-1 py-2 text-xs font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-[0.97] sm:flex-row sm:gap-2 sm:rounded-full sm:px-6 sm:py-2.5 sm:text-sm"
        >
          <CashOut size={18} className="shrink-0" />
          <span className="truncate w-full text-center">Add money</span>
        </button>
        <button
          onClick={() => router.push("/transfers")}
          className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-db-border bg-white px-1 py-2 text-xs font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-[0.97] sm:flex-row sm:gap-2 sm:rounded-full sm:px-6 sm:py-2.5 sm:text-sm"
        >
          <TransferHorizontal size={18} className="shrink-0" />
          <span className="truncate w-full text-center">Request</span>
        </button>
      </div>
    </div>
  );
}
