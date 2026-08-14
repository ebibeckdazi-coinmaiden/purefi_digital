'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMutation, useQuery } from 'convex/react';
import { currencies } from '@/app/data/currencies';
import { api } from '@/convex/_generated/api';
import RiIcon from '@/app/components/ui/RiIcon';

export default function TransactionsPage() {
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({}).catch(() => {});
  }, [ensureUserAccounts, identity]);

  const localAccount = accounts?.find((acc) => acc.type === 'local' || acc.kind === 'local');
  const currencySymbol = currencies.find((c: { code: string }) => c.code === (localAccount?.currency || 'USD'))?.symbol || '$';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Shopping': return 'ri-shopping-bag-line';
      case 'Income': return 'ri-money-dollar-circle-line';
      case 'Entertainment': return 'ri-movie-line';
      case 'Food': return 'ri-restaurant-line';
      case 'Cash': return 'ri-bank-card-line';
      case 'Utilities': return 'ri-lightbulb-line';
      case 'Transportation': return 'ri-car-line';
      default: return 'ri-exchange-line';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Income': return 'bg-db-primary-subtle text-db-primary';
      case 'Shopping': return 'bg-db-primary-subtle text-db-primary';
      case 'Entertainment': return 'bg-db-hover text-db-text-primary';
      case 'Food': return 'bg-db-primary-subtle text-db-primary';
      case 'Utilities': return 'bg-db-hover text-db-text-secondary';
      default: return 'bg-db-hover text-db-text-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const { localAccountId, internationalAccountId } = useMemo(() => {
    const localAccount = accounts?.find((acc) => acc.type === 'local' || acc.kind === 'local') ?? null;
    const internationalAccount =
      accounts?.find((acc) => acc.type === 'international' || acc.kind === 'international') ?? null;

    return {
      localAccountId: localAccount && '_id' in localAccount ? (localAccount._id ?? null) : null,
      internationalAccountId:
        internationalAccount && '_id' in internationalAccount ? (internationalAccount._id ?? null) : null,
    };
  }, [accounts]);

  const localTransactions = useQuery(
    api.transactions.getTransactionsByAccount,
    localAccountId ? { bankAccountId: localAccountId } : 'skip',
  );

  const internationalTransactions = useQuery(
    api.transactions.getTransactionsByAccount,
    internationalAccountId ? { bankAccountId: internationalAccountId } : 'skip',
  );

  const accountCurrencyById = useMemo(() => {
    const map = new Map<string, string>();
    if (accounts) {
      for (const acc of accounts) {
        if (acc && '_id' in acc && acc._id && acc.currency) {
          map.set(acc._id, acc.currency);
        }
      }
    }
    return map;
  }, [accounts]);

  const allTransactions = useMemo(() => {
    const combined = [...(localTransactions ?? []), ...(internationalTransactions ?? [])];
    combined.sort((a, b) => {
      const left = Date.parse(a.date);
      const right = Date.parse(b.date);
      const leftValue = Number.isFinite(left) ? left : 0;
      const rightValue = Number.isFinite(right) ? right : 0;
      return rightValue - leftValue;
    });
    return combined;
  }, [internationalTransactions, localTransactions]);

  const filteredTransactions = useMemo(() => {
    const list = allTransactions.filter((transaction) => {
      const matchesFilter = filter === 'all' || transaction.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortBy === 'date') return list;
    return list;
  }, [allTransactions, filter, searchTerm, sortBy]);

  const categories = ['all', 'Income', 'Shopping', 'Food', 'Entertainment', 'Utilities', 'Transportation'];

  return (
    <>
      <main className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Transactions</h1>
            <p className="text-db-text-secondary">View and manage your transaction history</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative">
              <RiIcon className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-db-text-muted" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-white border border-db-border rounded-lg py-2.5 pl-10 pr-4 text-db-text-primary placeholder-db-text-muted focus:border-db-primary focus:ring-1 focus:ring-db-primary outline-none transition-all"
              />
            </div>
            <button className="px-4 py-2.5 bg-white border border-db-border rounded-lg hover:bg-db-hover transition-colors flex items-center justify-center gap-2">
              <RiIcon className="ri-download-line" />
              <span>Export CSV</span>
            </button>
          </motion.div>
        </div>

        {/* Filters */}
        <ScrollArea className="mb-8 pb-2 whitespace-nowrap">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
                  filter === category
                    ? 'bg-db-primary text-db-text-primary'
                    : 'bg-white text-db-text-secondary hover:bg-db-hover'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Transactions List */}
        <div className="bg-white border border-db-border rounded-xl overflow-hidden">
          {accounts === undefined || localTransactions === undefined || internationalTransactions === undefined ? (
            <div className="p-6 animate-pulse">
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-db-hover border border-db-border">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-db-hover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-52 max-w-full bg-db-hover rounded mb-2" />
                        <div className="h-3 w-72 max-w-full bg-db-hover rounded" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="h-4 w-24 bg-db-hover rounded" />
                      <div className="h-5 w-18 bg-db-hover rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-db-text-muted">
              <RiIcon className="ri-file-search-line text-4xl mb-4 block" />
              <p>No transactions found matching your criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-db-border">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-db-hover transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(transaction.category)}`}>
                      <RiIcon className={`${getCategoryIcon(transaction.category)} text-lg`} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-db-text-primary group-hover:text-db-primary transition-colors">{transaction.description}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-db-text-secondary">
                        <span>{transaction.merchant}</span>
                        <span>•</span>
                        <span>{transaction.location}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-mono font-medium ${transaction.amount > 0 ? 'text-db-success' : 'text-db-text-primary'}`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {currencies.find(c => c.code === (accountCurrencyById.get(transaction.bankAccountId) || 'USD'))?.symbol || '$'}
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      transaction.status === 'completed' ? 'bg-emerald-50 text-db-success' :
                      transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-50 text-db-danger'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
