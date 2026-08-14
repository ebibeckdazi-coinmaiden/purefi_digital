"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import {
  SectionHeader,
  EmptyState,
  LoadingCard,
} from "@/app/components/feature/dashboard/primitives";
import { TransactionRow } from "@/app/components/banking";
import RiIcon from "@/app/components/ui/RiIcon";

function getLocalAccountId(accounts: any[] | undefined) {
  const local =
    accounts?.find((a) => a.type === "local" || a.kind === "local") ?? null;
  return local && "_id" in local ? local._id : null;
}

export default function TransactionsList() {
  const accounts = useQuery(api.accounts.getAccounts);
  const localAccountId = getLocalAccountId(accounts);
  const transactions = useQuery(
    api.transactions.getTransactionsByAccount,
    localAccountId ? { bankAccountId: localAccountId } : "skip",
  );

  const rows = useMemo(() => {
    return (transactions ?? []).slice(0, 5).map((tx) => {
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
        subtitle: tx.merchant ?? tx.category ?? "Arxforth Bank",
        amount: amount.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        amountCurrency: currency,
        isPositive,
        status: (tx.status ?? "completed") as string,
      };
    });
  }, [transactions]);

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader
        title="Recent transactions"
        action={
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs font-bold text-db-primary hover:underline"
          >
            View all
            <RiIcon className="ri-arrow-right-s-line text-sm" />
          </Link>
        }
      />
      <div className="mt-3">
        {transactions === undefined ? (
          <LoadingCard />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Your recent activity will appear here once you start using your account."
          />
        ) : (
          rows.map((tx) => (
            <TransactionRow
              key={tx.id}
              icon={tx.icon}
              title={tx.title}
              subtitle={tx.subtitle}
              amount={tx.amount}
              amountCurrency={tx.amountCurrency}
              isPositive={tx.isPositive}
              status={tx.status}
              onClick={() => {}}
            />
          ))
        )}
      </div>
    </Card>
  );
}
