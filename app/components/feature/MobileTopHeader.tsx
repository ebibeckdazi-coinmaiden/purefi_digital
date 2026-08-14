"use client";
import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Bell } from "@solar-icons/react-perf/BoldDuotone";
import { api } from "@/convex/_generated/api";
import NotificationDropdown from "@/app/components/feature/NotificationDropdown";
import UserMenuDropdown from "@/app/components/feature/UserMenuDropdown";

export function MobileTopHeader() {
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
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Main Group";

  return (
    <header className="flex h-16 items-center justify-between px-5 pr-10">
      <button
        type="button"
        onClick={() => setIsUserMenuOpen((open) => !open)}
        aria-label="Open account menu"
        aria-expanded={isUserMenuOpen}
        className="flex max-w-[50vw] items-center gap-1.5 rounded-full px-3 py-2 transition-colors bg-db-primary"
      >
        {user?.image ? (
          <Image src={user.image} alt={displayName} fill className="object-cover" />
        ) : (
          <span className="text-xs font-bold text-db-text-primary">{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</span>
        )}
      </button>
      <UserMenuDropdown
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        user={{ name: displayName, email: user?.email ?? "", avatar: user?.image ?? "" }}
      />


      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsNotificationsOpen((open) => !open)}
          aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
          aria-expanded={isNotificationsOpen}
          className="relative flex size-9 items-center justify-center rounded-full text-db-text-secondary transition-colors hover:bg-db-hover hover:text-db-text-primary"
        >
          <Bell size={20} className="text-db-text-muted" />
          {unreadCount > 0 && <span className="absolute right-1 top-1 size-2 rounded-full border-2 border-white bg-db-success" />}
        </button>
        <NotificationDropdown
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notificationItems}
          onMarkAllRead={() => void markAllRead({})}
          onMarkRead={(id) => void markRead({ id })}
        />
      </div>
    </header>
  );
}
