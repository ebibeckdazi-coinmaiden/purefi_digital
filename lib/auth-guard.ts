import { fetchAuthQuery } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";

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

interface AuthUser {
  subject: string;
  email?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

/**
 * Redirects unauthenticated users to /auth/sign-in.
 * Returns the auth identity if authenticated.
 */
export async function requireAuth(): Promise<AuthUser> {
  const identity = await fetchAuthQuery(api.auth.getCurrentUser, {});
  if (!identity) {
    redirect("/auth/sign-in");
  }
  return identity as unknown as AuthUser;
}

/**
 * Redirects users with unverified email to /verify-email.
 * Call after `requireAuth`.
 */
export function requireVerifiedEmail(identity: AuthUser): void {
  if (identity.emailVerified === false) {
    redirect("/verify-email");
  }
}

/**
 * Redirects users who haven't completed onboarding to /onboarding.
 * Fetches the user profile from Convex.
 */
export async function requireOnboarded(): Promise<void> {
  const user = await fetchAuthQuery(api.user.user, {});
  if (!isOnboarded(user as Record<string, unknown> | null)) {
    redirect("/onboarding");
  }
}

/**
 * Runs all three checks: authenticated → verified email → onboarded.
 * Short-circuits on the first failure.
 */
export async function requireAll(): Promise<AuthUser> {
  const identity = await requireAuth();
  requireVerifiedEmail(identity);
  await requireOnboarded();
  return identity;
}

/**
 * For public-only pages (sign-in, sign-up).
 * Redirects authenticated users to /home.
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const identity = await fetchAuthQuery(api.auth.getCurrentUser, {});
  if (identity) {
    redirect("/home");
  }
}
