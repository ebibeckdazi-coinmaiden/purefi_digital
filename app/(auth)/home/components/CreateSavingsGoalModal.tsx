"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Dialog from "@/app/components/ui/Dialog";
import { cn } from "@/lib/utils";
import RiIcon from "@/app/components/ui/RiIcon";

const PRIORITIES = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

export default function CreateSavingsGoalModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const create = useMutation(api.savingsGoals.createSavingsGoal);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setTitle("");
    setTarget("");
    setMonthly("");
    setDate("");
    setPriority("medium");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    setIsLoading(true);
    try {
      await create({
        title,
        target: Number(target),
        monthlyContribution: Number(monthly) || 0,
        deadline: date || new Date().toISOString().slice(0, 10),
        priority,
      });
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-db-bg border border-db-border rounded-xl px-4 py-3 text-sm font-medium text-db-text-primary placeholder:text-db-text-muted focus:outline-none focus:border-db-primary/50 focus:ring-1 focus:ring-db-primary/50 transition-all";

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="New Savings Goal" type="success">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-db-text-secondary uppercase tracking-wider">
            Goal name
          </label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Emergency fund"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-db-text-secondary uppercase tracking-wider">
              Target
            </label>
            <input
              type="number"
              min="1"
              className={inputClass}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-db-text-secondary uppercase tracking-wider">
              Monthly
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-db-text-secondary uppercase tracking-wider">
            Target date
          </label>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-db-text-secondary uppercase tracking-wider">
            Priority
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p.key}
                onClick={() => setPriority(p.key)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition-all",
                  priority === p.key
                    ? "border-db-primary bg-db-primary/10 text-db-primary"
                    : "border-db-border bg-db-bg text-db-text-muted hover:text-db-text-primary",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-db-text-muted hover:text-db-text-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-2xl bg-db-primary px-6 py-2.5 text-sm font-extrabold text-db-text-primary transition-all hover:bg-db-primary-hover active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <RiIcon className="ri-loader-4-line animate-spin text-lg" />
            ) : (
              <RiIcon className="ri-check-line text-lg" />
            )}
            Create Goal
          </button>
        </div>
      </form>
    </Dialog>
  );
}
