import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TransactionRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  amountCurrency: string;
  isPositive: boolean;
  status?: string;
  onClick?: () => void;
}

const merchantColors: Record<string, string> = {
  S: "bg-blue-500", G: "bg-gray-800", A: "bg-pink-500", M: "bg-teal-600", SL: "bg-purple-600",
};

export function getMerchantColor(initial: string) {
  return merchantColors[initial] || "bg-db-primary/20 text-db-primary";
}

export function TransactionRow({ icon, title, subtitle, amount, amountCurrency, isPositive, status, onClick }: TransactionRowProps) {
  return (
    <div onClick={onClick} className="flex items-center justify-between gap-3 py-3 rounded-xl hover:bg-db-hover transition-colors -mx-1 px-3 cursor-default">
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-db-text-primary truncate">{title}</p>
          <p className="text-[11px] font-medium text-db-text-muted truncate">{subtitle}</p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className={cn("text-sm font-bold", isPositive ? "text-db-success" : "text-db-text-primary")}>
          {isPositive ? "+" : ""}{amount}
        </p>
        {status && <p className="text-[11px] font-semibold text-db-success">{status}</p>}
      </div>
    </div>
  );
}
