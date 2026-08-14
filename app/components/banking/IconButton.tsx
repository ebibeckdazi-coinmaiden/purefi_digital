import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function IconButton({ children, onClick, label, className, disabled, size = "md" }: IconButtonProps) {
  const sizes = { sm: "size-9 text-sm", md: "size-11 text-base", lg: "size-12 text-lg" };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors hover:bg-db-hover text-db-text-secondary hover:text-db-text-primary disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}
