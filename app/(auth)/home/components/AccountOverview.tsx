
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/app/components/base/Card';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { currencies } from '@/app/data/currencies';
import RiIcon from '@/app/components/ui/RiIcon';

export default function AccountOverview() {
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({}).catch(() => {});
  }, [ensureUserAccounts, identity]);

  const { primaryAccount, totalBalance, monthlyIncome, monthlyExpenses, savingsRate, creditScore, accountSummary } =
    useMemo(() => {
      const primaryAccount =
        accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? accounts?.[0] ?? null;

      const totalBalance = (accounts ?? []).reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
      const monthlyIncome = (accounts ?? []).reduce(
        (sum, acc) => sum + ("monthlyIncome" in acc ? (acc.monthlyIncome ?? 0) : 0),
        0,
      );
      const monthlyExpenses = (accounts ?? []).reduce(
        (sum, acc) => sum + ("monthlyExpenses" in acc ? (acc.monthlyExpenses ?? 0) : 0),
        0,
      );

      const accountSummary = (accounts ?? []).map((acc) => ({
        key: ("_id" in acc && acc._id ? acc._id : `${acc.type}-${acc.number}`) as string,
        type: acc.type,
        name: acc.name,
        number: acc.number,
        balance: acc.balance,
        currency: acc.currency,
        interestRate: acc.interestRate,
      }));

      return {
        primaryAccount,
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        savingsRate:
          primaryAccount && "savingsRate" in primaryAccount ? (primaryAccount.savingsRate ?? 0) : 0,
        creditScore:
          primaryAccount && "creditScore" in primaryAccount ? (primaryAccount.creditScore ?? 0) : 0,
        accountSummary,
      };
    }, [accounts]);

  const primaryCurrencySymbol = currencies.find(c => c.code === primaryAccount?.currency)?.symbol || '$';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
      {/* Main Balance Card */}
      <Card className="p-4 md:p-6 bg-db-primary text-db-text-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-db-text-primary/70 text-sm font-medium">Total Balance</p>
              <h2 className="text-2xl md:text-3xl font-bold text-db-text-primary">
                {primaryCurrencySymbol}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <RiIcon className="ri-wallet-line text-2xl text-db-text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-db-text-primary/70 text-xs font-medium">Account</p>
              <p className="font-bold text-db-text-primary">{primaryAccount?.number ?? ""}</p>
            </div>
            <div>
              <p className="text-db-text-primary/70 text-xs font-medium">Type</p>
              <p className="font-bold text-db-text-primary">{primaryAccount?.name ?? ""}</p>
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Financial Health Card */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-db-text-primary">Financial Health</h3>
          <div className="w-10 h-10 bg-db-success/10 rounded-full flex items-center justify-center">
            <RiIcon className="ri-heart-pulse-line text-db-success" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-db-text-muted">Credit Score</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-db-text-primary">{creditScore}</span>
              <span className="text-db-success text-sm">Excellent</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-db-text-muted">Savings Rate</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-db-text-primary">{savingsRate}%</span>
              <RiIcon className="ri-arrow-up-line text-db-success" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-db-text-muted">Monthly Income</span>
            <span className="font-bold text-db-text-primary">
              {primaryCurrencySymbol}{monthlyIncome.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-db-text-muted">Monthly Expenses</span>
            <span className="font-bold text-db-text-primary">
              {primaryCurrencySymbol}{monthlyExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Account Summary */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-db-text-primary mb-6">Account Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accountSummary.map((account, index) => (
              <motion.div
                key={account.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-db-hover rounded-xl border border-db-border hover:border-db-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-db-text-primary">{account.name}</h4>
                  <span className="text-xs text-db-text-muted">{account.number}</span>
                </div>

                <div className="mb-2">
                  <span className="text-2xl font-bold text-db-text-primary">
                    {currencies.find(c => c.code === account.currency)?.symbol || '$'}{account.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '0.00'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-db-text-muted">{account.type}</span>
                  <span className="text-db-success font-medium">{account.interestRate} APY</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
