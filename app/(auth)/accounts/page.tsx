'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, type ComponentPropsWithoutRef, type ComponentType } from 'react';
import { useMutation, useQuery } from "convex/react";
import { CircleFlag } from 'react-circle-flags';
import { useRouter } from 'next/navigation';
import {
  CashOut,
  AddSquare,
  Bag3,
  Bus,
  Camera,
  Card,
  Dollar,
  FileText,
  Lightbulb,
  MenuDots,
  Mug,
  Refresh,
  TransferHorizontal,
} from '@solar-icons/react-perf/BoldDuotone';
import { COUNTRIES } from '@/convex/constants';
import { api } from '@/convex/_generated/api';
import { countries } from '@/app/data/countries';
import { currencies } from '@/app/data/currencies';

type Region = keyof typeof COUNTRIES;

const REGIONS = COUNTRIES;

type SolarIconComponent = ComponentType<
  ComponentPropsWithoutRef<'svg'> & { size?: string | number; color?: string }
>;

export default function AccountsPage() {
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);
  const beneficiaries = useQuery(api.beneficiaries.getBeneficiaries);
  const user = useQuery(
    api.user.getUserByEmail,
    typeof identity?.email === 'string' ? { email: identity.email } : 'skip',
  );

  const router = useRouter();
  const userRegion = countries.find((country) => country.name === user?.country as string)?.code as string;

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({ region: userRegion }).catch(() => { });
  }, [ensureUserAccounts, identity, userRegion]);

  // Logic to determine currencies based on user region
  const { local, international, localCode, internationalCode } = useMemo(() => {
    const localAccount = accounts?.find((acc) => acc.type === "local" || acc.kind === "local");
    const internationalAccount = accounts?.find((acc) => acc.type === "international" || acc.kind === "international");

    const localRegionCode = localAccount?.region ?? userRegion;
    const internationalRegionCode = internationalAccount?.region ?? 'US';

    const localConfig = REGIONS[localRegionCode as Region] ?? REGIONS['US'];
    const internationalConfig = REGIONS[internationalRegionCode as Region] ?? REGIONS['US'];

    return {
      local: localConfig,
      international: internationalConfig,
      localCode: localRegionCode,
      internationalCode: internationalRegionCode,
    };
  }, [userRegion, accounts]);

  const balances = useMemo(() => {
    const localAccount =
      accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? accounts?.[0];
    const internationalAccount =
      accounts?.find((acc) => acc.type === "international" || acc.kind === "international") ??
      accounts?.[1];

    return {
      local: localAccount?.balance ?? 0,
      international: internationalAccount?.balance ?? 0,
    };
  }, [accounts]);

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

  const getCategoryIcon = (category: string): SolarIconComponent => {
    switch (category) {
      case "Shopping":
        return Bag3;
      case "Income":
        return Dollar;
      case "Entertainment":
        return Camera;
      case "Food":
        return Mug;
      case "Cash":
        return Card;
      case "Utilities":
        return Lightbulb;
      case "Transportation":
        return Bus;
      default:
        return TransferHorizontal;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Income":
        return "bg-emerald-50 text-db-success";
      case "Shopping":
        return "bg-db-primary-subtle text-db-primary";
      case "Entertainment":
        return "bg-db-hover text-db-text-primary";
      case "Food":
        return "bg-db-primary-subtle text-db-primary";
      case "Utilities":
        return "bg-red-50 text-red-600";
      case "Transportation":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-db-hover text-db-text-secondary";
    }
  };

  const formatTransactionDate = (dateString: string) => {
    const parsed = Date.parse(dateString);
    if (!Number.isFinite(parsed)) return dateString;
    return new Date(parsed).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const recentTransactions = useMemo(() => {
    const accountCurrencyById = new Map();
    for (const acc of accounts ?? []) {
      if (!("_id" in acc) || !acc._id) continue;
      accountCurrencyById.set(
        acc._id,
        acc.currency ?? (acc.type === "international" ? "EUR" : "USD"),
      );
    }

    const combined = [...(localTransactions ?? []), ...(internationalTransactions ?? [])];
    combined.sort((a, b) => {
      const left = Date.parse(a.date);
      const right = Date.parse(b.date);
      const leftValue = Number.isFinite(left) ? left : 0;
      const rightValue = Number.isFinite(right) ? right : 0;
      return rightValue - leftValue;
    });

    return combined.slice(0, 4).map((tx) => ({
      id: tx._id,
      name: tx.description,
      date: formatTransactionDate(tx.date),
      amount: tx.amount,
      currency: accountCurrencyById.get(tx.bankAccountId) ?? "USD",
      Icon: getCategoryIcon(tx.category),
      color: getCategoryColor(tx.category),
    }));
  }, [accounts, internationalTransactions, localTransactions]);

  if (identity === undefined || accounts === undefined) {
    return (
      <div className="space-y-6 lg:space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-44 rounded-lg bg-db-hover mb-2" />
            <div className="h-4 w-72 rounded bg-db-hover" />
          </div>
          <div className="h-10 w-44 rounded-2xl bg-db-hover border border-db-border" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="p-6 lg:p-7 rounded-3xl bg-db-surface border border-db-border space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-full bg-db-hover" />
                <div className="w-9 h-9 rounded-full bg-db-hover" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-db-hover" />
                <div className="h-9 w-48 rounded bg-db-hover" />
                <div className="h-4 w-36 rounded bg-db-hover" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-11 flex-1 rounded-xl bg-db-hover" />
                <div className="h-11 flex-1 rounded-xl bg-db-hover" />
              </div>
            </div>
          ))}
        </div>

        {/* Details / List Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-36 rounded bg-db-hover" />
            <div className="bg-db-surface rounded-2xl border border-db-border overflow-hidden divide-y divide-db-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-db-hover" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 rounded bg-db-hover" />
                      <div className="h-3 w-24 rounded bg-db-hover" />
                    </div>
                  </div>
                  <div className="h-5 w-20 rounded bg-db-hover" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-db-hover border border-db-border h-44" />
            <div className="p-6 rounded-2xl bg-db-surface border border-db-border h-36" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-db-text-primary tracking-tight">
            Accounts
          </h1>
          <p className="text-sm sm:text-base text-db-text-secondary mt-1">
            Manage your local and international spending
          </p>
        </div>

        {/* Region Badge */}
        <div className="inline-flex items-center gap-2.5 bg-db-surface px-3.5 py-2 rounded-2xl border border-db-border shadow-xs self-start sm:self-auto">
          <span className="text-xs font-bold text-db-text-muted uppercase tracking-wider">
            Region:
          </span>
          <div className="flex items-center gap-2 text-sm font-bold text-db-text-primary">
            <CircleFlag countryCode={localCode?.toLowerCase()} className="w-5 h-5 shadow-xs" />
            <span>{REGIONS[localCode as Region]?.name || localCode || 'Global'}</span>
          </div>
        </div>
      </motion.div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {/* Local Account Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="group relative p-6 lg:p-7 rounded-3xl bg-db-surface border border-db-border overflow-hidden hover:border-db-primary/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-64"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
            <span className="text-9xl grayscale">{local?.flag}</span>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-start justify-between">
              <div className="w-20 h-20 rounded-full bg-db-hover border border-db-border flex items-center justify-center text-3xl shadow-xs overflow-hidden">
                <CircleFlag countryCode={localCode?.toLowerCase()} className="w-20 h-20" />
              </div>
              <button
                type="button"
                aria-label="Account options"
                className="w-9 h-9 rounded-full bg-db-hover flex items-center justify-center hover:bg-db-border transition-colors text-db-text-secondary"
              >
                <MenuDots size={18} color="currentColor" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-db-text-muted uppercase tracking-wider mb-1">
                Local Account
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-db-text-primary tracking-tight">
                  {currencies.find((c: { code: string }) => c.code === local?.currency)?.symbol || '$'}
                  {balances?.local?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-db-success text-xs font-bold border border-emerald-200">
                  Active
                </span>
                <span className="text-xs text-db-text-muted font-medium">{local?.name}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/transfers")}
                className="flex-1 py-3 px-4 bg-db-primary text-db-text-primary font-bold text-sm rounded-xl hover:bg-db-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CashOut size={20} color="currentColor" /> Add Money
              </button>
              <button
                onClick={() => localAccountId && router.push(`/accounts/${localAccountId}`)}
                className="flex-1 py-3 px-4 bg-db-hover text-db-text-primary font-bold text-sm rounded-xl hover:bg-db-border active:scale-[0.98] transition-all border border-db-border cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        </motion.div>

        {/* International Account Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="group relative p-6 lg:p-7 rounded-3xl bg-db-surface border border-db-border overflow-hidden hover:border-db-primary/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-64"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
            <span className="text-9xl grayscale">{international?.flag}</span>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-start justify-between">
              <div className="w-20 h-20 rounded-full bg-db-hover border border-db-border flex items-center justify-center text-3xl shadow-xs overflow-hidden">
                <CircleFlag countryCode={internationalCode?.toLowerCase()} className="w-20 h-20" />
              </div>
              <button
                type="button"
                aria-label="Account options"
                className="w-9 h-9 rounded-full bg-db-hover flex items-center justify-center hover:bg-db-border transition-colors text-db-text-secondary"
              >
                <MenuDots size={18} color="currentColor" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-db-text-muted uppercase tracking-wider mb-1">
                International Account
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-db-text-primary tracking-tight">
                  {currencies.find((c: { code: string }) => c.code === international?.currency)?.symbol || '$'}
                  {balances?.international?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-lg font-bold text-db-text-secondary">
                  {international?.currency}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200">
                  Global
                </span>
                <span className="text-xs text-db-text-muted font-medium">
                  {international?.currency} • {international?.name}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/convert")}
                className="flex-1 py-3 px-4 bg-db-hover text-db-text-primary font-bold text-sm rounded-xl hover:bg-db-border active:scale-[0.98] transition-all border border-db-border flex items-center justify-center gap-2 cursor-pointer"
              >
                <TransferHorizontal size={18} color="currentColor" /> Convert
              </button>
              <button
                onClick={() => internationalAccountId && router.push(`/accounts/${internationalAccountId}`)}
                className="flex-1 py-3 px-4 bg-db-hover text-db-text-primary font-bold text-sm rounded-xl hover:bg-db-border active:scale-[0.98] transition-all border border-db-border cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Transactions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-db-text-primary">Recent Transactions</h3>
            <button
              onClick={() => router.push("/transactions")}
              className="text-db-text-primary text-xs font-bold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="bg-db-surface rounded-2xl border border-db-border overflow-hidden divide-y divide-db-border shadow-xs">
            {accounts === undefined || localTransactions === undefined || internationalTransactions === undefined ? (
              <div className="p-8 text-center text-db-text-muted">
                <Refresh size={32} color="currentColor" className="mx-auto mb-2 animate-spin" />
                <p className="text-sm font-medium">Loading transactions…</p>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-db-text-muted">
                <FileText size={32} color="currentColor" className="mx-auto mb-2 opacity-60" />
                <p className="text-sm font-medium">No transactions yet.</p>
              </div>
            ) : (
              recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-db-hover/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${tx.color}`}>
                      <tx.Icon size={20} color="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-db-text-primary group-hover:text-db-text-primary transition-colors">
                        {tx.name}
                      </p>
                      <p className="text-xs text-db-text-muted">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-extrabold ${tx.amount > 0 ? 'text-db-success' : 'text-db-text-primary'}`}>
                      {tx.amount > 0 ? '+' : ''}
                      {currencies.find((c: { code: string }) => c.code === tx.currency)?.symbol || '$'}
                      {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] font-semibold text-db-text-muted">{tx.currency}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Spend Promo */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-db-primary text-db-text-primary relative overflow-hidden shadow-xs"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold mb-1.5">Spend anywhere</h3>
              <p className="text-db-text-primary/75 text-xs font-semibold mb-6 max-w-[85%] leading-relaxed">
                Use your PureFi card abroad with real-time zero-fee exchange rates.
              </p>

              <button
                onClick={() => router.push("/cards")}
                className="px-5 py-2.5 bg-db-text-primary text-white rounded-xl text-xs font-extrabold hover:bg-black active:scale-[0.98] transition-all shadow-xs cursor-pointer"
              >
                Get your card
              </button>
            </div>

            {/* Abstract Card Graphic */}
            <div className="absolute -bottom-10 -right-8 w-40 h-28 bg-db-text-primary/10 backdrop-blur-xs rounded-2xl transform -rotate-12 border border-db-text-primary/20 pointer-events-none" />
            <div className="absolute -bottom-6 -right-2 w-40 h-28 bg-db-surface/40 backdrop-blur-xs rounded-2xl transform -rotate-6 border border-db-border flex items-end justify-end p-3 pointer-events-none">
              <Card size={40} color="currentColor" className="text-db-text-primary/60" />
            </div>
          </motion.div>

          <div className="bg-db-surface rounded-2xl border border-db-border p-5 shadow-xs">
            <h3 className="font-bold text-sm text-db-text-primary mb-4">Quick Send</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {(beneficiaries || []).slice(0, 4).map((beneficiary) => (
                <div key={beneficiary._id} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-db-hover border border-db-border flex items-center justify-center text-db-text-primary font-bold text-sm group-hover:border-db-primary transition-all overflow-hidden shrink-0">
                    {beneficiary.color ? (
                      <div className={`w-full h-full ${beneficiary.color} flex items-center justify-center`}>
                        {beneficiary.name[0]}
                      </div>
                    ) : (
                      beneficiary.name[0]
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-db-text-muted group-hover:text-db-text-primary transition-colors truncate w-full text-center">
                    {beneficiary.name.split(' ')[0]}
                  </span>
                </div>
              ))}
              <div
                onClick={() => router.push("/transfers")}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-db-hover border border-dashed border-db-border flex items-center justify-center text-db-text-primary group-hover:border-db-primary group-hover:bg-db-primary-subtle transition-all shrink-0">
                  <AddSquare size={20} color="currentColor" />
                </div>
                <span className="text-[11px] font-medium text-db-text-muted">Add</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
