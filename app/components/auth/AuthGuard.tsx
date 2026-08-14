"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect, type ReactNode } from "react";

const ONBOARDING_FIELDS = [
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

function isOnboarded(user: Record<string, unknown> | null): boolean {
  return (
    !!user &&
    ONBOARDING_FIELDS.every((k) => {
      const value = user[k];
      return typeof value === "string" && value.trim().length > 0;
    })
  );
}

interface AuthGuardProps {
  children: ReactNode;
  /** Require the user to be authenticated (default: true) */
  requireAuth?: boolean;
  /** Require the user's email to be verified */
  requireVerified?: boolean;
  /** Require the user to have completed onboarding */
  requireOnboarded?: boolean;
  /** Show this while checking auth state */
  loading?: ReactNode;
  /** Path to redirect unauthenticated users (default: /auth/sign-in) */
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth: needAuth = true,
  requireVerified = false,
  requireOnboarded: needOnboarded = false,
  loading,
  redirectTo = "/auth/sign-in",
}: AuthGuardProps) {
  const identity = useQuery(api.auth.getCurrentUser);
  const user = useQuery(api.user.user);
  const router = useRouter();

  const isLoading = identity === undefined || (needOnboarded && user === undefined);

  useEffect(() => {
    if (isLoading) return;

    if (needAuth && !identity) {
      router.replace(redirectTo);
      return;
    }

    if (requireVerified && identity?.emailVerified === false) {
      router.replace("/verify-email");
      return;
    }

    if (needOnboarded && identity) {
      const profile = user as Record<string, unknown> | null;
      if (!isOnboarded(profile)) {
        router.replace("/onboarding");
        return;
      }
    }
  }, [identity, user, isLoading, needAuth, requireVerified, needOnboarded, redirectTo, router]);

  if (isLoading || (needAuth && !identity)) {
    return loading ?? null;
  }

  return <>{children}</>;
}
