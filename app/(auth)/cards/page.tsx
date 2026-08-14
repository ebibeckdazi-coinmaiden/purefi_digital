/* eslint-disable react/no-children-prop */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import RiIcon from '@/app/components/ui/RiIcon';
import ModernCreditCard from '@/app/components/feature/ModernCreditCard';
import { currencies } from '@/app/data/currencies';

export default function CardsPage() {
  const setCardFreeze = useMutation(api.creditCards.setCardFreeze);
  const topUpCardFromLocal = useMutation(api.creditCards.topUpCardFromLocal);
  const setCardPin = useMutation(api.creditCards.setCardPin);
  const requestCard = useMutation(api.requestcard.requestCard);
  const deleteCreditCard = useMutation(api.creditCards.deleteCreditCard);
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const ensureDefaultCard = useMutation(api.creditCards.ensureDefaultCard);
  const cards = useQuery(api.creditCards.getCreditCards);
  const accounts = useQuery(api.accounts.getAccounts);
  const identity = useQuery(api.user.user);
  const currentUser = useQuery(api.auth.getCurrentUser);
  const user = useQuery(
    api.user.getUserByEmail,
    typeof currentUser?.email === 'string' ? { email: currentUser.email } : 'skip',
  );

  const [selectedCardId, setSelectedCardId] = useState<Id<"credit_cards"> | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showFeeConfirmation, setShowFeeConfirmation] = useState(false);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({}).catch(() => { });
    void ensureDefaultCard({}).catch(() => { });
  }, [ensureUserAccounts, ensureDefaultCard, identity]);

  useEffect(() => {
    if (!cards || cards.length === 0) {
      setSelectedCardId(null);
      return;
    }
    if (!selectedCardId || !cards.some((c) => c._id === selectedCardId)) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const selectedCard = useMemo(() => {
    if (!cards || cards.length === 0) return null;
    return cards.find((c) => c._id === selectedCardId) ?? cards[0] ?? null;
  }, [cards, selectedCardId]);

  useEffect(() => {
    if (!selectedCard) return;
    setIsFrozen(Boolean((selectedCard as unknown as { freeze?: boolean }).freeze));
  }, [selectedCard]);

  const localAccount = useMemo(() => accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? null, [accounts]);

  const { localAccountId, internationalAccountId } = useMemo(() => {
    const internationalAccount = accounts?.find((acc) => acc.type === "international" || acc.kind === "international") ?? null;

    return {
      localAccountId: localAccount && "_id" in localAccount ? (localAccount._id ?? null) : null,
      internationalAccountId:
        internationalAccount && "_id" in internationalAccount ? (internationalAccount._id ?? null) : null,
    };
  }, [accounts, localAccount]);

  const localTransactions = useQuery(
    api.transactions.getTransactionsByAccount,
    localAccountId ? { bankAccountId: localAccountId } : "skip",
  );

  const internationalTransactions = useQuery(
    api.transactions.getTransactionsByAccount,
    internationalAccountId ? { bankAccountId: internationalAccountId } : "skip",
  );

  const recentActivity = useMemo(() => {
    const combined = [...(localTransactions ?? []), ...(internationalTransactions ?? [])];

    // Filter for card top-up transactions
    const cardTransactions = combined.filter(tx => 
      tx.description.includes('Card top up')
    );

    cardTransactions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return cardTransactions.slice(0, 4).map((tx) => ({
      id: tx._id,
      description: tx.description,
      amount: tx.amount,
      date: tx.date,
      category: tx.category,
    }));
  }, [internationalTransactions, localTransactions]);

  // Handle Delete Card
  const handleDeleteCard = () => {
    if (!selectedCard) return;
    void deleteCreditCard({ id: selectedCard._id })
      .catch(() => { })
      .finally(() => {
        setShowDeleteConfirm(false);
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  const handleFeeConfirmation = async () => {
    if (!localAccountId) return;
    try {
      await requestCard({ bankAccountId: localAccountId });
      setShowFeeConfirmation(false);
      setShowRequestSuccess(true);
    } catch (error) {
      console.error("Failed to create initial request", error);
    }
  };

  return (
    <>
      <main className="selection:bg-db-primary/20 px-4 py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">Cards</h1>
              <p className="text-sm text-zinc-500 mt-1">Manage your physical and virtual cards</p>
            </div>
            <button
              disabled={cards === undefined || (cards?.length ?? 0) >= 3}
              onClick={() => setShowFeeConfirmation(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiIcon className="ri-add-line text-base" />
              Request New Card
            </button>
          </div>

          {cards === undefined ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-zinc-100 rounded-2xl p-5">
                    <div className="flex gap-4 overflow-hidden">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-72 h-44 rounded-xl bg-zinc-200" />
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-4 w-32 bg-zinc-200 rounded" />
                      <div className="h-3 w-16 bg-zinc-200 rounded" />
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-12 bg-zinc-200 rounded-xl" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-100 rounded-2xl p-5 space-y-5">
                  <div className="h-4 w-28 bg-zinc-200 rounded" />
                  <div className="h-24 bg-zinc-200 rounded-xl" />
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-10 bg-zinc-200 rounded-xl" />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-10 bg-zinc-200 rounded-xl" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <div className="w-16 h-16 rounded-full bg-db-primary-subtle flex items-center justify-center mb-5">
                <RiIcon className="ri-bank-card-line text-2xl text-db-primary" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-1">No cards yet</h2>
              <p className="text-sm text-zinc-500 mb-6">Request your first card to get started.</p>
              <button onClick={() => setShowFeeConfirmation(true)} className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                Request a Card
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Card Carousel */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 h-full lg:flex lg:flex-col">
                  <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5">
                    <div className="flex gap-4 px-1 overflow-x-auto snap-x pb-1">
                      {(cards ?? []).map((card) => (
                        <div
                          key={card._id}
                          onClick={() => setSelectedCardId(card._id)}
                          className={`relative shrink-0 w-full max-w-72 min-w-64 snap-center group cursor-pointer transition-all duration-200 ${
                            selectedCardId === card._id ? 'scale-[1.02]' : 'opacity-60 hover:opacity-90 scale-[0.97]'
                          }`}
                        >
                          {selectedCardId === card._id && (
                            <div className="absolute -inset-1.5 rounded-2xl border-2 border-zinc-900 transition-opacity duration-200" />
                          )}
                          <ModernCreditCard name="PureFi" number={card.number} holder={[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Card Holder'} expiry={card.dueDate} />
                        </div>
                      ))}

                      {(cards?.length ?? 0) < 3 && (
                        <div
                          onClick={() => setShowFeeConfirmation(true)}
                          className="relative shrink-0 w-28 rounded-2xl border-2 border-dashed border-zinc-200 bg-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-db-primary hover:bg-db-primary-subtle transition-colors group snap-center"
                        >
                          <RiIcon className="ri-add-line text-xl text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                          <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors">Request</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between px-5 pt-5 pb-3">
                      <h3 className="text-sm font-semibold text-zinc-900">Recent Activity</h3>
                      <button className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium">View all</button>
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {recentActivity.length === 0 ? (
                        <div className="px-5 py-6 text-center text-sm text-zinc-400">No recent card activity</div>
                      ) : (
                        recentActivity.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                              }`}>
                                <RiIcon className={
                                  tx.category === 'Shopping' ? 'ri-shopping-bag-3-line' :
                                  tx.category === 'Food' ? 'ri-restaurant-line' :
                                  tx.category === 'Entertainment' ? 'ri-movie-line' : 'ri-exchange-dollar-line'
                                } />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-zinc-900 truncate">{tx.description}</div>
                                <div className="text-xs text-zinc-400 truncate">{new Date(tx.date).toLocaleString()}</div>
                              </div>
                            </div>
                            <div className={`text-sm font-semibold whitespace-nowrap ml-4 ${
                              tx.amount > 0 ? 'text-emerald-600' : 'text-zinc-900'
                            }`}>
                              {tx.amount > 0 ? '+' : ''}{currencies.find(c => c.code === (localAccount?.currency || 'USD'))?.symbol || '$'}{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Right: Card Control */}
                {selectedCard && (
                  <motion.div variants={itemVariants} className="space-y-6 h-full lg:flex lg:flex-col">
                    <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-5 h-full lg:flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-zinc-900">Card Control</h2>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                          isFrozen ? 'bg-red-50 border-red-200 text-red-500' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isFrozen ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {isFrozen ? 'Frozen' : 'Active'}
                        </div>
                      </div>

                      {/* Credit Usage */}
                      <div className="bg-zinc-50 rounded-xl p-4">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-[11px] text-zinc-500 mb-0.5">Credit Usage</p>
                            <p className="text-xl font-semibold text-zinc-900">
                              {Math.round((selectedCard.balance / selectedCard.limit) * 100)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-zinc-500 mb-0.5">Available</p>
                            <p className="text-sm font-medium text-zinc-900">
                              {(selectedCard.limit - selectedCard.balance).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedCard.balance / selectedCard.limit) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${isFrozen ? 'bg-zinc-400' : 'bg-db-primary'}`}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-[11px] text-zinc-400">
                          <span>Used: {selectedCard.balance.toLocaleString()}</span>
                          <span>Limit: {selectedCard.limit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Top Up */}
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">Top up</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[50, 100, 500].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => {
                                if (!selectedCard) return;
                                void topUpCardFromLocal({ cardId: selectedCard._id, amount }).catch(() => {});
                              }}
                              className="py-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:border-zinc-300"
                            >
                              ${amount}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            if (!selectedCard) return;
                            const nextFreeze = !isFrozen;
                            setIsFrozen(nextFreeze);
                            void setCardFreeze({ id: selectedCard._id, freeze: nextFreeze }).catch(() => {});
                          }}
                          className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                            isFrozen
                              ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                              : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300'
                          }`}
                        >
                          {isFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                        <button
                          onClick={() => setShowDetailsModal(true)}
                          className="py-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:border-zinc-300"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => { setNewPin(''); setShowPinModal(true); }}
                          className="py-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:border-zinc-300"
                        >
                          Change PIN
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="py-3 rounded-xl border border-red-200 bg-white text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:border-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Change PIN Modal */}
      <AnimatePresence>
        {showPinModal && selectedCard && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowPinModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl border border-zinc-200 p-6 max-w-sm w-full max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-zinc-900">Change PIN</h3>
                <button onClick={() => setShowPinModal(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <RiIcon className="ri-close-line text-xl" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">New 4-digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setNewPin(val);
                    }}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-center text-xl tracking-[1em] focus:border-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-300"
                    placeholder="••••"
                  />
                </div>
                <button
                  disabled={newPin.length !== 4}
                  onClick={() => {
                    void setCardPin({ id: selectedCard._id, pin: Number(newPin) })
                      .then(() => { setShowPinModal(false); setNewPin(''); })
                      .catch(() => {});
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update PIN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fee Confirmation Modal */}
      <AnimatePresence>
        {showFeeConfirmation && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowFeeConfirmation(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl border border-zinc-200 p-6 max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
              <div className="w-12 h-12 rounded-full bg-db-primary-subtle flex items-center justify-center mx-auto mb-4">
                <RiIcon className="ri-information-line text-xl text-db-primary" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 text-center mb-2">Important Information</h3>
              <p className="text-sm text-zinc-500 text-center mb-6 leading-relaxed">
                Please note that if this request is approved, the applicable card issuance fee will be automatically deducted from my local account. I also understand that the processing time for this request is estimated to take two to three business days.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeeConfirmation(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFeeConfirmation()}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl border border-zinc-200 p-6 max-w-sm w-full max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <RiIcon className="ri-delete-bin-line text-xl text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 text-center mb-1">Delete card?</h3>
              <p className="text-sm text-zinc-500 text-center mb-6">
                Are you sure you want to delete your <span className="text-zinc-900 font-medium">{selectedCard?.name}</span>? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCard}
                  className="py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCard && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDetailsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="relative bg-white rounded-2xl border border-zinc-200 p-6 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-zinc-900">Card Information</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <RiIcon className="ri-close-line text-sm" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-100">
                  <div className="mb-5">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5">Card Number</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg text-zinc-900 tracking-widest">
                        {showFullNumber ? selectedCard.number : selectedCard.number}
                      </span>
                      <button
                        onClick={() => setShowFullNumber(!showFullNumber)}
                        className="text-zinc-400 hover:text-zinc-900 transition-colors"
                      >
                        <RiIcon className={showFullNumber ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">Expiry</p>
                      <p className="font-mono text-base text-zinc-900">{selectedCard.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">CVV</p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base text-zinc-900">
                          {(() => {
                            const cvv = (selectedCard as unknown as { cvv?: number }).cvv;
                            if (cvv === undefined) return "—";
                            if (!showCvv) return "•••";
                            return String(cvv).padStart(3, "0");
                          })()}
                        </span>
                        <button onClick={() => setShowCvv(!showCvv)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                          <RiIcon className={showCvv ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">Holder</p>
                      <p className="text-base text-zinc-900 font-medium truncate">{user?.firstName} {user?.lastName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100">
                  <RiIcon className="ri-map-pin-2-line text-zinc-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Billing Address</p>
                    <p className="text-sm text-zinc-900 truncate">
                      {(selectedCard as unknown as { billingAddress?: string }).billingAddress ?? "—"}
                    </p>
                  </div>
                  <button className="text-zinc-400 hover:text-zinc-900 transition-colors shrink-0">
                    <RiIcon className="ri-file-copy-line" />
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-100">
                  <RiIcon className="ri-shield-keyhole-line text-zinc-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">PIN</p>
                    <p className="font-mono text-sm tracking-widest text-zinc-900">
                      {(() => {
                        const pin = (selectedCard as unknown as { pin?: number }).pin;
                        if (pin === undefined) return "—";
                        if (!showPin) return "••••";
                        return String(pin).padStart(4, "0");
                      })()}
                    </p>
                  </div>
                  <button onClick={() => setShowPin(!showPin)} className="text-zinc-400 hover:text-zinc-900 transition-colors shrink-0">
                    <RiIcon className={showPin ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
                <p className="text-xs text-zinc-400 flex items-center justify-center gap-1.5">
                  <RiIcon className="ri-lock-fill" />
                  End-to-end encrypted
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Submitted Modal */}
      <AnimatePresence>
        {showRequestSuccess && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowRequestSuccess(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl border border-zinc-200 p-6 max-w-sm w-full max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <RiIcon className="ri-check-line text-xl text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 text-center mb-1">Request submitted</h3>
              <p className="text-sm text-zinc-500 text-center mb-6 leading-relaxed">
                Your card request has been received. Processing typically takes 2&ndash;3 business days. We&rsquo;ll notify you once it&rsquo;s approved.
              </p>
              <button
                onClick={() => setShowRequestSuccess(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
