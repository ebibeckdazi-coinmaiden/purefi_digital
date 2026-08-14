"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Card, 
  Users, 
  CardRecieve, 
  GraphUp, 
  Settings, 
  Logout 
} from "@solar-icons/react-perf/BoldDuotone";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Card", href: "/cards", icon: Card },
  { name: "Recipients", href: "/transfers", icon: Users },
  { name: "Payments", href: "/convert", icon: CardRecieve },
  { name: "Analytics", href: "/analytics", icon: GraphUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useQuery(api.user.user);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border hidden lg:flex flex-col z-50">
      {/* Logo */}
      <div className="p-6">
        <Link href="/home" className="flex items-center gap-1">
           <span className="text-2xl font-black italic tracking-tighter text-forest-green">PureFi</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "bg-primary/20 text-forest-green" 
                  : "text-muted-foreground hover:bg-muted hover:text-forest-green"
              )}
            >
              <item.icon size={24} className={cn(isActive ? "text-forest-green" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
              {user.image ? (
                <Image src={user.image} alt={user.firstName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-forest-green font-bold bg-primary/30">
                  {user.firstName?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-forest-green truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
          <Logout size={24} />
          Log out
        </button>
      </div>
    </aside>
  );
}
