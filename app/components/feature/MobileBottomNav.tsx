'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { mobileNavigation } from './nav/customer-navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div data-mobile-bottom-nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-db-border bg-white pb-safe safe-area-bottom lg:hidden">
      <div className="flex items-center justify-between px-1 py-1">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 min-w-0 flex-col items-center justify-center py-1 px-0.5 group"
            >
              <div className={`relative p-1 rounded-xl transition-all duration-300 ${
                isActive ? 'text-db-text-primary' : 'text-db-text-muted'
              }`}>
                {isActive && (
                   <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-db-primary-subtle rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={22} color="currentColor" className="relative z-10" />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 transition-colors truncate max-w-full text-center ${
                isActive ? 'text-db-text-primary' : 'text-db-text-muted'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
