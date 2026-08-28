'use client';
import AuthLayout from '@/app/(auth)/components/AuthLayout';
import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';
import RiIcon from '@/app/components/ui/RiIcon';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/app/components/auth/AuthGuard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = useQuery(api.user.user);
  const isAdminIdentity = useQuery(api.admin.isAdmin);
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const emailVerified = session?.user?.emailVerified === true;
  const email = session?.user?.email ?? user?.email;

  useEffect(() => {
    if (isPending || user === undefined || isAdminIdentity === undefined) return;
    if (!emailVerified) return;

    const required = [
      "firstName",
      "lastName",
      "country",
      "city",
      "address",
      "zipCode",
      "occupation",
      "currency",
      "language",
    ] as const;
    const isOnboarded =
      !!user &&
      required.every((k) => {
        const value = user[k];
        return typeof value === "string" && value.trim().length > 0;
      });
    router.replace(isAdminIdentity ? "/admin" : isOnboarded ? "/home" : "/onboarding");
  }, [emailVerified, isPending, user, isAdminIdentity, router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendStatus('idle');

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: '/onboarding',
      });
      setResendStatus('success');
    } catch (error) {
      console.error(error);
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthGuard requireAuth>
      <AuthLayout
        title="Check your inbox"
        showBackToWebsite={false}
        subtitle={
          <span>
            We&apos;ve sent you a verification link to{' '}
            {email ? (
              <span className="text-white font-medium">{email}</span>
            ) : (
              'your email address'
            )}
            .
          </span>
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center space-y-6 py-8"
        >
          <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center border border-luxury-gold/20">
            <RiIcon className="ri-mail-send-line text-4xl text-luxury-gold" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm leading-relaxed">
              Click the link in the email we sent to verify your account.
              <br />
              If you don&apos;t see it, check your spam folder.
            </p>
          </div>

          <div className="w-full space-y-3">
            {resendStatus === 'error' && (
              <p className="text-red-500 text-xs text-center">
                Failed to resend email. Please try again.
              </p>
            )}

            {email && (
              <button
                className="w-full bg-luxury-gold hover:bg-soft-gold text-black font-bold rounded-xl py-3 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleResendEmail}
                disabled={isResending || resendStatus === 'success'}
              >
                {isResending ? (
                  <>
                    <RiIcon className="ri-loader-4-line animate-spin" />
                    Sending...
                  </>
                ) : resendStatus === 'success' ? (
                  <>
                    <RiIcon className="ri-check-line" />
                    Email Sent!
                  </>
                ) : (
                  'Resend Email'
                )}
              </button>
            )}

            {resendStatus === 'success' && (
              <p className="text-gray-400 text-xs text-center">
                A new verification link is on its way to your inbox.
              </p>
            )}
          </div>

          <Link
            href="/auth/sign-in"
            className="text-luxury-gold hover:text-soft-gold transition-colors text-sm font-medium"
          >
            Back to sign in
          </Link>
        </motion.div>
      </AuthLayout>
    </AuthGuard>
  );
}
