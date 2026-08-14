import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
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

  if (!isAdminIdentity && !isOnboarded) {
    redirect("/onboarding");
  }

  return <CustomerShell>{children}</CustomerShell>;
}

