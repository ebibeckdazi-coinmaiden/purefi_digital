"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MoneyAmount } from "@/app/components/feature/dashboard/primitives";

export function BalanceOverview() {
  const accounts = useQuery(api.accounts.getAccounts);
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance ?? 0), 0) ?? 0;
  const currency = accounts?.[0]?.currency ?? "GBP";
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-db-text-secondary tracking-wide">Total balance</p>
      <h1 className="leading-none"><MoneyAmount value={totalBalance} currency={currency} className="text-[clamp(2rem,4vw,3rem)]" /></h1>
    </div>
  );
}
