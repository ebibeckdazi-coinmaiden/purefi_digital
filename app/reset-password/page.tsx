'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import AuthLayout from '@/app/(auth)/components/AuthLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeClosed } from "@solar-icons/react-perf/Broken";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { CheckCircle } from '@solar-icons/react-perf/Bold';
import RiIcon from '@/app/components/ui/RiIcon';

const ResetPasswordSchema = type({
  password: 'string',
  confirmPassword: 'string',
});

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);
      
      if (value.password !== value.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!token) {
        setError("Invalid or missing reset token");
        return;
      }

      setIsLoading(true);
      await authClient.resetPassword(
        {
          newPassword: value.password,
          token: token, 
        },
        {
          onSuccess: () => {
            setSuccess(true);
            setIsLoading(false);
            setTimeout(() => {
              router.push('/auth/sign-in');
            }, 2000);
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setIsLoading(false);
          }
        }
      );
    },
    validators: {
      onChange: ({ value }) => {
        const result = ResetPasswordSchema(value);
        const Errors = result instanceof type.errors
          ? result.summary.split("\n")
            .map((s) => s.replace(/^◦\s*/, "").trim())
          : [];
        return result instanceof type.errors ? Errors : undefined;
      },
    },
  });

  if (success) {
    return (
      <AuthLayout
        title="Password Reset"
        subtitle="Your password has been successfully updated."
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <p className="text-white text-lg font-medium">Password updated!</p>
          <p className="text-gray-400 text-sm">Redirecting to sign in...</p>
          <Link 
            href="/auth/signin"
            className="text-luxury-gold hover:text-soft-gold transition-colors font-medium mt-4"
          >
            Click here if you are not redirected
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form.Field
          name="password"
          children={(field) => (
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-400 ml-1">New Password</label>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Enter new password'
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all pr-10"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 bottom-3 pr-3 flex items-center cursor-pointer"
                  onClick={() => toggleVisibility()}
                >
                  {isVisible ? (
                    <Eye className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeClosed className="w-5 h-5 text-gray-400" />
                  )}
                </span>
              </div>
            </div>
          )}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <div className="space-y-1 relative">
              <label className="text-xs text-gray-400 ml-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={isConfirmVisible ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Confirm new password'
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all pr-10"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => toggleConfirmVisibility()}
                >
                  {isConfirmVisible ? (
                    <Eye className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeClosed className="w-5 h-5 text-gray-400" />
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-red-500">
                 {field.state.value && field.state.value !== form.getFieldValue("password") ? "Passwords do not match" : ""}
              </p>
            </div>
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-luxury-gold hover:bg-soft-gold text-black font-bold rounded-xl py-3 mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RiIcon className="ri-loader-4-line animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-rich-black flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
