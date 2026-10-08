"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "@solar-icons/react-perf/Broken";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RiIcon from "@/app/components/ui/RiIcon";
import GoogleIcon from "@/app/components/icons/GoogleIcon";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation, useConvex } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";

const UserSignInSchema = type({
  email: "string.email",
  password: "string >= 1",
});

export default function SignInPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ensureLinkedUser = useMutation(api.user.ensureLinkedUser);
  const convexClient = useConvex();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (isSubmitting || isGoogleLoading) return;
      setIsSubmitting(true);
      setError(null);

      try {
        await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
          },
          {
            onSuccess: async () => {
              await ensureLinkedUser();
              let destination = "/home";
              try {
                const admin = await convexClient.query(api.admin.isAdmin, {});
                if (admin) destination = "/admin";
              } catch {
                /* fall back to default destination */
              }
              router.push(destination);
            },
            onError: (ctx) => {
              setError(ctx.error.message || "Failed to sign in");
              setIsSubmitting(false);
            },
          },
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        setIsSubmitting(false);
      }
    },
    validators: {
      onChange: ({ value }) => {
        const result = UserSignInSchema(value);
        const errors =
          result instanceof type.errors
            ? result.summary
                .split("\n")
                .map((s) => s.replace(/^◦\s*/, "").trim())
            : [];
        return result instanceof type.errors ? errors : undefined;
      },
    },
  });

  const signInWithGoogle = async () => {
    if (isSubmitting || isGoogleLoading) return;
    setIsGoogleLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google",
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-h2 font-bold text-secondary tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-small text-secondary/60">
          Enter your credentials to access your account.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-small rounded-lg border border-destructive/20 text-center">
          {error}
        </div>
      )}

      <div className="w-full">
        <button
          onClick={() => signInWithGoogle()}
          type="button"
          disabled={isSubmitting || isGoogleLoading}
          aria-busy={isGoogleLoading}
          className="w-full relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/60 text-secondary text-small font-medium hover:bg-surface hover:border-primary active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isGoogleLoading ? (
              <>
                <RiIcon className="ri-loader-4-line animate-spin text-lg shrink-0" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5 shrink-0 block" />
                <span>Google</span>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1">
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1">
                <input
                  type="email"
                  value={field.state.value}
                  disabled={isSubmitting || isGoogleLoading}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="email"
                  className="w-full pl-4 pr-12 py-2.5 bg-input border border-primary/40 hover:border-primary/70 rounded-xl text-body text-secondary focus:outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-secondary/20"
                  required
                />
                <p className="mt-1 text-xs text-red-500">
                  {(field.state.value.length === 0 &&
                    "Please enter an email address") ||
                    (!field.state.value.match(
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    ) &&
                      "Please enter a valid email address")}
                </p>
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-1 relative">
              <input
                type={isVisible ? "text" : "password"}
                value={field.state.value}
                disabled={isSubmitting || isGoogleLoading}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="password"
                className="w-full pl-4 pr-12 py-2.5 bg-input border border-primary/40 hover:border-primary/70 rounded-xl text-body text-secondary focus:outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-secondary/20"
                required
              />
              <span
                className="absolute inset-y-0 bottom-3 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => toggleVisibility()}
              >
                {isVisible ? (
                  <Eye className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeClosed className="w-5 h-5 text-gray-400" />
                )}
              </span>
              <div className="flex justify-end">
                <Link
                  href="/reset-password"
                  className="text-xs text-gray-400 hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.values]}>
          {() => (
            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(159,232,112,0.3)]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <RiIcon className="ri-loader-4-line animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          )}
        </form.Subscribe>

        {error && (
          <p className="mt-1 text-xs text-red-500 text-center">
            {error}
          </p>
        )}
      </form>

      <p className="text-center text-small text-secondary/60">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="text-secondary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
