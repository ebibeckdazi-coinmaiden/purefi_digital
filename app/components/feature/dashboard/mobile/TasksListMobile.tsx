"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowUp, AltArrowRight } from "@solar-icons/react-perf/BoldDuotone";
import { api } from "@/convex/_generated/api";
import { EmptyState, LoadingCard, SectionHeader } from "../primitives";

export function TasksListMobile() {
  const requests = useQuery(api.transfers.getIncomingRequests);
  if (requests === undefined) return <LoadingCard className="h-full" />;

  return (
    <section className="w-full">
      <SectionHeader title="Tasks" action={<Link href="/transfers" className="text-xs font-semibold text-db-text-primary underline decoration-db-primary underline-offset-4">View all</Link>} />
      {requests.length === 0 ? (
        <div className="mt-4"><EmptyState title="You are all caught up" description="New payment requests that need your response will appear here." /></div>
      ) : (
        <div className="mt-4 space-y-3">
          {requests.slice(0, 3).map((request) => (
            <Link
              key={request._id}
              href="/transfers"
              className="flex items-center gap-3 rounded-2xl border border-db-border bg-white p-4 transition-colors duration-200 active:bg-db-hover"
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-db-border bg-db-bg">
                <ArrowUp size={18} className="text-db-text-primary" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-db-text-primary">{request.from} requested {request.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                <p className="truncate text-xs text-db-text-secondary">{request.note || "Needs approval"}</p>
              </div>
              <AltArrowRight size={18} className="shrink-0 text-db-text-muted" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
