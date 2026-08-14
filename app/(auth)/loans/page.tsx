'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { currencies } from '@/app/data/currencies';
import RiIcon from '@/app/components/ui/RiIcon';

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [term, setTerm] = useState(12);
  const [interestRate, setInterestRate] = useState(5.5);
  const router = useRouter()
  const approveLoan = useMutation(api.loans.approveLoan);
  
  const loansQuery = useQuery(api.loans.getLoans);
  const accounts = useQuery(api.accounts.getAccounts);
  if (loansQuery === undefined || accounts === undefined) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 animate-pulse">
          <div className="mb-8">
            <div className="h-9 w-56 rounded-lg bg-db-hover mb-3" />
            <div className="h-4 w-96 max-w-full rounded bg-db-hover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-6 w-32 rounded bg-db-hover" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-db-border p-8">
                  <div className="flex justify-between items-start mb-6 gap-6">
                    <div className="min-w-0 flex-1">
                      <div className="h-6 w-48 max-w-full bg-db-hover rounded mb-2" />
                      <div className="h-4 w-32 bg-db-hover rounded" />
                    </div>
                    <div className="text-right shrink-0">
                      <div className="h-3 w-14 bg-db-hover rounded mb-2 ml-auto" />
                      <div className="h-7 w-28 bg-db-hover rounded ml-auto" />
                    </div>
                  </div>
                  <div className="h-3 w-full bg-db-hover rounded-full mb-6" />
                  <div className="h-12 w-full bg-db-hover rounded-xl" />
                </div>
              ))}
              <div className="h-12 w-full rounded-2xl bg-db-hover border border-db-border" />
            </div>

            <div className="bg-white rounded-2xl border border-db-border p-8">
              <div className="h-6 w-40 rounded bg-db-hover mb-6" />
              <div className="space-y-6">
                <div>
                  <div className="h-4 w-32 rounded bg-db-hover mb-3" />
                  <div className="h-14 w-full rounded-xl bg-db-hover" />
                  <div className="h-3 w-full rounded-full bg-db-hover mt-4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-14 w-full rounded-xl bg-db-hover" />
                  <div className="h-14 w-full rounded-xl bg-db-hover" />
                </div>
                <div className="h-40 w-full rounded-xl bg-db-hover" />
                <div className="h-14 w-full rounded-xl bg-db-hover" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const loans = loansQuery ?? [];
  const localAccount = accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? accounts?.[0];
  const currencyCode = localAccount?.currency ?? 'USD';
  const currencySymbol = currencies.find(c => c.code === currencyCode)?.symbol ?? '$';

  const formatCurrency = (amount: number, currency: string = currencyCode) => {
    const symbol = currencies.find(c => c.code === currency)?.symbol ?? '$';
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const pendingLoans = loans.filter(l => l.status === 'pending').map(loan => ({
    id: loan._id,
    type: loan.purpose || 'Personal Loan',
    amount: loan.amount,
    date: new Date(loan.startDate).toLocaleDateString(),
    currency: loan.currency
  }));

  const activeLoans = loans.filter(l => l.status === 'active').map(loan => ({
    type: loan.purpose || 'Personal Loan',
    balance: loan.balance,
    original: loan.amount,
    nextPayment: new Date(loan.nextPaymentDate).toLocaleDateString(),
    amount: loan.monthlyPayment,
    rate: loan.rate,
    currency: loan.currency
  }));

  const calculateMonthlyPayment = () => {
    const r = interestRate / 100 / 12;
    const n = term;
    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - loanAmount;

  return (
    <>
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-db-text-primary mb-2">Loans & Credit</h1>
          <p className="text-db-text-secondary">Manage your loans and calculate new opportunities.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Loans */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {pendingLoans.length > 0 && (
              <div className="space-y-6 mb-8">
                <h2 className="text-xl font-bold text-db-text-primary">Pending Loans</h2>
                {pendingLoans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-2xl border border-db-border p-5 sm:p-8 relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-db-text-primary truncate">{loan.type}</h3>
                        <p className="text-sm text-db-text-secondary mt-1">Date: {loan.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-db-text-muted mb-1">Amount</p>
                        <p className="text-2xl font-bold text-db-text-primary">{formatCurrency(loan.amount, loan.currency)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await approveLoan({ loanId: loan.id });
                        } catch (err) {
                          console.error("Failed to approve loan:", err);
                          alert("Failed to approve loan. Please check console for details.");
                        }
                      }}
                      className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-bold rounded-xl transition-colors border border-yellow-500/20 flex items-center justify-center gap-2"
                    >
                      <RiIcon className="ri-check-line" />
                      Approve (Admin Demo)
                    </button>
                  </div>
                ))}
              </div>
            )}
            <h2 className="text-xl font-bold text-db-text-primary">Active Loans</h2>
            {activeLoans.map((loan, index) => (
              <div key={index} className="bg-white rounded-2xl border border-db-border p-5 sm:p-8 relative overflow-hidden group hover:border-db-primary/30 transition-all">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-db-text-primary truncate">{loan.type}</h3>
                    <p className="text-sm text-db-text-secondary mt-1 flex items-center gap-2">
                      <RiIcon className="ri-percent-line text-db-primary" />
                      Rate: <span className="text-db-text-primary">{loan.rate}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-db-text-muted mb-1">Remaining Balance</p>
                    <p className="text-2xl font-bold text-db-text-primary">{formatCurrency(loan.balance, loan.currency)}</p>
                  </div>
                </div>

                <div className="w-full bg-db-hover rounded-full h-3 mb-6 border border-db-border p-0.5">
                  <div
                    className="bg-db-primary h-full rounded-full shadow-lg"
                    style={{ width: `${(1 - loan.balance / loan.original) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center gap-3 text-sm p-4 bg-db-hover rounded-xl border border-db-border">
                  <span className="text-db-text-secondary flex items-center gap-2 min-w-0">
                    <RiIcon className="ri-calendar-event-line shrink-0" />
                    Next Payment: <span className="text-db-text-primary font-medium truncate">{loan.nextPayment}</span>
                  </span>
                  <span className="font-bold text-db-primary text-lg shrink-0">{formatCurrency(loan.amount, loan.currency)}</span>
                </div>
              </div>
            ))}

            <button
              onClick={() => router.push("/loans/apply")}
              className="w-full py-4 bg-white border border-dashed border-db-border rounded-2xl text-db-text-secondary hover:text-db-text-primary hover:border-db-primary hover:bg-db-hover transition-all cursor-pointer font-bold flex items-center justify-center gap-2">
              <RiIcon className="ri-add-circle-line text-xl" />
              Apply for a new loan
            </button>
          </motion.div>

          {/* Loan Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-db-border p-5 sm:p-8"
          >
            <h2 className="text-xl font-bold text-db-text-primary mb-6 flex items-center gap-2">
              <RiIcon className="ri-calculator-line text-db-primary" />
              Loan Calculator
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-db-text-secondary mb-2 uppercase tracking-wider">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-db-text-muted font-bold text-lg">{currencySymbol}</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full border border-db-border rounded-xl px-4 py-4 pl-14 text-db-text-primary placeholder-gray-600 focus:border-db-primary focus:ring-1 focus:ring-db-primary transition-all outline-none font-bold text-lg"
                  />
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full mt-4 accent-db-primary cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-db-text-secondary mb-2 uppercase tracking-wider">Term (Months)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full border border-db-border rounded-xl px-4 py-4 text-db-text-primary focus:border-db-primary focus:ring-1 focus:ring-db-primary outline-none font-bold text-center"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-db-text-muted text-xs">MO</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-db-text-secondary mb-2 uppercase tracking-wider">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full border border-db-border rounded-xl px-4 py-4 text-db-text-primary focus:border-db-primary focus:ring-1 focus:ring-db-primary outline-none font-bold text-center"
                      step="0.1"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-db-text-muted text-xs">%</div>
                  </div>
                </div>
              </div>

              <div className="bg-db-hover rounded-xl p-6 border border-db-border space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-db-border">
                  <span className="text-db-text-secondary">Monthly Payment</span>
                  <span className="text-3xl font-bold text-db-primary">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-db-text-muted">Total Interest</span>
                  <span className="text-db-text-primary font-medium">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-db-text-muted">Total Cost</span>
                  <span className="text-db-text-primary font-medium">{formatCurrency(totalPayment)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/loans/apply")}
                className="block w-full text-center py-4 bg-db-primary text-db-text-primary font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer">
                Apply for this loan
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
