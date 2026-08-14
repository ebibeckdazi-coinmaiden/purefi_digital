"use client"
import { api } from "@/convex/_generated/api";
import { Bell, AltArrowDown } from "@solar-icons/react-perf/BoldDuotone";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import NotificationDropdown from "@/app/components/feature/NotificationDropdown";
import UserMenuDropdown from "@/app/components/feature/UserMenuDropdown";

export function DashboardHeader() {
  const user = useQuery(api.user.user);
  const notifications = useQuery(api.notifications.getNotifications);
  const markAllRead = useMutation(api.notifications.markAllAsRead);
  const markRead = useMutation(api.notifications.markAsRead);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notificationItems = (notifications ?? []).map((notification) => ({
    id: notification._id,
    type: notification.type === "alert" ? "security" as const : notification.type === "success" ? "payment" as const : "system" as const,
    title: notification.title,
    message: notification.message,
    time: notification.time,
    unread: !notification.read,
  }));
  const unreadCount = notificationItems.filter((notification) => notification.unread).length;
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email?.split("@")[0] || "Your account";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end px-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
            aria-expanded={isNotificationsOpen}
            className="relative flex size-11 items-center justify-center rounded-full text-db-text-secondary transition-colors hover:bg-db-hover hover:text-db-text-primary"
          >
          <Bell size={22} className="text-db-text-muted" />
            {unreadCount > 0 && <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-db-success" />}
          </button>
          <NotificationDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notificationItems}
            onMarkAllRead={() => void markAllRead({})}
            onMarkRead={(id) => void markRead({ id })}
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            aria-label="Open account menu"
            aria-expanded={isUserMenuOpen}
            className="group flex min-h-11 items-center gap-2 rounded-full p-1 transition-colors hover:bg-db-hover sm:pr-2"
          >
          <div className="relative size-6 rounded-full overflow-hidden bg-db-primary">
            {user?.image ? (
              <Image src={user.image} alt={user?.firstName as string} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-grren-950 font-bold text-xs">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
            <span className="hidden max-w-28 truncate text-sm font-semibold text-db-text-primary sm:block">{displayName}</span>
            <AltArrowDown size={14} className="text-green-950 transition-colors group-hover:text-db-text-secondary" />
          </button>
          <UserMenuDropdown
            isOpen={isUserMenuOpen}
            onClose={() => setIsUserMenuOpen(false)}
            user={{ name: displayName, email: user?.email ?? "", avatar: user?.image ?? ""}}
          />
        </div>
      </div>
    </header>
  );
}
