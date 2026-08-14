"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MobileBottomNav from "@/app/components/feature/MobileBottomNav";
import { MobileTopHeader } from "@/app/components/feature/MobileTopHeader";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

/** Keeps the separate admin surface intact while customer routes share one shell. */
export function CustomerShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminIdentity = useQuery(api.admin.isAdmin);

  useEffect(() => {
    if (isAdminIdentity === undefined) return;
    if (isAdminIdentity && !pathname.startsWith("/admin")) {
      router.replace("/admin");
    }
  }, [isAdminIdentity, pathname, router]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div data-customer-shell className="min-h-dvh max-w-full overflow-x-hidden text-db-text-primary">
      <Sidebar />
      <div className="flex min-h-dvh max-w-full overflow-x-hidden flex-col bg-white lg:pl-56">
        <ScrollArea className="flex-1 max-w-full">
        <div className="lg:hidden"><MobileTopHeader /></div>
        <div className="hidden lg:block"><DashboardHeader /></div>
          <main className="mx-auto lg:w-full w-screen max-w-full overflow-hidden px-5 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-8">
            {children}
          </main>
        </ScrollArea>
        <div className="lg:hidden">
          <MobileBottomNav />
        </div>
      </div>
    </div>
  );
}
