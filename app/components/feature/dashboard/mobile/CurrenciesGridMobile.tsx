"use client";

import { useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AccountCurrencyCard, LoadingCard } from "../primitives";

export function CurrenciesGridMobile() {
  const accounts = useQuery(api.accounts.getAccounts);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(":scope > *") as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 16;
    const index = Math.round(track.scrollLeft / Math.max(step, 1));
    setActiveIndex(Math.max(0, Math.min(index, (accounts?.length ?? 0) - 1)));
  };

  const count = accounts?.length ?? 0;

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-base font-semibold text-db-text-primary">Accounts</h2></div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="-mr-5 -ml-2 flex gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {accounts === undefined && (
          <>
            <LoadingCard className="h-47.5 w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] shrink-0 sm:h-55 sm:w-72 sm:min-w-72" />
            <LoadingCard className="h-47.5 w-[calc(100vw-64px)] min-w-[calc(100vw-64px)] shrink-0 sm:h-55 sm:w-72 sm:min-w-72" />
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
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {accounts?.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${i === activeIndex ? "h-1.5 w-4 bg-db-primary" : "size-1.5 bg-db-border"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}