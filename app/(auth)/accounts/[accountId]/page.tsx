'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { CircleFlag } from 'react-circle-flags';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import RiIcon from '@/app/components/ui/RiIcon';
import { currencies } from '@/app/data/currencies';
import ModernCreditCard from '@/app/components/feature/ModernCreditCard';

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as Id<"bank_accounts">;
  const [activeTab, setActiveTab] = useState<'transactions' | 'details' | 'pending'>('details');
  const [searchQuery, setSearchQuery] = useState('');

  const account = useQuery(api.accounts.getAccount, { accountId });
  const allAccounts = useQuery(api.accounts.getAccounts);
  const transactions = useQuery(api.transactions.getTransactionsByAccount, { bankAccountId: accountId });
  const creditCards = useQuery(api.creditCards.getCreditCards);

  if (account === undefined || allAccounts === undefined) {
    return (
      <div className="bg-db-surface border border-db-border rounded-3xl overflow-hidden shadow-xs animate-pulse flex flex-col lg:flex-row min-h-140">
        {/* Left Sidebar Skeleton */}
        <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-db-border p-6 bg-db-hover/30 space-y-4 shrink-0">
          <div className="h-6 w-36 rounded bg-db-hover mb-4" />
          <div className="h-10 rounded-xl bg-db-hover mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-db-border bg-db-hover/50 space-y-2">
                <div className="h-4 w-28 rounded bg-db-hover" />
                <div className="h-6 w-36 rounded bg-db-hover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details Area Skeleton */}
        <div className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-db-border pb-4">
            <div className="h-8 w-48 rounded bg-db-hover" />
            <div className="h-8 w-32 rounded bg-db-hover" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 rounded bg-db-hover" />
                <div className="h-6 w-36 rounded bg-db-hover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (account === null) {
    return (
      <div className="bg-db-surface border border-db-border rounded-3xl p-12 text-center shadow-xs my-auto min-h-80 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <RiIcon className="ri-error-warning-line text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-db-text-primary mb-1">Account not found</h2>
        <p className="text-sm text-db-text-secondary mb-6">
          The account you are trying to view does not exist or you do not have access.
        </p>
        <button
          onClick={() => router.push('/accounts')}
          className="px-5 py-2.5 bg-db-primary text-db-text-primary text-xs font-extrabold rounded-xl hover:bg-db-primary-hover transition-colors cursor-pointer"
        >
          Back to Accounts
        </button>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Shopping": return "ri-shopping-bag-line";
      case "Income": return "ri-money-dollar-circle-line";
      case "Entertainment": return "ri-movie-line";
      case "Food": return "ri-restaurant-line";
      case "Cash": return "ri-bank-card-line";
      case "Utilities": return "ri-lightbulb-line";
      case "Transportation": return "ri-car-line";
      default: return "ri-exchange-line";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Income": return "bg-emerald-50 text-db-success";
      case "Shopping": return "bg-db-primary-subtle text-db-primary";
      case "Entertainment": return "bg-db-hover text-db-text-primary";
      case "Food": return "bg-db-primary-subtle text-db-text-primary";
      case "Utilities": return "bg-red-50 text-red-600";
      case "Transportation": return "bg-blue-50 text-blue-600";
      default: return "bg-db-hover text-db-text-secondary";
    }
  };

  const formatTransactionDate = (dateString: string) => {
    const parsed = Date.parse(dateString);
    if (!Number.isFinite(parsed)) return dateString;
    return new Date(parsed).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredTransactions = (transactions ?? []).filter((tx) =>
    searchQuery
      ? tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="bg-db-surface border border-db-border rounded-3xl overflow-hidden shadow-xs flex flex-col lg:flex-row min-h-150">
      {/* Left Sidebar - Account Switcher */}
      <div className="lg:w-80 lg:max-w-xs border-b lg:border-b-0 lg:border-r border-db-border bg-db-hover/30 p-5 lg:p-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-db-text-primary">Your Accounts</h2>
          <button
            onClick={() => router.push('/accounts')}
            className="text-xs font-bold text-db-text-primary hover:underline cursor-pointer"
          >
            Overview
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-80 lg:max-h-none flex-1 pr-1">
          {allAccounts.map((acc) => {
            if (!('_id' in acc) || !acc._id) return null;
            const isSelected = acc._id === accountId;
            return (
              <div
                key={acc._id}
                onClick={() => acc._id && router.push(`/accounts/${acc._id}`)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer group relative",
                  isSelected
                    ? "bg-db-surface border-db-primary/60 shadow-xs ring-1 ring-db-primary/30"
                    : "bg-db-surface/60 border-db-border hover:bg-db-surface hover:border-db-border"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      isSelected ? "bg-db-primary text-db-text-primary" : "bg-db-hover text-db-text-secondary"
                    )}>
                      <RiIcon className="ri-wallet-3-line text-base" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-db-text-primary truncate max-w-36">
                        {acc.name}
                      </h3>
                      <p className="text-[11px] font-mono text-db-text-muted">{acc.number}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-db-border/50 flex items-baseline justify-between">
                  <span className="text-[10px] font-semibold text-db-text-muted uppercase tracking-wider">
                    Balance
                  </span>
                  <span className="text-sm font-extrabold text-db-text-primary">
                    {currencies.find((c) => c.code === acc.currency)?.symbol || '$'}
                    {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6">
        {/* Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-db-border pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/accounts')}
              className="w-9 h-9 rounded-full bg-db-hover border border-db-border flex items-center justify-center hover:bg-db-border transition-colors text-db-text-primary shrink-0 cursor-pointer"
              title="Back to accounts"
            >
              <RiIcon className="ri-arrow-left-line text-lg" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-db-text-primary tracking-tight">
                  {account.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-db-success text-[11px] font-bold border border-emerald-200">
                  {account.type === 'local' ? 'Local' : 'International'}
                </span>
              </div>
              <p className="text-xs text-db-text-muted font-mono mt-0.5">Acc No: {account.number}</p>
            </div>
          </div>

          {/* Balance Callout */}
          <div className="bg-db-hover/60 px-4 py-2.5 rounded-2xl border border-db-border flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs font-bold text-db-text-muted uppercase tracking-wider">Available:</span>
            <span className="text-lg font-extrabold text-db-text-primary">
              {currencies.find((c) => c.code === account.currency)?.symbol || '$'}
              {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-db-border pb-3">
          <div className="flex gap-6">
            {(['details', 'transactions', 'pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 font-bold text-xs uppercase tracking-wider transition-colors relative cursor-pointer",
                  activeTab === tab
                    ? "text-db-text-primary"
                    : "text-db-text-muted hover:text-db-text-primary"
                )}
              >
                {tab === 'details' ? 'Details' : tab === 'transactions' ? 'Transactions' : 'Pending'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeAccountTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-db-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'transactions' && (
            <div className="relative w-full sm:w-60">
              <RiIcon className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-db-text-muted text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full bg-db-hover/60 border border-db-border rounded-xl py-1.5 pl-9 pr-3 text-xs text-db-text-primary focus:outline-none focus:border-db-primary/50 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-db-hover/40 border border-db-border">
                  <p className="text-[11px] font-bold text-db-text-muted uppercase tracking-wider mb-1">
                    Account Number
                  </p>
                  <p className="text-sm font-bold text-db-text-primary font-mono">{account.number}</p>
                </div>

                <div className="p-4 rounded-2xl bg-db-hover/40 border border-db-border">
                  <p className="text-[11px] font-bold text-db-text-muted uppercase tracking-wider mb-1">
                    Account Product
                  </p>
                  <p className="text-sm font-bold text-db-text-primary">
                    {account.type === 'local' ? 'Standard Checking' : 'Global Savings'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-db-hover/40 border border-db-border">
                  <p className="text-[11px] font-bold text-db-text-muted uppercase tracking-wider mb-1">
                    Region
                  </p>
                  <div className="flex items-center gap-2">
                    {account.region && (
                      <CircleFlag countryCode={account.region.toLowerCase()} className="w-6 h-6 shadow-xs" />
                    )}
                    <p className="text-sm font-bold text-db-text-primary">{account.region ?? 'Global'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-db-hover/40 border border-db-border">
                  <p className="text-[11px] font-bold text-db-text-muted uppercase tracking-wider mb-1">
                    Currency
                  </p>
                  <p className="text-sm font-bold text-db-text-primary">{account.currency ?? 'USD'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-db-hover/40 border border-db-border">
                  <p className="text-[11px] font-bold text-db-text-muted uppercase tracking-wider mb-1">
                    Interest Rate
                  </p>
                  <p className="text-sm font-bold text-db-text-primary">{account.interestRate || '0.00%'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-db-hover/40 border border-db-border">
                  <p className="text-[11px] font-bold text-db-text-muted uppercase tracking-wider mb-1">
                    Overdraft Limit
                  </p>
                  <p className="text-sm font-bold text-db-text-primary">
                    {currencies.find((c) => c.code === account.currency)?.symbol || '$'}
                    {(856).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Associated Cards Section */}
              <div className="pt-2">
                <h3 className="text-sm font-extrabold text-db-text-primary uppercase tracking-wider mb-4">
                  Associated Cards
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {creditCards === undefined ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="min-w-64 w-72 aspect-[1.586/1] rounded-2xl bg-db-hover border border-db-border animate-pulse shrink-0" />
                    ))
                  ) : (
                    creditCards.map((card, i) => (
                      <ModernCreditCard
                        key={card._id}
                        name="PureFi Bank"
                        number={card.number}
                        holder={card.name}
                        expiry={card.dueDate}
                        style={i % 2 === 0 ? 'luxury' : 'lifestyle'}
                        className="min-w-64 w-72 aspect-[1.586/1] shadow-xs shrink-0"
                      />
                    ))
                  )}

                  <button
                    onClick={() => router.push("/cards")}
                    className="min-w-32 rounded-2xl border-2 border-dashed border-db-border bg-db-hover/40 flex flex-col items-center justify-center gap-2 hover:bg-db-hover transition-colors shrink-0 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-db-surface border border-db-border flex items-center justify-center group-hover:border-db-primary transition-colors text-db-text-primary">
                      <RiIcon className="ri-add-line text-lg" />
                    </div>
                    <span className="text-xs font-bold text-db-text-secondary group-hover:text-db-text-primary">
                      Add Card
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {transactions === undefined ? (
                <div className="space-y-3 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-db-hover/40 border border-db-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-db-hover" />
                        <div className="space-y-1">
                          <div className="h-4 w-36 rounded bg-db-hover" />
                          <div className="h-3 w-20 rounded bg-db-hover" />
                        </div>
                      </div>
                      <div className="h-5 w-16 rounded bg-db-hover" />
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="p-12 text-center text-db-text-muted border border-dashed border-db-border rounded-2xl bg-db-hover/20 flex flex-col items-center justify-center">
                  <RiIcon className="ri-file-list-3-line text-3xl mb-2 opacity-50" />
                  <p className="text-sm font-bold text-db-text-primary mb-0.5">
                    {searchQuery ? 'No matching transactions' : 'No transactions yet'}
                  </p>
                  <p className="text-xs text-db-text-secondary">
                    {searchQuery ? 'Try a different search term.' : 'Transactions for this account will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="bg-db-surface rounded-2xl border border-db-border divide-y divide-db-border overflow-hidden shadow-xs">
                  {filteredTransactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-4 hover:bg-db-hover/60 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0 ${getCategoryColor(tx.category)}`}>
                          <RiIcon className={getCategoryIcon(tx.category)} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-db-text-primary">{tx.description}</p>
                          <p className="text-xs text-db-text-muted">{formatTransactionDate(tx.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-extrabold ${tx.amount > 0 ? 'text-db-success' : 'text-db-text-primary'}`}>
                          {tx.amount > 0 ? '+' : ''}
                          {currencies.find((c) => c.code === (account.currency ?? 'USD'))?.symbol || '$'}
                          {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[11px] font-semibold text-db-text-muted">{tx.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="p-12 text-center text-db-text-muted border border-dashed border-db-border rounded-2xl bg-db-hover/20 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-db-hover flex items-center justify-center mb-3 text-db-text-secondary">
                <RiIcon className="ri-time-line text-2xl" />
              </div>
              <h3 className="text-sm font-bold text-db-text-primary mb-1">No Pending Transactions</h3>
              <p className="text-xs text-db-text-secondary max-w-xs">
                There are no pending holds or incoming transfers for this account.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
