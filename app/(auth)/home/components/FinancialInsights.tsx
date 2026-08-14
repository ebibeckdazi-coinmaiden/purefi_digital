"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import { SectionHeader } from "@/app/components/feature/dashboard/primitives";
import RiIcon from "@/app/components/ui/RiIcon";

export default function FinancialInsights() {
  const accounts = useQuery(api.accounts.getAccounts);

  const insights = useMemo(() => {
    const total =
      (accounts ?? []).reduce((sum, a) => sum + (a.balance ?? 0), 0) ?? 0;
    const monthlyExpenses =
      (accounts ?? []).reduce(
        (sum, a) => sum + ("monthlyExpenses" in a ? (a.monthlyExpenses ?? 0) : 0),
        0,
      ) ?? 0;

    const list = [
      {
        icon: "ri-lightbulb-line",
        tone: "text-db-primary",
        bg: "bg-db-primary/10",
        title: "Spend smarter",
        text:
          monthlyExpenses > 0
            ? `You spent about ${monthlyExpenses.toLocaleString()} this month. Track it to stay on budget.`
            : "Start tracking your spending to get personalised tips.",
      },
      {
        icon: "ri-safe-line",
        tone: "text-db-success",
        bg: "bg-db-success/10",
        title: "Build savings",
        text:
          total > 0
            ? `You hold ${total.toLocaleString()} across your accounts. Consider a savings goal.`
            : "Add funds to begin building your savings.",
      },
      {
        icon: "ri-exchange-line",
        tone: "text-db-text-primary",
        bg: "bg-db-hover",
        title: "Multi-currency",
        text: "Hold and convert between currencies to avoid FX fees abroad.",
      },
    ];
    return list;
  }, [accounts]);

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader title="Financial insights" />
      <div className="mt-4 space-y-3">
        {insights.map((ins, i) => (
          <motion.div
            key={ins.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-db-border bg-db-bg p-4"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${ins.bg} ${ins.tone}`}
            >
              <RiIcon className={`text-lg ${ins.icon}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-db-text-primary">{ins.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-db-text-secondary">
                {ins.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
