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
import { RecipientRow } from "@/app/components/banking";
import RiIcon from "@/app/components/ui/RiIcon";

export default function RecentRecipients() {
  const beneficiaries = useQuery(api.beneficiaries.getBeneficiaries);

  const rows = useMemo(() => {
    return (beneficiaries ?? []).slice(0, 4).map((b) => {
      const name = b.name ?? "Unknown";
      const initials = name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return {
        id: b._id,
        name,
        initials,
        colorClass: b.color ?? "bg-db-primary/20 text-db-primary",
        subtitle: b.bankName ?? (b.iban ? `•••• ${b.iban.slice(-4)}` : "No bank"),
      };
    });
  }, [beneficiaries]);

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader
        title="Recent recipients"
        action={
          <Link
            href="/transfers"
            className="flex items-center gap-1 text-xs font-bold text-db-primary hover:underline"
          >
            View all
            <RiIcon className="ri-arrow-right-s-line text-sm" />
          </Link>
        }
      />
      <div className="mt-3">
        {beneficiaries === undefined ? (
          <LoadingCard />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No recipients yet"
            description="Add a beneficiary to send money quickly to friends and family."
            action={
              <Link
                href="/transfers"
                className="inline-flex items-center gap-1 rounded-full bg-db-primary px-4 py-2 text-xs font-bold text-db-text-primary"
              >
                Add recipient
                <RiIcon className="ri-add-line text-sm" />
              </Link>
            }
          />
        ) : (
          rows.map((r) => (
            <RecipientRow
              key={r.id}
              initials={r.initials}
              colorClass={r.colorClass}
              name={r.name}
              subtitle={r.subtitle}
              onClick={() => {}}
            />
          ))
        )}
      </div>
    </Card>
  );
}
