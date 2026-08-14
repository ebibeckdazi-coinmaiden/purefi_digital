"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { SectionHeader, AccountCurrencyCard, LoadingCard } from "../primitives";

export function CurrenciesGridDesktop() {
  const accounts = useQuery(api.accounts.getAccounts);

  return (
    <section className="flex flex-col gap-4 w-full">
      <SectionHeader title="Accounts" action={<Link href="/accounts" className="text-xs font-semibold text-db-text-primary underline decoration-db-primary underline-offset-4">View all</Link>} />
      <div className="-mx-1 flex snap-x w-full overflow-hidden snap-mandatory gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {accounts === undefined && (
          <>
            <LoadingCard className="h-55 w-96 min-w-72 shrink-0" />
            <LoadingCard className="h-55 w-96 min-w-72 shrink-0" />
          </>
        )}
        {accounts?.map((account, i) => (
          <AccountCurrencyCard
            key={`${account.currency ?? "USD"}-${account.number ?? i}`}
            currency={account.currency ?? "USD"}
            balance={account.balance}
            number={account.number}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
