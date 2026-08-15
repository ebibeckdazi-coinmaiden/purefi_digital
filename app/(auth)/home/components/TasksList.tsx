"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Card from "@/app/components/base/Card";
import { SectionHeader, LoadingCard } from "@/app/components/feature/dashboard/primitives";
import { TaskRow } from "@/app/components/banking";
import RiIcon from "@/app/components/ui/RiIcon";

export default function TasksList() {
  const user = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);

  const tasks = useMemo(() => {
    const hasIdentity = !!user;
    // const hasAccounts = (accounts ?? []).length > 0;
    const hasLocal = (accounts ?? []).some(
      (a) => a.type === "local" || a.kind === "local",
    );

    return [
      {
        title: "Verify your identity",
        subtitle: "Complete KYC to unlock all features",
        badge: hasIdentity ? "Done" : "Action needed",
        badgeTone: hasIdentity ? "success" : "warning",
        action: hasIdentity ? null : { label: "Verify", href: "/settings/verify" },
      },
      {
        title: "Add a recipient",
        subtitle: "Add a beneficiary to send money",
        badge: "Action needed",
        badgeTone: "warning",
        action: { label: "Add", href: "/transfers" },
      },
      {
        title: "Complete your profile",
        subtitle: "Add your details for a better experience",
        badge: hasIdentity ? "Done" : "Action needed",
        badgeTone: hasIdentity ? "success" : "warning",
        action: hasIdentity ? null : { label: "Complete", href: "/settings" },
      },
      {
        title: "Fund your account",
        subtitle: "Add money to start spending",
        badge: hasLocal ? "Done" : "Action needed",
        badgeTone: hasLocal ? "success" : "warning",
        action: hasLocal ? null : { label: "Add", href: "/deposit" },
      },
    ];
  }, [user, accounts]);

  return (
    <Card className="p-3 md:p-5">
      <SectionHeader title="Tasks" />
      <div className="mt-4 space-y-3">
        {accounts === undefined || user === undefined ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          tasks.map((task, i) => (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TaskRow
                title={task.title}
                subtitle={task.subtitle}
                badge={task.badge}
                badgeTone={task.badgeTone as "success" | "neutral" | "warning" | "danger" | undefined }
                action={
                  task.action ? (
                    <a
                      href={task.action.href}
                      className="inline-flex items-center gap-1 rounded-full bg-db-primary px-4 py-2.5 text-xs font-bold text-db-text-primary transition-all hover:bg-db-primary-hover active:scale-95"
                    >
                      {task.action.label}
                      <RiIcon className="ri-arrow-right-s-line text-sm" />
                    </a>
                  ) : null
                }
              />
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
