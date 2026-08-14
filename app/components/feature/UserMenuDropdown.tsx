"use client"
import { authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomAvatar } from '../ui/CustomAvatar';
import { useState } from 'react';
import RiIcon from '../ui/RiIcon';

interface UserMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export default function UserMenuDropdown({ isOpen, onClose, user }: UserMenuDropdownProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const menuItems = [
    { label: 'Profile', icon: 'ri-user-line', href: '/profile' },
    { label: 'Settings', icon: 'ri-settings-4-line', href: '/settings' },
    { label: 'Support', icon: 'ri-customer-service-2-line', href: '/support' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-x-4 top-24 mx-auto max-w-md bg-white rounded-3xl border border-db-border z-50 overflow-hidden max-h-[calc(100dvh-4rem)] overflow-y-auto lg:absolute lg:inset-auto lg:mx-0 lg:right-0 lg:mt-6 lg:w-80 lg:max-w-[calc(100vw-2rem)]"
        >
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <CustomAvatar
                src={user.avatar}
                name={user.name}
                size={48}
                className="rounded-full border-2 border-white ring-2 ring-db-primary/20"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-db-text-primary text-base truncate">{user.name}</h3>
                <p className="text-xs text-db-text-muted truncate mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="px-3 pb-2 space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-db-hover transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-db-hover flex items-center justify-center text-db-text-muted group-hover:text-db-text-primary group-hover:bg-db-primary-subtle transition-colors">
                  <RiIcon className={`${item.icon} text-lg`} />
                </div>
                <span className="text-sm font-medium text-db-text-primary">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mx-3 h-px bg-db-border" />

          <div className="px-3 pt-2 pb-3">
            <button
              onClick={async () => {
                if (isSigningOut) return;
                setIsSigningOut(true);
                onClose();
                try {
                  await authClient.signOut();
                } finally {
                  router.replace("/auth/sign-in");
                  router.refresh();
                  setIsSigningOut(false);
                }
              }}
              disabled={isSigningOut}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-db-danger hover:bg-red-50 transition-colors"
            >
              <RiIcon className="ri-logout-box-r-line" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
