"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import { SectionHeader, EmptyState } from "@/app/components/feature/dashboard/primitives";
import { getCardStyle } from "@/app/components/feature/ModernCreditCard";
import RiIcon from "@/app/components/ui/RiIcon";

export default function CreditCards() {
  const ensureDefaultCard = useMutation(api.creditCards.ensureDefaultCard);
  const creditCards = useQuery(api.creditCards.getCreditCards);
  const user = useQuery(api.user.user);
  const authUser = useQuery(api.auth.getCurrentUser);
  const accounts = useQuery(api.accounts.getAccounts);

  useEffect(() => {
    if (!authUser && !user) return;
    void ensureDefaultCard().catch(() => {});
  }, [ensureDefaultCard, authUser, user]);

  const holder =
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.toUpperCase()
      : authUser?.name?.toUpperCase()) ?? "CARD HOLDER";

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader title="Credit Cards" />
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {creditCards === undefined ? (
          <div className="h-36 animate-pulse rounded-2xl bg-db-bg" />
        ) : creditCards.length === 0 ? (
          <EmptyState
            title="No cards yet"
            description="Your default card will appear here."
          />
        ) : (
          creditCards.map((card) => {
            const style = getCardStyle(card.name ?? "Card");
            const limit = card.limit ?? 1;
            const used = Math.max(0, card.balance ?? 0);
            const usedPct = Math.min(Math.round((used / limit) * 100), 100);
            return (
              <div
                key={card._id}
                className="relative aspect-[1.586/1] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black opacity-90" />
                <div className="absolute -right-6 -top-6 size-32 rounded-full bg-luxury-gold/20 blur-3xl" />
                <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                      {card.name}
                    </span>
                    <RiIcon className="ri-rfid-line text-xl opacity-60" />
                  </div>
                  <div className="font-mono text-lg tracking-[0.15em]">
                    ●●●● {card.number.slice(-4)}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider opacity-70">
                        Holder
                      </p>
                      <p className="text-xs font-medium uppercase">{holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase tracking-wider opacity-70">
                        Due
                      </p>
                      <p className="text-xs font-mono">{card.dueDate}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-luxury-gold"
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-white/70">
                      {used.toLocaleString()} / {limit.toLocaleString()} used
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
