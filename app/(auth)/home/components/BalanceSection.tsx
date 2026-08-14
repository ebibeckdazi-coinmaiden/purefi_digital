"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MoneyAmount } from "@/app/components/feature/dashboard/primitives";
import RiIcon from "@/app/components/ui/RiIcon";

export default function BalanceSection() {
  const accounts = useQuery(api.accounts.getAccounts);

  const { totalBalance, primaryCurrency } = useMemo(() => {
    const total =
      (accounts ?? []).reduce((sum, a) => sum + (a.balance ?? 0), 0) ?? 0;
    const primary =
      accounts?.find((a) => a.type === "local" || a.kind === "local") ??
      accounts?.[0];
    return {
      totalBalance: total,
      primaryCurrency: primary?.currency ?? "USD",
    };
  }, [accounts]);

  const actions = [
    { href: "/transfers", label: "Send", icon: "ri-send-plane-fill", primary: true },
    { href: "/deposit", label: "Add money", icon: "ri-add-line", primary: false },
    { href: "/transfers", label: "Request", icon: "ri-arrow-left-down-line", primary: false },
  ];

  return (
    <div className="rounded-2xl border border-db-border bg-white p-5 shadow-[0_1px_2px_rgba(22,51,0,0.04)]">
      <p className="text-sm font-medium text-db-text-muted">Total balance</p>
      <MoneyAmount
        value={totalBalance}
        currency={primaryCurrency}
        className="mt-1 text-[clamp(1.75rem,6vw,2.5rem)] break-words"
      />
      <div className="mt-5 flex flex-wrap gap-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={
              a.primary
                ? "flex min-h-11 items-center gap-2 rounded-full bg-db-primary px-6 py-2.5 text-sm font-bold text-db-text-primary transition-all hover:bg-db-primary-hover active:scale-95"
                : "flex min-h-11 items-center gap-2 rounded-full border border-db-border bg-white px-6 py-2.5 text-sm font-semibold text-db-text-primary transition-all hover:bg-db-hover active:scale-95"
            }
          >
            <RiIcon className={`text-base ${a.icon}`} />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
