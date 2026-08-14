"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import RiIcon from '@/app/components/ui/RiIcon';

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.getNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const getTypeIcon = (type: string, icon: string) => {
    if (icon) return icon;
    switch (type) {
      case 'payment': return 'ri-money-dollar-circle-line';
      case 'security': return 'ri-shield-alert-line';
      case 'social': return 'ri-heart-line';
      default: return 'ri-notification-3-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'text-db-success bg-emerald-50 border-emerald-200';
      case 'security': return 'text-red-600 bg-red-50 border-red-200';
      case 'social': return 'text-pink-600 bg-pink-50 border-pink-200';
      default: return 'text-db-primary bg-db-primary-subtle border-db-primary';
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-db-text-primary mb-2">Notifications</h1>
            <p className="text-db-text-secondary">Stay updated with your account activity.</p>
          </div>
          {notifications && notifications.length > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="px-4 py-2.5 rounded-lg bg-db-hover hover:bg-db-hover border border-db-border text-sm font-medium text-db-primary transition-colors flex items-center gap-2"
            >
              <RiIcon className="ri-check-double-line" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications === undefined ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-db-border p-5 flex gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-db-hover border border-db-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="h-4 w-52 max-w-full bg-db-hover rounded" />
                      <div className="h-5 w-20 bg-db-hover rounded-lg shrink-0" />
                    </div>
                    <div className="h-3 w-full bg-db-hover rounded mb-2" />
                    <div className="h-3 w-2/3 bg-db-hover rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-db-border p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-db-hover flex items-center justify-center mx-auto mb-4">
                <RiIcon className="ri-notification-off-line text-2xl text-db-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-db-text-primary mb-1">No notifications</h3>
              <p className="text-db-text-secondary text-sm">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notification.read && markAsRead({ id: notification._id })}
                className={`relative group bg-white hover:bg-db-hover rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  notification.read 
                    ? 'border-db-border opacity-80' 
                    : 'border-db-primary shadow-[0_4px_12px_rgba(159,232,112,0.3)]'
                }`}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-db-primary" />
                )}
                
                <div className="p-5 flex gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getTypeColor(notification.type)}`}>
                    <RiIcon className={`${getTypeIcon(notification.type, notification.icon)} text-xl`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`font-bold text-lg truncate ${notification.read ? 'text-db-text-secondary' : 'text-db-text-primary'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs font-medium text-db-text-muted whitespace-nowrap bg-db-hover px-2 py-1 rounded-lg">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-db-text-secondary text-sm leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
