"use client";

import { motion } from "framer-motion";
import TasksList from "./TasksList";
import SpendingChart from "./SpendingChart";
import CategorySpending from "./CategorySpending";
import SavingsGoals from "./SavingsGoals";
import CreditCards from "./CreditCards";
import FinancialInsights from "./FinancialInsights";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function SpendAnalytics() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 lg:grid-cols-5"
    >
      <motion.div variants={item} className="flex flex-col gap-4 lg:col-span-3">
        <TasksList />
        <SpendingChart />
      </motion.div>
      <motion.div variants={item} className="flex flex-col gap-4 lg:col-span-2">
        <CategorySpending />
        <SavingsGoals />
        <CreditCards />
        <FinancialInsights />
      </motion.div>
    </motion.div>
  );
}
