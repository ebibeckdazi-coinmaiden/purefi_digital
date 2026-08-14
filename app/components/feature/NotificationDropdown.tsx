"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Id } from '../../../convex/_generated/dataModel';
import { 
  Bell, 
  BellOff, 
  Dollar, 
  ShieldWarning, 
  Heart, 
  ArrowRight,
  ArrowRightUp,
  ArrowRightDown,
  InfoCircle
} from '@solar-icons/react-perf/Linear';
import Image from 'next/image';

interface Notification {
  id: Id<'notifications'>;
  type: 'payment' | 'security' | 'system' | 'social';
  user?: {
    name: string;
    avatar: string;
  };
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead?: (id: Id<'notifications'>) => void;
}

const highlightAmount = (text: string) => {
  const parts = text.split(/([+\-]?\$[\d,]+(?:\.\d{2})?)/g);
  return parts.map((part, i) => {
    if (part.match(/^[+\-]?\$[\d,]+(?:\.\d{2})?$/)) {
      const isPositive = part.startsWith('+');
      const isMinus = part.startsWith('-');
      let className = "font-bold text-db-text-primary";
      if (isPositive) className = "font-bold text-db-success";
      if (isMinus) className = "font-bold text-db-danger";
      return <span key={i} className={className}>{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

const getBadges = (notification: Notification) => {
  const badges = [];
  if (notification.type === 'payment') {
    if (notification.message.includes('+')) {
      badges.push({ label: 'Income', color: 'bg-emerald-50 text-emerald-700' });
    } else {
      badges.push({ label: 'Paid', color: 'bg-red-50 text-red-700' });
    }
    if (notification.title.includes('Subscription') || notification.message.includes('Plan')) {
       badges.push({ label: 'Membership', color: 'bg-db-hover text-db-text-secondary' });
    } else {
       badges.push({ label: 'General', color: 'bg-db-hover text-db-text-secondary' });
    }
  } else if (notification.type === 'security') {
    badges.push({ label: 'Alert', color: 'bg-red-50 text-red-700' });
    badges.push({ label: 'Security', color: 'bg-db-hover text-db-text-secondary' });
  } else if (notification.type === 'system') {
    badges.push({ label: 'System', color: 'bg-blue-50 text-blue-700' });
  } else if (notification.type === 'social') {
    badges.push({ label: 'Social', color: 'bg-purple-50 text-purple-700' });
  }
  return badges;
};

export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkRead,
}: NotificationDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-x-4 top-24 mx-auto w-auto max-w-md md:absolute md:-right-50 md:top-0 md:mt-16 md:w-100 md:inset-auto bg-white rounded-3xl border border-db-border z-50 overflow-hidden font-sans"
        >
          <div className="px-6 py-5 border-b border-db-border flex items-center justify-between">
            <h3 className="font-bold text-db-text-primary text-lg">Notification</h3>
            <button 
              onClick={onMarkAllRead}
              className="text-sm font-medium text-db-primary-foreground hover:text-db-text-primary transition-colors"
            >
              Mark as read
            </button>
          </div>

          <ScrollArea className="h-90 md:h-112.5">
            <div className="py-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-75 text-db-text-muted">
                  <div className="w-16 h-16 rounded-full bg-db-hover flex items-center justify-center mb-4">
                    <BellOff className="text-2xl opacity-50" />
                  </div>
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const badges = getBadges(notification);
                  const isIncome = notification.message.includes('+') || notification.message.toLowerCase().includes('received');
                  const isExpense = notification.message.includes('-') || notification.message.toLowerCase().includes('spent') || notification.message.toLowerCase().includes('purchased');

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative px-6 py-4 hover:bg-db-hover cursor-pointer transition-all group border-b border-db-border last:border-0`}
                      onClick={() => {
                        if (!notification.unread) return;
                        if (!onMarkRead) return;
                        onMarkRead(notification.id);
                      }}
                    >
                      <div className="flex gap-4 items-start">
                        <div className="shrink-0 relative">
                          <div className="w-12 h-12 rounded-full bg-db-hover overflow-hidden border border-db-border group-hover:border-db-primary/30 transition-colors">
                            {notification.user?.avatar ? (
                              <Image src={notification.user.avatar} width={100} height={100} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                 {notification.type === 'payment' && <Dollar className="text-xl text-db-success" />}
                                 {notification.type === 'security' && <ShieldWarning className="text-xl text-db-danger" />}
                                 {notification.type === 'system' && <InfoCircle className="text-xl text-blue-600" />}
                                 {notification.type === 'social' && <Heart className="text-xl text-purple-600" />}
                              </div>
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                            isIncome ? 'bg-emerald-500' : 
                            isExpense ? 'bg-red-500' : 
                            notification.type === 'security' ? 'bg-orange-500' :
                            'bg-gray-400'
                          }`}>
                            {isIncome && <ArrowRightDown className="text-xs text-white" />}
                            {isExpense && <ArrowRightUp className="text-xs text-white" />}
                            {notification.type === 'security' && <ShieldWarning className="text-xs text-white" />}
                            {!isIncome && !isExpense && notification.type !== 'security' && <Bell className="text-xs text-white" />}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="text-sm font-bold text-db-text-primary group-hover:text-db-text-primary transition-colors truncate pr-2">
                              {notification.user?.name || notification.title}
                            </p>
                            <span className="text-[10px] text-db-text-muted font-medium whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-db-text-secondary leading-relaxed line-clamp-2 mb-2">
                            {highlightAmount(notification.message)}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {badges.map((badge, i) => (
                              <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.color}`}>
                                {badge.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        {notification.unread && (
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-db-primary" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
            <ScrollBar className='hidden' />
          </ScrollArea>

          <div className="p-4 border-t border-db-border">
            <Link
              href="/notifications"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-db-hover hover:bg-db-primary-subtle border border-db-border text-sm font-medium text-db-text-secondary hover:text-db-text-primary transition-all group"
            >
              See all activity
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
