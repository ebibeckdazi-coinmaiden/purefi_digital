"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import { SectionHeader } from "@/app/components/feature/dashboard/primitives";

function localAccountId(accounts: any[] | undefined) {
  const local =
    accounts?.find((a: any) => a.type === "local" || a.kind === "local") ?? null;
  return local && "_id" in local ? local._id : null;
}

function internationalAccountId(accounts: any[] | undefined) {
  const intl =
    accounts?.find(
      (a: any) => a.type === "international" || a.kind === "international",
    ) ?? null;
  return intl && "_id" in intl ? intl._id : null;
}

export default function SpendingChart() {
  const accounts = useQuery(api.accounts.getAccounts);
  const localId = localAccountId(accounts);
  const intlId = internationalAccountId(accounts);
  const localTx = useQuery(
    api.transactions.getTransactionsByAccount,
    localId ? { bankAccountId: localId } : "skip",
  );
  const intlTx = useQuery(
    api.transactions.getTransactionsByAccount,
    intlId ? { bankAccountId: intlId } : "skip",
  );

  const data = useMemo(() => {
    const combined = [...(localTx ?? []), ...(intlTx ?? [])];
    const now = new Date();
    const months: { key: string; label: string; income: number; outcome: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-US", { month: "short" }),
        income: 0,
        outcome: 0,
      });
    }
    for (const tx of combined) {
      const parsed = Date.parse(tx.date);
      if (!Number.isFinite(parsed)) continue;
      const d = new Date(parsed);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (!bucket) continue;
      if (tx.amount >= 0) bucket.income += tx.amount;
      else bucket.outcome += Math.abs(tx.amount);
    }
    return months.map((m) => ({
      name: m.label,
      Income: Math.round(m.income),
      Expenses: Math.round(m.outcome),
    }));
  }, [localTx, intlTx]);

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader title="Spending analysis" />
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--db-primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--db-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--db-border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--db-text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--db-text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--db-bg)",
                border: "1px solid var(--db-border)",
                borderRadius: 12,
                color: "var(--db-text-primary)",
              }}
              labelStyle={{ color: "var(--db-text-secondary)" }}
            />
            <Area
              type="monotone"
              dataKey="Income"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#incFill)"
            />
            <Area
              type="monotone"
              dataKey="Expenses"
              stroke="var(--db-primary)"
              strokeWidth={2}
              fill="url(#expFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
