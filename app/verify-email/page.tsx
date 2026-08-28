'use client';
import AuthLayout from '@/app/(auth)/components/AuthLayout';
import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';
import RiIcon from '@/app/components/ui/RiIcon';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/app/components/auth/AuthGuard';


export default function VerifyEmailPage() {
  const authUser = useQuery(api.auth.getCurrentUser)
  const user = useQuery(api.user.user)
  const isAdminIdentity = useQuery(api.admin.isAdmin)
  const router = useRouter()
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (authUser === undefined || user === undefined || isAdminIdentity === undefined) return;
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
    if (authUser?.emailVerified === true) {
      router.replace(isAdminIdentity ? "/admin" : isOnboarded ? "/home" : "/onboarding");
    }
  }, [authUser, user, isAdminIdentity, router]);

  const handleResendEmail = async () => {
    if (!authUser?.email) return;

    setIsResending(true);
    setResendStatus('idle');

    try {
      await authClient.sendVerificationEmail({
        email: authUser.email,
        callbackURL: 'https://www.purefidigital.com/onboarding'
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
            We&apos;ve sent you a verification link to {user?.email ? <span className="text-white font-medium">{user?.email}</span> : 'your email address'}.
          </span>
        }
      >
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
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
          {user?.email && (
            <button
              className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-medium rounded-xl py-3 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResendEmail}
              disabled={isResending || resendStatus === 'success'}
            >
              {isResending ? 'Sending...' : resendStatus === 'success' ? 'Email Sent!' : 'Resend Email'}
            </button>
          )}

          {resendStatus === 'error' && (
            <p className="text-red-500 text-xs text-center">Failed to resend email. Please try again.</p>
          )}
        </div>
      </div>
    </AuthLayout>
    </AuthGuard>
  );
}
