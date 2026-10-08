"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isOnboardedProfile } from "@/lib/onboarding";
import RiIcon from "@/app/components/ui/RiIcon";

/**
 * Post-OAuth decision point.
 * Google sign-in lands here, then we route:
 * existing complete account -> /home, new/incomplete -> /onboarding.
 * (Server AuthLayout also guards this route, this handles the client race.)
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const identity = useQuery(api.auth.getCurrentUser);
  const user = useQuery(api.user.user);
  const isAdmin = useQuery(api.admin.isAdmin);

  useEffect(() => {
    if (identity === undefined || user === undefined || isAdmin === undefined)
      return;
    if (!identity) {
      router.replace("/auth/sign-in");
      return;
    }
    if (identity.emailVerified === false) {
      router.replace("/verify-email");
      return;
    }
    if (isAdmin) {
      router.replace("/admin");
      return;
    }
    router.replace(
      isOnboardedProfile(user as Record<string, unknown> | null)
        ? "/home"
        : "/onboarding",
    );
  }, [identity, user, isAdmin, router]);

  return (
    <main className="w-full flex flex-col items-center justify-center gap-3 py-10 text-foreground">
      <RiIcon className="ri-loader-4-line animate-spin text-2xl" />
      <p className="text-small text-muted-foreground">Signing you in...</p>
    </main>
  );
}
