"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AccountCurrencyCard, LoadingCard } from "@/app/components/feature/dashboard/primitives";

// Local fallback for AddAccountCard when not exported from primitives
function AddAccountCard() {
  return (
    <div className="min-w-100 flex items-center justify-center rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
      Add account
    </div>
  );
}

export default function CurrenciesGrid() {
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({}).catch(() => {});
  }, [ensureUserAccounts, identity]);

  const items = useMemo(() => {
    return (accounts ?? []).map((acc) => ({
      currency: acc.currency ?? "USD",
      balance: acc.balance ?? 0,
      number: acc.number,
    }));
  }, [accounts]);

  return (
      <div className="-mx-1 w-full flex gap-3 overflow-x-hidden px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {accounts === undefined ? (
          <>
            <LoadingCard className="min-w-100" />
            <LoadingCard className="min-w-100" />
          </>
        ) : (
          <>
            {items.map((acc) => (
              <AccountCurrencyCard
                key={`${acc.currency}-${acc.number}`}
                currency={acc.currency}
                balance={acc.balance}
                number={acc.number}
              />
            ))}
            <AddAccountCard />
          </>
        )}
      </div>
  );
}
