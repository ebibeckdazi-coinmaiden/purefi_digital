"use client"
import { Bell, AltArrowDown } from "@solar-icons/react-perf/BoldDuotone";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export function DashboardHeader() {
  const user = useQuery(api.user.user);

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-2 cursor-pointer group">
        <span className="text-sm font-semibold text-muted-foreground group-hover:text-forest-green transition-colors">Main Group</span>
        <AltArrowDown size={16} className="text-muted-foreground group-hover:text-forest-green transition-colors" />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors group">
          <Bell size={24} className="text-muted-foreground group-hover:text-forest-green" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted border border-border">
            {user?.image ? (
              <Image src={user.image} alt={user.firstName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-forest-green font-bold bg-primary/30 text-xs">
                {user?.firstName?.[0]}
              </div>
            )}
          </div>
          <AltArrowDown size={16} className="text-muted-foreground group-hover:text-forest-green transition-colors" />
        </div>
      </div>
    </header>
  );
}
