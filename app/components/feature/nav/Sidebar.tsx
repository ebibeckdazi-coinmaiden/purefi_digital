"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AltArrowDown, Logout, Widget } from "@solar-icons/react-perf/BoldDuotone";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { moreNavigation, primaryNavigation } from "./customer-navigation";

export function Sidebar() {
  const pathname = usePathname();
  const user = useQuery(api.user.user);
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace("/auth/sign-in");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col border-r border-db-border bg-db-bg/70 lg:flex">
      <div className="p-6 pb-9">
        <Link href="/home" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tight text-db-text-primary">PureFi</span>
        </Link>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 space-y-1 px-3">
        {primaryNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-semibold transition-all duration-150",
                isActive
                  ? "bg-db-primary-subtle text-db-text-primary"
                  : "text-db-text-secondary hover:bg-db-hover hover:text-db-text-primary"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-db-text-primary" : "text-db-text-muted")} />
              {item.name}
            </Link>
          );
        })}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setIsMoreOpen((open) => !open)}
            aria-expanded={isMoreOpen}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-db-text-secondary transition-colors hover:bg-db-hover hover:text-db-text-primary"
          >
            <Widget size={22} className="text-db-text-muted" />
            <span className="flex-1">More</span>
            <AltArrowDown size={16} className={cn("transition-transform", isMoreOpen && "rotate-180")} />
          </button>
          {isMoreOpen && (
            <div className="mt-1 space-y-1 border-l border-db-border pl-3">
              {moreNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                      isActive ? "bg-db-primary-subtle text-db-text-primary" : "text-db-text-secondary hover:bg-db-hover",
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-db-border">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-db-primary-subtle border border-db-border shrink-0">
              {user.image ? (
                <Image src={user.image} alt={user.firstName as string} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-db-primary font-bold text-sm">
                  {user.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-db-text-primary truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[11px] text-db-text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={signOut}
          disabled={isSigningOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-db-text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Logout size={22} />
          {isSigningOut ? "Signing out..." : "Log out"}
        </button>
      </div>
    </aside>
  );
}
