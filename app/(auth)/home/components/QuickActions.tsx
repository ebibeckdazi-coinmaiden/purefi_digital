"use client";

import { Plain, CashOut, TransferHorizontal } from "@solar-icons/react-perf/BoldDuotone";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => router.push("/transfers")}
        className="flex min-h-11 items-center gap-2 rounded-full bg-db-primary px-6 py-2.5 text-sm font-bold text-db-text-primary shadow-sm transition-all hover:bg-db-primary-hover active:scale-[0.97]"
      >
        <Plain size={18} /> Send
      </button>
      <button
        onClick={() => router.push("/deposit")}
        className="flex min-h-11 items-center gap-2 rounded-full border border-db-border bg-white px-6 py-2.5 text-sm font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-[0.97]"
      >
        <CashOut size={18} /> Add money
      </button>
      <button
        onClick={() => router.push("/transfers")}
        className="flex min-h-11 items-center gap-2 rounded-full border border-db-border bg-white px-6 py-2.5 text-sm font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-[0.97]"
      >
        <TransferHorizontal size={18} /> Request
      </button>
      <button
        onClick={() => router.push("/convert")}
        className="flex min-h-11 items-center gap-2 rounded-full border border-db-border bg-white px-6 py-2.5 text-sm font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-[0.97]"
      >
        <TransferHorizontal size={18} /> Convert
      </button>
    </div>
  );
}
