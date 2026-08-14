"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { AddCircle, AltArrowRight } from "@solar-icons/react-perf/BoldDuotone";
import Card from "@/app/components/base/Card";
import { api } from "@/convex/_generated/api";
import { EmptyState, LoadingCard, SectionHeader } from "../primitives";

const avatarColours = ["bg-teal-600", "bg-orange-500", "bg-sky-600", "bg-violet-600"];

export function RecentRecipientsDesktop() {
  const recipients = useQuery(api.beneficiaries.getBeneficiaries);

  if (recipients === undefined) return <LoadingCard />;

  return (
    <Card className="flex h-full flex-col space-y-5">
      <SectionHeader title="Recent recipients" action={<Link href="/transfers" className="text-xs font-semibold text-db-text-primary underline decoration-db-primary underline-offset-4">View all</Link>} />
      {recipients.length === 0 ? (
        <EmptyState title="No recipients yet" description="Recipients you save while making a transfer will appear here." action={<Link href="/transfers" className="text-xs font-bold text-db-text-primary underline decoration-db-primary underline-offset-4">Start a transfer</Link>} />
      ) : (
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:block sm:gap-0 sm:overflow-visible sm:px-0 sm:pb-0 sm:divide-y sm:divide-db-border/60">
          {recipients.slice(0, 4).map((recipient, index) => {
            const initials = recipient.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
            return <Link href="/transfers" key={recipient._id} className="flex shrink-0 flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-db-hover sm:w-full sm:shrink sm:flex-row sm:justify-between sm:gap-3 sm:rounded-none sm:px-3 sm:py-3 sm:hover:bg-db-hover"><div className="flex flex-col items-center gap-2 sm:min-w-0 sm:flex-row sm:items-center sm:gap-3"><div className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColours[index % avatarColours.length]}`}>{initials}</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-db-text-primary sm:hidden">{recipient.name.split(" ")[0]}</p><p className="hidden truncate text-sm font-semibold text-db-text-primary sm:block">{recipient.name}</p><p className="hidden truncate text-[11px] font-medium text-db-text-muted sm:block">{recipient.bankName ?? "Bank recipient"}</p></div></div><AltArrowRight size={18} className="hidden shrink-0 text-db-text-muted sm:block" /></Link>;
          })}
          <Link href="/transfers" className="flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-db-border px-4 py-3 text-db-text-secondary transition-colors duration-200 hover:border-db-primary hover:text-db-primary sm:hidden"><AddCircle size={22} /><span className="text-xs font-semibold">Add</span></Link>
        </div>
      )}
      <Link href="/transfers" className="hidden min-h-11 items-center justify-center gap-2 rounded-full border border-db-border text-xs font-semibold text-db-text-secondary transition-colors duration-200 hover:bg-db-hover hover:text-db-text-primary sm:flex"><AddCircle size={16} />Add recipient</Link>
    </Card>
  );
}
