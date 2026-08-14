"use client";
import { cn } from "@/lib/utils";
import { CircleFlag } from "react-circle-flags";

interface AccountOption {
  id: string;
  currency: string;
  balance: number;
  label: string;
}

interface AccountPickerProps {
  accounts: AccountOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const countryByCurrency: Record<string, string> = { GBP: "gb", EUR: "eu", USD: "us", AUD: "au", CAD: "ca", CHF: "ch", JPY: "jp", NGN: "ng" };

export function AccountPicker({ accounts, selectedId, onSelect }: AccountPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {accounts.map((acc) => (
        <button
          key={acc.id}
          type="button"
          onClick={() => onSelect(acc.id)}
          className={cn(
            "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all snap-start min-w-0 shrink-0",
            selectedId === acc.id
              ? "border-db-primary bg-db-primary-subtle"
              : "border-db-border bg-white hover:bg-db-hover"
          )}
        >
          <CircleFlag countryCode={countryByCurrency[acc.currency] ?? "us"} className="size-7 rounded-full" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-db-text-primary">{acc.currency}</p>
            <p className="text-xs text-db-text-muted">{acc.label}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
