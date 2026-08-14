"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import { SectionHeader, EmptyState } from "@/app/components/feature/dashboard/primitives";
import CreateSavingsGoalModal from "./CreateSavingsGoalModal";
import AddFundsModal from "./AddFundsModal";
import type { Id } from "@/convex/_generated/dataModel";
import RiIcon from "@/app/components/ui/RiIcon";

export default function SavingsGoals() {
  const goals = useQuery(api.savingsGoals.getSavingsGoals);
  const accounts = useQuery(api.accounts.getAccounts);

  const [createOpen, setCreateOpen] = useState(false);
  const [addFunds, setAddFunds] = useState<{
    id: Id<"savings_goals"> | null;
    title: string;
  }>({ id: null, title: "" });

  const currency =
    accounts?.find((a) => a.type === "local" || a.kind === "local")?.currency ?? "USD";

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader
        title="Savings Goals"
        action={
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-db-primary px-4 py-2.5 text-xs font-bold text-db-text-primary transition-all hover:bg-db-primary-hover active:scale-95"
          >
            <RiIcon className="ri-add-line text-sm" />
            Add Goal
          </button>
        }
      />
      <div className="mt-4 space-y-4">
        {goals === undefined ? (
          <div className="h-20 animate-pulse rounded-xl bg-db-bg" />
        ) : goals.length === 0 ? (
          <EmptyState
            title="No savings goals"
            description="Set a target and start building towards your next goal."
            action={
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1 rounded-full bg-db-primary px-4 py-2 text-xs font-bold text-db-text-primary"
              >
                Create goal
              </button>
            }
          />
        ) : (
          goals.map((goal) => {
            const current = goal.current ?? 0;
            const target = goal.target ?? 1;
            const pct = Math.min(Math.round((current / target) * 100), 100);
            return (
              <div
                key={goal._id}
                className="rounded-xl border border-db-border bg-db-bg p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-db-text-primary">{goal.title}</p>
                  <span className="text-[11px] font-semibold uppercase text-db-text-muted">
                    {goal.priority}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-db-text-primary">
                    {currency} {current.toLocaleString()}
                  </span>
                  <span className="text-db-text-muted">
                    of {currency} {target.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-db-border">
                  <div
                    className="h-full rounded-full bg-db-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-db-text-muted">
                    {pct}% complete
                  </span>
                  <button
                    onClick={() =>
                      setAddFunds({ id: goal._id, title: goal.title })
                    }
                    className="inline-flex items-center gap-1 rounded-full border border-db-border bg-white px-3 py-1.5 text-xs font-bold text-db-text-primary transition-colors hover:bg-db-hover"
                  >
                    <RiIcon className="ri-wallet-line text-sm" />
                    Add Funds
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateSavingsGoalModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <AddFundsModal
        isOpen={addFunds.id !== null}
        onClose={() => setAddFunds({ id: null, title: "" })}
        goalId={addFunds.id}
        goalTitle={addFunds.title}
      />
    </Card>
  );
}
