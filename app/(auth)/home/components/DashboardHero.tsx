"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import { MoneyAmount, StatusBadge } from "@/app/components/feature/dashboard/primitives";
import ModernCreditCard from "@/app/components/feature/ModernCreditCard";
import { getCardStyle } from "@/app/components/feature/ModernCreditCard";
import RiIcon from "@/app/components/ui/RiIcon";

export default function DashboardHero() {
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const ensureDefaultCard = useMutation(api.creditCards.ensureDefaultCard);
  const user = useQuery(api.user.user);
  const authUser = useQuery(api.auth.getCurrentUser);
  const accounts = useQuery(api.accounts.getAccounts);
  const creditCards = useQuery(api.creditCards.getCreditCards);
  const transactions = useQuery(
    api.transactions.getTransactionsByAccount,
    accounts?.find((a) => a.type === "local" || a.kind === "local") &&
      "_id" in accounts.find((a) => a.type === "local" || a.kind === "local")!
      ? {
          bankAccountId: (
            accounts.find((a) => a.type === "local" || a.kind === "local") as any
          )._id,
        }
      : "skip",
  );

  useEffect(() => {
    if (!authUser && !user) return;
    void ensureUserAccounts({}).catch(() => {});
    void ensureDefaultCard().catch(() => {});
  }, [ensureUserAccounts, ensureDefaultCard, authUser, user]);

  const { totalBalance, primaryCurrency, holder, localCard } = useMemo(() => {
    const total =
      (accounts ?? []).reduce((sum, a) => sum + (a.balance ?? 0), 0) ?? 0;
    const primary =
      accounts?.find((a) => a.type === "local" || a.kind === "local") ??
      accounts?.[0];
    const holderName =
      (user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`.toUpperCase()
        : authUser?.name?.toUpperCase()) ?? "CARD HOLDER";
    return {
      totalBalance: total,
      primaryCurrency: primary?.currency ?? "USD",
      holder: holderName,
      localCard: creditCards?.[0],
    };
  }, [accounts, user, authUser, creditCards]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-3 md:p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-db-text-primary">Cards</h3>
          <StatusBadge tone="success">
            {(creditCards?.length ?? 0)} active
          </StatusBadge>
        </div>
        {localCard ? (
          <ModernCreditCard
            name={localCard.name}
            number={localCard.number}
            holder={holder}
            expiry={localCard.dueDate}
            isFrozen={localCard.freeze}
            style={getCardStyle(localCard.name ?? "Card")}
          />
        ) : (
          <div className="aspect-[1.586/1] w-full animate-pulse rounded-2xl bg-db-bg" />
        )}
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-db-border py-3 text-sm font-bold text-db-text-secondary transition-colors hover:border-db-primary/50 hover:bg-db-hover hover:text-db-text-primary">
          <RiIcon className="ri-add-line text-base" />
          Add New Card
        </button>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-db-border bg-db-bg p-4">
            <p className="text-xs font-medium text-db-text-muted">Card limit</p>
            <p className="mt-1 text-lg font-bold text-db-text-primary">
              {localCard?.limit?.toLocaleString() ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-db-border bg-db-bg p-4">
            <p className="text-xs font-medium text-db-text-muted">Card balance</p>
            <p className="mt-1 text-lg font-bold text-db-text-primary">
              {localCard?.balance?.toLocaleString() ?? "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col p-3 md:p-5">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-db-primary/20 text-db-primary">
            <RiIcon className="ri-wallet-line text-xl" />
          </div>
          <div>
            <p className="text-xs font-medium text-db-text-muted">Total Balance</p>
            <StatusBadge tone="success">+2.4%</StatusBadge>
          </div>
        </div>
        <MoneyAmount
          value={totalBalance}
          currency={primaryCurrency}
          className="mt-4 text-3xl"
        />
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/transfers"
            className="flex items-center justify-center gap-2 rounded-xl bg-db-primary px-4 py-3 text-sm font-bold text-db-text-primary transition-all hover:bg-db-primary-hover active:scale-95"
          >
            <RiIcon className="ri-send-plane-fill text-base" />
            Send
          </Link>
          <Link
            href="/deposit"
            className="flex items-center justify-center gap-2 rounded-xl border border-db-border bg-white px-4 py-3 text-sm font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-95"
          >
            <RiIcon className="ri-add-line text-base" />
            Top Up
          </Link>
        </div>
      </Card>
    </div>
  );
}
