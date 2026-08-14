"use client";

import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "@/app/components/base/Card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyState, LoadingCard, MoneyAmount, SectionHeader } from "../primitives";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e3e7df",
  fontSize: 12,
  fontWeight: 600,
  padding: "8px 12px",
};

export function SpendAnalyticsDesktop() {
  const transactions = useQuery(api.transactions.getTransactions);
  const { chartData, total, currency } = useMemo(() => {
    const expenses = (transactions ?? []).filter((transaction) => transaction.amount < 0).slice(0, 6).reverse();
    return { chartData: expenses.map((transaction) => ({ name: new Date(transaction.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), value: Math.abs(transaction.amount) })), total: expenses.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0), currency: expenses[0]?.currency ?? "USD" };
  }, [transactions]);
  if (transactions === undefined) return <LoadingCard className="h-full" />;
  return <Card className="flex h-full flex-col"><SectionHeader title="Spend analytics" action={<span className="text-xs font-semibold text-db-text-secondary">Recent activity</span>} />{chartData.length === 0 ? <div className="mt-4"><EmptyState title="No spending to chart" description="Completed outgoing transactions will appear here when they are available." /></div> : <><div className="mb-4 mt-5"><MoneyAmount value={total} currency={currency} className="text-2xl leading-none sm:text-[28px]" /><p className="mt-1 text-xs font-medium text-db-text-secondary">Total spent across recent activity</p></div><div className="min-h-44 flex-1 sm:min-h-40"><div className="h-full sm:hidden"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#77856f", fontSize: 11 }} /><YAxis hide domain={[0, "dataMax + 1"]} /><Tooltip cursor={{ fill: "rgba(22,51,0,0.04)" }} contentStyle={tooltipStyle} /><Bar dataKey="value" fill="#466b24" radius={[4, 4, 0, 0]} maxBarSize={28} /></BarChart></ResponsiveContainer></div><div className="hidden h-full sm:block"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="purefiSpendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9FE870" stopOpacity={0.55} /><stop offset="95%" stopColor="#9FE870" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#77856f", fontSize: 11 }} /><YAxis hide domain={[0, "dataMax + 1"]} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="value" stroke="#466b24" strokeWidth={2.5} fill="url(#purefiSpendFill)" dot={false} activeDot={{ r: 5, fill: "#466b24", stroke: "#fff", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div></div></>}</Card>;
}
