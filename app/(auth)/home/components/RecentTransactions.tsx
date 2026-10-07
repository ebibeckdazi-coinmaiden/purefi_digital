"use client";

import { TransactionRow } from "@/app/components/banking";
import Card from "@/app/components/base/Card";
import {
  EmptyState,
  LoadingCard,
  SectionHeader,
} from "@/app/components/feature/dashboard/primitives";
import RiIcon from "@/app/components/ui/RiIcon";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Filter = "all" | "received" | "sent";

function localAccountId(accounts: any[] | undefined) {
  const local =
    accounts?.find((a: any) => a.type === "local" || a.kind === "local") ??
    null;
  return local && "_id" in local ? local._id : null;
}

function statusTone(status?: string) {
  switch (status) {
    case "completed":
      return "text-db-success";
    case "pending":
      return "text-db-warning";
    case "failed":
      return "text-db-danger";
    default:
      return "text-db-text-muted";
  }
}

export default function RecentTransactions() {
  const accounts = useQuery(api.accounts.getAccounts);
  const localId = localAccountId(accounts);
  const transactions = useQuery(
    api.transactions.getTransactionsByAccount,
    localId ? { bankAccountId: localId } : "skip",
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(5);

  const rows = useMemo(() => {
    let list = transactions ?? [];
    if (filter === "received") list = list.filter((t) => t.amount >= 0);
    if (filter === "sent") list = list.filter((t) => t.amount < 0);
    return list.slice(0, visible).map((tx) => {
      const amount = Math.abs(tx.amount ?? 0);
      const isPositive = (tx.amount ?? 0) >= 0;
      const currency = (tx as any).currency ?? "USD";
      return {
        id: tx._id,
        icon: (
          <div className="flex size-9 items-center justify-center rounded-full bg-db-primary/20 text-db-primary">
            <RiIcon
              className={`text-base ${isPositive ? "ri-arrow-left-down-line" : "ri-arrow-right-up-line"}`}
            />
          </div>
        ),
        title: tx.description ?? "Transaction",
        subtitle: tx.merchant ?? tx.category ?? "Purefi Bank",
        amount: amount.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        amountCurrency: currency,
        isPositive,
        status: (tx.status ?? "completed") as string,
      };
    });
  }, [transactions, filter, visible]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "received", label: "Received" },
    { key: "sent", label: "Sent" },
  ];

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader
        title="Recent transactions"
        action={
          <div className="flex gap-1 rounded-full bg-db-hover p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setFilter(t.key);
                  setVisible(5);
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition-colors",
                  filter === t.key
                    ? "bg-white text-db-text-primary shadow-sm"
                    : "text-db-text-muted hover:text-db-text-primary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />
      <div className="mt-3">
        {transactions === undefined ? (
          <LoadingCard />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No transactions"
            description="There are no transactions to show for this filter."
          />
        ) : (
          <>
            {rows.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(statusTone(tx.status), "")}
              >
                <TransactionRow
                  icon={tx.icon}
                  title={tx.title}
                  subtitle={tx.subtitle}
                  amount={tx.amount}
                  amountCurrency={tx.amountCurrency}
                  isPositive={tx.isPositive}
                  status={tx.status}
                  onClick={() => {}}
                />
              </motion.div>
            ))}
            {(transactions?.length ?? 0) > visible && (
              <button
                onClick={() => setVisible((v) => v + 5)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-db-border py-2.5 text-xs font-bold text-db-text-secondary transition-colors hover:bg-db-hover hover:text-db-text-primary"
              >
                Load more
                <RiIcon className="ri-arrow-down-s-line text-sm" />
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
