"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowDown } from "@solar-icons/react-perf/BoldDuotone";
import Card from "@/app/components/base/Card";
import { api } from "@/convex/_generated/api";
import { EmptyState, LoadingCard, SectionHeader, StatusBadge } from "../primitives";

export function TasksListDesktop() {
  const requests = useQuery(api.transfers.getIncomingRequests);
  if (requests === undefined) return <LoadingCard className="h-full" />;

  return <Card className="flex h-full flex-col space-y-5"><SectionHeader title="Tasks" action={<Link href="/transfers" className="text-xs font-semibold text-db-text-primary underline decoration-db-primary underline-offset-4">View all</Link>} />{requests.length === 0 ? <EmptyState title="You are all caught up" description="New payment requests that need your response will appear here." /> : <div className="flex-1 space-y-3">{requests.slice(0, 3).map((request) => <div key={request._id} className="flex flex-col gap-3 rounded-xl border border-db-border bg-db-hover p-4 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-db-border bg-white"><ArrowDown size={18} className="text-db-text-primary" /><span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-amber-500" /></div><div className="min-w-0"><p className="truncate text-sm font-bold text-db-text-primary">{request.from} requested {request.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p><p className="truncate text-xs text-db-text-secondary">{request.note || "Payment request"}</p></div></div><div className="flex items-center justify-between gap-3 border-t border-db-border/60 pt-3 sm:border-t-0 sm:pt-0 sm:justify-end"><StatusBadge tone="warning">Needs review</StatusBadge><Link href="/transfers" className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-db-primary px-5 py-2 text-center text-xs font-bold text-db-text-primary transition-colors duration-200 hover:bg-db-primary-hover sm:flex-none">Review</Link></div></div>)}</div>}</Card>;
}
