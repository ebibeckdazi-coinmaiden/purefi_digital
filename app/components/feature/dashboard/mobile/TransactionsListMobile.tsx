"use client"
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { EmptyState } from "../primitives";

const merchantColors: Record<string, string> = {
  S: "bg-blue-500",
  G: "bg-gray-800",
  A: "bg-pink-500",
  M: "bg-teal-600",
  SL: "bg-purple-600",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function TransactionsListMobile() {
  const transactions = useQuery(api.transactions.getTransactions);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-db-text-primary">Transactions</h3>
        <Link href="/transactions" className="text-xs font-semibold text-db-text-primary underline decoration-db-primary underline-offset-4">View all</Link>
      </div>

      {transactions === undefined ? (
        <div className="mt-4 space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-3.5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-db-bg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 rounded bg-db-bg animate-pulse" />
                  <div className="h-3 w-24 rounded bg-db-bg animate-pulse" />
                </div>
              </div>
              <div className="h-3.5 w-20 rounded bg-db-bg animate-pulse" />
            </div>
          ))}
        </div>
      ) : transactions?.length === 0 ? (
        <div className="mt-4"><EmptyState title="No transactions yet" description="Transactions you make will appear here." /></div>
      ) : (
        <div className="mt-2">
          {transactions?.slice(0, 4).map((tx) => {
            const initial = tx.merchant?.[0]?.toUpperCase() || "?";
            const colorClass = merchantColors[initial] || "bg-db-primary/20 text-db-primary";
            const isPositive = tx.amount > 0;

            return (
              <div key={tx._id} className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`size-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${colorClass}`}>
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-db-text-primary truncate">{tx.merchant}</p>
                    <p className="text-[11px] font-medium text-db-text-muted truncate">
                      {isPositive ? "Received" : "Spent"} &bull; {formatDate(tx.date)}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-bold shrink-0 ${isPositive ? "text-db-success" : "text-db-text-primary"}`}>
                  {isPositive ? "+" : "-"}{Math.abs(tx.amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
