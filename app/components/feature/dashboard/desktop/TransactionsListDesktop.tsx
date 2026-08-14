"use client"
import { useQuery } from "convex/react";
import {
  Magnifer,
  Filter
} from "@solar-icons/react-perf/BoldDuotone";
import Card from "@/app/components/base/Card";
import { api } from "@/convex/_generated/api";

const merchantColors: Record<string, string> = {
  S: "bg-blue-500",
  G: "bg-gray-800",
  A: "bg-pink-500",
  M: "bg-teal-600",
  SL: "bg-purple-600",
};

export function TransactionsListDesktop() {
  const transactions = useQuery(api.transactions.getTransactions);

  return (
    <Card className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-base font-bold text-db-text-primary">Transactions</h3>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-db-text-muted" />
            <input
              type="text"
              placeholder="Search transactions"
              className="w-full pl-9 pr-3 py-2.5 bg-db-bg border border-db-border rounded-xl text-xs font-medium text-db-text-primary placeholder:text-db-text-muted focus:outline-none focus:border-db-primary transition-colors duration-200"
            />
          </div>
          <button className="min-h-11 min-w-11 p-2 flex items-center justify-center rounded-lg bg-db-bg border border-db-border text-db-text-muted hover:text-db-text-primary transition-colors duration-200">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-xl bg-db-bg p-1 sm:flex sm:gap-2 sm:rounded-none sm:bg-transparent sm:p-0 sm:border-b sm:border-db-border sm:pb-4">
        {["All", "Sent", "Received"].map((tab) => (
          <button
            key={tab}
            className={`flex w-full items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold transition-colors duration-200 sm:w-auto sm:rounded-full sm:py-2.5 ${
              tab === "All"
                ? "bg-db-primary text-white"
                : "text-db-text-secondary hover:text-db-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="divide-y divide-db-border/50">
        {transactions === undefined ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between -mx-5 px-5 py-3 rounded-xl sm:mx-0 sm:px-1 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-db-bg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 rounded bg-db-bg animate-pulse" />
                  <div className="h-3 w-24 rounded bg-db-bg animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-3.5 w-20 ml-auto rounded bg-db-bg animate-pulse" />
                <div className="h-3 w-14 ml-auto rounded bg-db-bg animate-pulse" />
              </div>
            </div>
          ))
        ) : transactions?.slice(0, 6).map((tx) => {
          const initial = tx.merchant?.[0]?.toUpperCase() || "?";
          const colorClass = merchantColors[initial] || "bg-db-primary/20 text-db-primary";
          const isPositive = tx.amount > 0;

          return (
            <div key={tx._id} className="flex items-center justify-between gap-3 -mx-5 px-5 py-3 rounded-xl hover:bg-db-hover transition-colors duration-200 cursor-default sm:mx-0 sm:px-1 sm:py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${colorClass}`}>
                  {initial}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-db-text-primary truncate">{tx.merchant}</p>
                  <p className="text-[11px] font-medium text-db-text-muted truncate">
                    {tx.type} &bull; {tx.date}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className={`text-sm font-bold ${isPositive ? "text-db-success" : "text-db-text-primary"}`}>
                  {isPositive ? "+" : ""}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.currency}
                </p>
                <p className="text-[11px] font-medium text-db-text-muted">Successful</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full pt-4 pb-2 text-xs font-semibold text-db-text-muted hover:text-db-primary transition-colors duration-200 text-center border-t border-db-border">
        View all transactions
      </button>
    </Card>
  );
}
