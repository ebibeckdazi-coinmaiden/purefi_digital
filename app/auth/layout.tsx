import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const identity = await fetchAuthQuery(api.auth.getCurrentUser, {});
  console.log("[AuthLayout] identity:", identity);
  // Only verified users are pushed onward to onboarding / home.
  // Unverified users can freely visit sign-in / sign-up (e.g. to
  // switch accounts from /verify-email) without redirect loops.
  if (identity && identity.emailVerified === true) {
    const user = await fetchAuthQuery(api.user.user, {});
    console.log("[AuthLayout] user:", user);
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

  return (
    <div className="dark h-dvh w-full bg-white overflow-hidden flex p-4 lg:p-6 gap-6 font-sans">
      {/* Left Side Graphic */}
      <div className="hidden lg:flex w-1/2 h-full relative rounded-4xl bg-[#080808] overflow-hidden border border-border flex-col justify-between p-12 shadow-2xl text-white">
        {/* Branding & Copy */}
        <div className="relative z-20 mt-8">
          <h1 className="text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-4 max-w-md">
            The next generation
            <br />
            of digital
            <br />
            banking.
          </h1>
          <p className="text-white/60 text-body max-w-sm">
            Experience seamless financial management, premium aesthetics, and
            powerful tools with PureFi Bank.
          </p>
        </div>

        {/* Abstract Ambient Gradients */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/20 rounded-full blur-[120px] opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-150 h-150 bg-primary/30 rounded-full blur-[120px] opacity-60 pointer-events-none" />

        {/* Vertical Glowing Streaks */}
        <div className="absolute bottom-0 right-0 h-3/5 flex justify-end items-end opacity-90 z-10 gap-4 pr-12 pointer-events-none">
          <div className="w-16 h-[85%] bg-linear-to-t from-primary via-primary/40 to-transparent blur-3xl transform translate-y-1/4" />
          <div className="w-24 h-full bg-linear-to-t from-primary via-primary/50 to-transparent blur-3xl transform translate-y-1/5" />
          <div className="w-16 h-[75%] bg-linear-to-t from-primary via-primary/30 to-transparent blur-3xl transform translate-y-1/4" />
        </div>
      </div>

      {/* Right Side Form Container */}
      <ScrollArea className="flex-1 h-full relative z-10">
        <div className="flex items-center justify-center min-h-full">
          <div className="w-full max-w-100 py-4">{children}</div>
        </div>
      </ScrollArea>
    </div>
  );
}
