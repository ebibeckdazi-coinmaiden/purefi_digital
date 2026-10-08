import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { isOnboardedProfile } from "@/lib/onboarding";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { CustomerShell } from "@/app/components/feature/nav/CustomerShell";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const identity = await fetchAuthQuery(api.auth.getCurrentUser, {});
  console.log("[DashboardLayout] identity:", identity);
  if (!identity) {
    redirect("/auth/sign-in");
  }

  if (identity.emailVerified !== true) {
    redirect("/verify-email");
  }

  const user = await fetchAuthQuery(api.user.user, {});
  console.log("[DashboardLayout] user:", user);

  const isAdminIdentity = await fetchAuthQuery(api.admin.isAdmin, {});
  console.log("[DashboardLayout] isAdmin:", isAdminIdentity);

  if (
    !isAdminIdentity &&
    !isOnboardedProfile(user as Record<string, unknown> | null)
  ) {
    redirect("/onboarding");
  }

  return <CustomerShell>{children}</CustomerShell>;
}

