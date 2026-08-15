"use client"
import { useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '@/app/components/base/Card';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { currencies } from '@/app/data/currencies';
import RiIcon from '@/app/components/ui/RiIcon';

export default function CategorySpending() {
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);

  const displayCurrency =
    accounts?.find((a) => a.type === 'local' || a.kind === 'local')?.currency || 'USD';
  const currencySymbol = currencies.find((c) => c.code === displayCurrency)?.symbol || '$';

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({}).catch(() => {});
  }, [ensureUserAccounts, identity]);

  const { localAccountId, internationalAccountId } = useMemo(() => {
    const localAccount = accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? null;
    const internationalAccount =
      accounts?.find((acc) => acc.type === "international" || acc.kind === "international") ?? null;

    return {
      localAccountId: localAccount && "_id" in localAccount ? (localAccount._id ?? null) : null,
      internationalAccountId:
        internationalAccount && "_id" in internationalAccount ? (internationalAccount._id ?? null) : null,
    };
  }, [accounts]);

  const localTransactions = useQuery(
    api.transactions.getTransactionsByAccount,
    localAccountId ? { bankAccountId: localAccountId } : "skip",
  );

  const internationalTransactions = useQuery(
    api.transactions.getTransactionsByAccount,
    internationalAccountId ? { bankAccountId: internationalAccountId } : "skip",
  );

  const { totalSpent, totalBudget, percentage } = useMemo(() => {
    const combined = [...(localTransactions ?? []), ...(internationalTransactions ?? [])];
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    let totalSpent = 0;
    for (const tx of combined) {
      if (tx.amount >= 0) continue;
      const parsed = Date.parse(tx.date);
      if (!Number.isFinite(parsed)) continue;
      const d = new Date(parsed);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key !== currentMonthKey) continue;
      totalSpent += Math.abs(tx.amount);
    }

    const totalBudget = (accounts ?? []).reduce(
      (sum, acc) => sum + ("monthlyExpenses" in acc ? (acc.monthlyExpenses ?? 0) : 0),
      0,
    );
    const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return { totalSpent, totalBudget, percentage };
  }, [accounts, internationalTransactions, localTransactions]);

  const data = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: Math.max((totalBudget || totalSpent) - totalSpent, 0) }
  ];

  return (
    <Card className="p-3 md:p-6 h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-db-text-primary">Expenses</h3>
        <button className="text-db-text-muted hover:text-db-text-primary">
          <RiIcon className="ri-more-fill" />
        </button>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="spent" fill="var(--db-primary)" />
              <Cell key="remaining" fill="rgba(0,0,0,0.05)" />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--db-bg)',
                border: '1px solid var(--db-border)',
                borderRadius: '12px',
                color: 'var(--db-text-primary)'
              }}
              itemStyle={{ color: 'var(--db-primary)' }}
              formatter={(value) => {
                const raw = Array.isArray(value) ? value[0] : value;
                const num = typeof raw === 'number' ? raw : Number(raw ?? 0);
                return `${currencySymbol}${num.toLocaleString()}`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
          <span className="text-3xl font-bold text-db-text-primary">{percentage.toFixed(1)}%</span>
          <span className="text-xs text-db-text-muted">Normal Level</span>
        </div>
      </div>

      <div className="text-center mt-[-20px]">
        <div className="inline-block px-4 py-2 rounded-xl bg-db-hover border border-db-border">
          <p className="text-xs text-db-text-muted mb-1">Total Exp</p>
          <p className="text-lg font-bold text-db-primary">
            {currencySymbol}
            {totalSpent.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
