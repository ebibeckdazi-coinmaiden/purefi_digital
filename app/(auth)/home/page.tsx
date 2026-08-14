"use client";
import { BalanceSection } from '@/app/components/feature/dashboard/BalanceSection';
import { CurrenciesGrid } from '@/app/components/feature/dashboard/CurrenciesGrid';
import { TasksList } from '@/app/components/feature/dashboard/TasksList';
import { SpendAnalytics } from '@/app/components/feature/dashboard/SpendAnalytics';
import { TransactionsList } from '@/app/components/feature/dashboard/TransactionsList';
import { RecentRecipients } from '@/app/components/feature/dashboard/RecentRecipients';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={itemVariants}>
        <BalanceSection />
      </motion.section>

      <motion.section variants={itemVariants}>
        <CurrenciesGrid />
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        <div className="lg:col-span-3">
          <TasksList />
        </div>
        <div className="hidden lg:block lg:col-span-2">
          <SpendAnalytics />
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3"><TransactionsList /></div>
        <div className="hidden lg:block lg:col-span-2"><RecentRecipients /></div>
      </motion.section>
    </motion.div>
  );
}
