'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import InternationalTransferForm from './InternationalTransferForm';
import LocalTransferForm from './LocalTransferForm';
import EmailTransferForm from './EmailTransferForm';
import RequestMoneyForm from './RequestMoneyForm';
import { Id } from '@/convex/_generated/dataModel';
import RiIcon from '@/app/components/ui/RiIcon';
import { api } from '@/convex/_generated/api';

type TransferType = 'local' | 'bank_email' | 'international' | 'request' | null;

export default function TransfersPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<TransferType>(null);
  const [requestActionId, setRequestActionId] = useState<Id<"transfers"> | null>(null);
  const [success, setSuccess] = useState(false);
  const [internationalAccountId, setInternationalAccountId] = useState<Id<"bank_accounts"> | null>(null);
  const [localAccountId, setLocalAccountId] = useState<Id<"bank_accounts"> | null>(null);

  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);
  const internationalAccount = accounts?.find((acc) => acc.type === "international" || acc.kind === "international") ?? accounts?.[0];
  const localAccount = accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? accounts?.[0];
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const incomingRequests = useQuery(api.transfers.getIncomingRequests);
  const respondToRequest = useMutation(api.transactions.respondToRequest);

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({})
      .then((result) => {
        if (!result) return;
        setInternationalAccountId(result.internationalId);
        setLocalAccountId(result.localId);
      })
      .catch(() => { });
  }, [ensureUserAccounts, identity]);

  const handleTypeSelect = (type: TransferType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedType(null);
    setSuccess(false);
  };

  const transferOptions = [
    { id: 'local', label: 'Local Transfer', desc: 'Transfer to a local bank account', icon: 'ri-bank-card-line' },
    { id: 'bank_email', label: 'Send to Email', desc: 'Transfer funds via email address', icon: 'ri-mail-send-line' },
    { id: 'international', label: 'International Transfer', desc: 'Send money abroad', icon: 'ri-global-line' },
    { id: 'request', label: 'Request Money', desc: 'Request funds via email', icon: 'ri-hand-coin-line', isNew: true },
  ];

  return (
    <div className="min-h-full selection:bg-db-primary/20">
      <div className="px-4 py-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">New Transfer</h1>
          <p className="text-sm text-zinc-500">Choose how you want to move your money</p>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {incomingRequests === undefined ? (
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 w-32 bg-zinc-200 rounded" />
                      <div className="h-3 w-16 bg-zinc-200 rounded" />
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-5 bg-white rounded-2xl border border-zinc-200">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-zinc-200 shrink-0" />
                              <div className="space-y-2">
                                <div className="h-4 w-36 bg-zinc-200 rounded" />
                                <div className="h-3 w-44 bg-zinc-200 rounded" />
                              </div>
                            </div>
                            <div className="text-right shrink-0 space-y-2">
                              <div className="h-4 w-20 bg-zinc-200 rounded ml-auto" />
                              <div className="h-3 w-14 bg-zinc-200 rounded ml-auto" />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-end gap-2">
                            <div className="h-9 w-20 bg-zinc-200 rounded-xl" />
                            <div className="h-9 w-20 bg-zinc-200 rounded-xl" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (incomingRequests?.length ?? 0) > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-zinc-900">Incoming Requests</h2>
                      <span className="text-xs text-zinc-400">{incomingRequests.length} pending</span>
                    </div>
                    <div className="space-y-3">
                      {incomingRequests.map((req) => (
                        <div
                          key={req._id}
                          className="p-5 bg-white rounded-2xl border border-zinc-200 transition-colors hover:border-zinc-300"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-db-primary-subtle text-db-primary flex items-center justify-center shrink-0">
                                  <RiIcon className="ri-hand-coin-line text-lg" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-zinc-900 truncate">{req.from}</p>
                                  <p className="text-xs text-zinc-400 truncate">{req.note || 'Request'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-semibold text-zinc-900">
                                {localAccount?.currency ? (localAccount.currency === 'USD' ? '$' : localAccount.currency) : '$'}
                                {req.amount.toLocaleString()}
                              </p>
                              <p className="text-[11px] text-zinc-400 font-medium">Pending</p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={!localAccountId || requestActionId === req._id}
                              onClick={() => {
                                if (!localAccountId) return;
                                setRequestActionId(req._id);
                                void respondToRequest({ transferId: req._id, action: "decline" })
                                  .finally(() => setRequestActionId(null));
                              }}
                              className="px-4 py-2.5 rounded-xl text-xs font-medium border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              disabled={!localAccountId || requestActionId === req._id}
                              onClick={() => {
                                if (!localAccountId) return;
                                setRequestActionId(req._id);
                                void respondToRequest({ transferId: req._id, action: "accept", payerAccountId: localAccountId })
                                  .finally(() => setRequestActionId(null));
                              }}
                              className="px-4 py-2.5 rounded-xl text-xs font-medium bg-zinc-900 text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {transferOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleTypeSelect(option.id as TransferType)}
                    className="group flex items-center gap-4 p-4 lg:p-5 bg-white rounded-2xl border border-zinc-200 transition-colors hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-db-primary-subtle group-hover:text-db-primary transition-colors shrink-0">
                      <RiIcon className={option.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-zinc-900">{option.label}</h3>
                        {option.isNew && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 uppercase shrink-0">New</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{option.desc}</p>
                    </div>
                    <RiIcon className="ri-arrow-right-s-line text-zinc-300 group-hover:text-zinc-900 text-lg shrink-0 transition-colors" />
                  </div>
                ))}
                </div>
              </motion.div>
            ) : (
                <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                >
                    {success && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                                <RiIcon className="ri-check-line text-2xl" />
                            </div>
                            <p className="mt-5 text-sm font-medium text-zinc-900">Transfer successful</p>
                            <p className="text-xs text-zinc-400 mt-1">Returning to transfers...</p>
                        </div>
                    )}
                    {selectedType === 'international' && internationalAccountId && (
                        <InternationalTransferForm
                            internationalAccountId={internationalAccountId}
                            balance={internationalAccount?.balance ?? 0}
                            currency={internationalAccount?.currency}
                            onSuccess={() => {
                                setSuccess(true);
                                setTimeout(handleBack, 2000);
                            }}
                            onCancel={handleBack}
                        />
                    )}

                    {selectedType === 'local' && localAccountId && (
                        <LocalTransferForm
                            localAccountId={localAccountId}
                            balance={localAccount?.balance ?? 0}
                            currency={localAccount?.currency}
                            onSuccess={() => {
                                setSuccess(true);
                                setTimeout(handleBack, 2000);
                            }}
                            onCancel={handleBack}
                        />
                    )}

                    {selectedType === 'bank_email' && localAccountId && (
                        <EmailTransferForm
                            localAccountId={localAccountId}
                            balance={localAccount?.balance ?? 0}
                            currency={localAccount?.currency}
                            onSuccess={() => {
                                setSuccess(true);
                                setTimeout(handleBack, 2000);
                            }}
                            onCancel={handleBack}
                        />
                    )}

                    {selectedType === 'request' && localAccountId && (
                        <RequestMoneyForm
                            localAccountId={localAccountId}
                            currency={localAccount?.currency}
                            onSuccess={() => {
                                setSuccess(true);
                                setTimeout(handleBack, 2000);
                            }}
                            onCancel={handleBack}
                        />
                    )}

                    {((selectedType === 'international' && !internationalAccountId) || 
                      (selectedType !== 'international' && !localAccountId)) && (
                        <div className="flex items-center justify-center h-64">
                            <RiIcon className="ri-loader-4-line animate-spin text-2xl text-zinc-300" />
                        </div>
                    )}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
