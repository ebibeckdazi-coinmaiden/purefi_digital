import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function LandingLayout({ children }: PropsWithChildren) {
  const identity = await fetchAuthQuery(api.auth.getCurrentUser, {});
  console.log("[LandingLayout] identity:", identity);
  if (!identity) {
    return <>{children}</>;
  }

  if (identity.emailVerified !== true) {
    redirect("/verify-email");
  }
  const user = await fetchAuthQuery(api.user.user, {});
  console.log("[LandingLayout] user:", user);
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

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  redirect("/home");
}
