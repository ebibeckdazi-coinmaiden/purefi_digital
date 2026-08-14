"use client"
import { useQuery } from "convex/react";
import { Plain, CashOut, TransferHorizontal, AltArrowDown } from "@solar-icons/react-perf/BoldDuotone";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { MoneyAmount } from "../primitives";

export function BalanceSectionMobile() {
  const router = useRouter();
  const accounts = useQuery(api.accounts.getAccounts);
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance ?? 0), 0) ?? 0;
  const currency = accounts?.[0]?.currency ?? "GBP";

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-db-text-secondary tracking-wide">Total balance</p>
        {accounts === undefined ? (
          <div className="h-12 w-72 max-w-full animate-pulse rounded-lg bg-db-bg" />
        ) : (
          <h1 className="leading-none">
            <MoneyAmount
              value={totalBalance}
              currency={currency}
              className="text-[clamp(2rem,9vw,2.75rem)]"
              suffix={<AltArrowDown size={18} className="ml-1.5 inline-block shrink-0 align-baseline text-db-text-muted" />}
            />
          </h1>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => router.push("/transfers")}
          className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl px-1 py-3 transition-colors duration-200 active:scale-[0.98]"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-db-primary text-db-text-primary transition-transform duration-200 group-hover:scale-[1.02]">
            <Plain size={22} />
          </span>
          <span className="w-full truncate text-center text-[11px] font-semibold text-db-text-primary">Send</span>
        </button>
        <button
          onClick={() => router.push("/deposit")}
          className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl px-1 py-3 transition-colors duration-200 active:scale-[0.98]"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-db-border bg-white text-db-text-primary transition-colors duration-200 group-hover:bg-db-hover">
            <CashOut size={22} />
          </span>
          <span className="w-full truncate text-center text-[11px] font-semibold text-db-text-primary">Add money</span>
        </button>
        <button
          onClick={() => router.push("/transfers")}
          className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl px-1 py-3 transition-colors duration-200 active:scale-[0.98]"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-db-border bg-white text-db-text-primary transition-colors duration-200 group-hover:bg-db-hover">
            <TransferHorizontal size={22} />
          </span>
          <span className="w-full truncate text-center text-[11px] font-semibold text-db-text-primary">Request</span>
        </button>
      </div>
    </div>
  );
}
