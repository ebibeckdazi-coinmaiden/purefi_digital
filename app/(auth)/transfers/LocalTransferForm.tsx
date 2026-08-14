/* eslint-disable react/no-children-prop */
'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { type } from 'arktype';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import RiIcon from '@/app/components/ui/RiIcon';
import { currencies } from '@/app/data/currencies';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';


// --- ArkType Schemas ---
const AccountSchema = type("string | number").describe("Account Number");
const AmountSchema = type("number > 0").describe("Amount must be positive");
const NoteSchema = type("string <= 18").describe("Note must be 18 characters or less");

interface LocalTransferFormProps {
  localAccountId: Id<"bank_accounts">;
  balance: number;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const getCurrencySymbol = (currencyCode: string = 'USD') => {
  return currencies.find(c => c.code === currencyCode)?.symbol || '$';
};

interface Beneficiary {
  _id: string;
  name: string;
  iban: string;
  color?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function LocalTransferForm({
  localAccountId,
  balance,
  currency = 'USD',
  onSuccess,
  onCancel,
}: LocalTransferFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const currencySymbol = getCurrencySymbol(currency);
  const [bankDetails, setBankDetails] = useState<{ name: string; bic: string } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [useManualDetails, setUseManualDetails] = useState(false);
  const identity = useQuery(api.user.user);
  const user = useQuery(
    api.user.getUserByEmail,
    typeof identity?.email === 'string' ? { email: identity.email } : 'skip',
  );
  const [imsCode, setImsCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const createTransfer = useMutation(api.transfers.createTransfer);
  const createBeneficiary = useMutation(api.beneficiaries.createBeneficiary);
  const createTransaction = useMutation(api.transactions.createTransaction);
  const createNotification = useMutation(api.notifications.createNotification);
  const beneficiaries = useQuery(api.beneficiaries.getBeneficiaries) || [];
  const setImsCodeDb = useMutation(api.user.setImsCode);
  const setOtpCodeDb = useMutation(api.user.setOtpCode);

  const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  const normalizeOtp = (value: string) => value.replace(/[^\d]/g, '').slice(0, 6);

  const goBack = () => {
    if (step === 1) {
      onCancel();
      return;
    }
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else setStep(3);
  };

  const form = useForm({
    defaultValues: {
      recipient: '',
      amount: '',
      note: '',
      accountName: '',
      bankName: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await createTransfer({
          recipient: value.recipient,
          amount: parseFloat(value.amount),
          note: value.note,
          type: 'local',
          fromAccountId: localAccountId,
        });

        await createTransaction({
          bankAccountId: localAccountId,
          description: `Transfer to ${value.accountName || value.recipient}`,
          amount: -parseFloat(value.amount),
          date: new Date().toISOString(),
          category: "Transfer",
          status: "completed",
          merchant: value.accountName || value.recipient,
          location: "Online",
        });

        await createNotification({
          title: "Transfer Sent",
          message: `You sent ${currencySymbol}${value.amount} to ${value.accountName || value.recipient}`,
          type: "success",
          icon: "ri-send-plane-fill",
        });

        if (value.accountName.trim()) {
          await createBeneficiary({
            name: value.accountName.trim(),
            iban: value.recipient,
            bankName: value.bankName.trim() || bankDetails?.name || undefined,
          });
        }

        onSuccess();
      } catch (error) {
        console.error('Transfer failed', error);
      }
    },
  });

  const validateAndResolve = async (account: string) => {
    const result = AccountSchema(account);
    if (result instanceof type.errors) {
      setResolveError("Invalid format");
      setBankDetails(null);
      setUseManualDetails(false);
      return false;
    }

    // For local transfers, we might not have a resolution API, but we'll try or mock it
    // Assuming the same resolve endpoint works or we just skip it for now
    setIsResolving(true);
    setResolveError(null);

    try {
      // Mock resolution for local accounts or use real API if available
      // For now, let's simulate a delay and success for demo purposes
      // or try the API

      const res = await fetch('/api/bank/resolve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      const data = await res.json();

      if (!res.ok || !data?.ok || data.valid !== true) {
        // Fallback for local accounts that might not be IBANs
        // If it fails resolution, we encourage manual entry
        setResolveError('Could not resolve account details');
        setBankDetails(null);
        return false;
      }

      setBankDetails({
        name: data.bank?.name || 'Unknown Bank',
        bic: data.bank?.bic || '',
      });
      setUseManualDetails(false);
      return true;
    } catch {
      setResolveError('Failed to resolve bank details');
      return false;
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
        <button
          type="button"
          onClick={goBack}
          className="w-11 h-11 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors"
        >
          <RiIcon className="ri-arrow-left-line text-lg" />
        </button>
        <h2 className="text-sm font-semibold text-zinc-900">
          {step === 1 ? 'Recipient' : step === 2 ? 'Amount' : step === 3 ? 'IMS Verification' : 'Confirm'}
        </h2>
        <div className="w-9" />
      </div>

      <div className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="h-full flex flex-col"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col space-y-6"
              >
                <div>
                  <h3 className="text-xs font-medium text-zinc-500 mb-3">Recent Beneficiaries</h3>
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
                    {beneficiaries.map((user: Beneficiary) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          form.setFieldValue('recipient', user.iban);
                          validateAndResolve(user.iban);
                        }}
                        className="flex flex-col items-center gap-2 min-w-16 cursor-pointer group"
                      >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-base font-semibold transition-colors group-hover:bg-zinc-100 ${user.color || 'bg-zinc-100 text-zinc-700'}`}>
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-[11px] text-center text-zinc-500 group-hover:text-zinc-700 transition-colors w-full truncate px-0.5">
                          {user.name}
                        </span>
                      </div>
                    ))}
                    {beneficiaries.length === 0 && (
                      <p className="text-xs text-zinc-400">No recent beneficiaries</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Recipient Account</label>
                    <form.Field
                      name="recipient"
                      children={(field) => (
                        <div className="relative mt-1.5">
                          <input
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              setResolveError(null);
                              setBankDetails(null);
                              setUseManualDetails(false);
                              form.setFieldValue('accountName', '');
                              form.setFieldValue('bankName', '');
                            }}
                            onBlur={() => field.handleBlur()}
                            placeholder="Account Number"
                            className={`w-full bg-white border rounded-xl px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors font-mono ${resolveError ? 'border-red-500/50' : 'border-zinc-200'}`}
                          />
                          {isResolving && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <RiIcon className="ri-loader-4-line animate-spin text-zinc-900 text-lg" />
                            </div>
                          )}
                        </div>
                      )}
                    />
                    {resolveError && (
                      <p className="text-xs text-red-500 mt-1.5">{resolveError}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-500">Bank Details</label>
                    <form.Subscribe
                      selector={(state) => [state.values.bankName, state.values.accountName]}
                      children={([manualBankName, manualAccountName]) => {
                        const isManualReady = useManualDetails && !!manualBankName && !!manualAccountName;
                        const displayBankName = bankDetails
                          ? bankDetails.name
                          : useManualDetails && manualBankName
                            ? manualBankName
                            : 'Unknown Bank';
                        const showCheck = !!bankDetails || isManualReady;
                        return (
                          <div className={`mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 flex items-center justify-between ${showCheck ? 'border-zinc-300 bg-zinc-100' : ''}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${showCheck ? 'bg-db-primary text-zinc-900' : 'bg-zinc-100 text-zinc-400'} shrink-0`}>
                                <RiIcon className="ri-bank-line text-base" />
                              </div>
                              <div className="min-w-0">
                                <span className={`text-sm block truncate ${showCheck ? 'font-medium text-zinc-900' : 'text-zinc-400'}`}>
                                  {displayBankName}
                                </span>
                                {bankDetails && <span className="text-[11px] text-zinc-500 block">Verified</span>}
                                {!bankDetails && isManualReady && <span className="text-[11px] text-zinc-500 block">Manual</span>}
                              </div>
                            </div>
                            {showCheck && (
                              <RiIcon className="ri-check-line text-emerald-500 text-lg" />
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  {!bankDetails && !!resolveError && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Can&apos;t find bank details?</span>
                      <button
                        type="button"
                        onClick={() => setUseManualDetails((v) => !v)}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        {useManualDetails ? 'Hide' : 'Enter manually'}
                      </button>
                    </div>
                  )}

                  {useManualDetails && (
                    <div className="space-y-3">
                      <form.Field
                        name="accountName"
                        children={(field) => (
                          <div>
                            <label className="text-xs font-medium text-zinc-500">Account Name</label>
                            <input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={() => field.handleBlur()}
                              placeholder="e.g. John Doe"
                              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors"
                            />
                          </div>
                        )}
                      />
                      <form.Field
                        name="bankName"
                        children={(field) => (
                          <div>
                            <label className="text-xs font-medium text-zinc-500">Bank Name</label>
                            <input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={() => field.handleBlur()}
                              placeholder="e.g. Chase Bank"
                              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors"
                            />
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>

                <form.Subscribe
                  selector={(state) => [state.values.recipient, state.values.accountName, state.values.bankName]}
                  children={([recipient, manualAccountName, manualBankName]) => (
                    <button
                      type="button"
                      onClick={async () => {
                        const isManualReady = useManualDetails && !!manualAccountName && !!manualBankName;
                        if (isManualReady) { setStep(2); return; }
                        const isValid = await validateAndResolve(recipient);
                        if (isValid) setStep(2);
                      }}
                      className="w-full py-3 bg-db-primary text-zinc-900 font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#8dd860] flex items-center justify-center gap-2"
                    >
                      Continue <RiIcon className="ri-arrow-right-line text-base" />
                    </button>
                  )}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col space-y-6"
              >
                <form.Subscribe
                  selector={(state) => [state.values.recipient, state.values.accountName, state.values.bankName]}
                  children={([recipient, accountName, bankName]) => (
                    <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-db-primary-subtle flex items-center justify-center text-db-primary">
                          <RiIcon className="ri-bank-line text-lg" />
                        </div>
                        <div>
                          <p className="text-[11px] text-zinc-500 font-medium">Recipient</p>
                          <p className="text-sm font-semibold text-zinc-900">{accountName || bankDetails?.name || bankName || 'Recipient'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-400 font-mono">{recipient.slice(-4).padStart(recipient.length, '•')}</p>
                      </div>
                    </div>
                  )}
                />

                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <form.Field
                      name="amount"
                      validators={{
                        onChange: ({ value }) => {
                          const result = AmountSchema(parseFloat(value));
                          if (value && result instanceof type.errors) return "Invalid amount";
                          if (parseFloat(value) > balance) return "Insufficient funds";
                          return undefined;
                        }
                      }}
                      children={(field) => (
                        <div className="space-y-3 text-center">
                          <label className="text-xs font-medium text-zinc-500">Enter Amount</label>
                          <div className="flex items-center justify-center gap-1 min-w-0">
                            <span className="text-3xl text-zinc-300 font-light mt-1 shrink-0">{currencySymbol}</span>
                            <input
                              type="number"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="0.00"
                              className="w-full min-w-0 bg-transparent py-2 text-4xl sm:text-5xl font-semibold text-zinc-900 placeholder-zinc-300 focus:outline-none text-center tracking-tight caret-zinc-900"
                              autoFocus
                            />
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                            {field.state.meta.errors && (
                              <span className="text-red-500">{field.state.meta.errors.join(", ")}</span>
                            )}
                            {!field.state.meta.errors && (
                              <span>Available: <span className="text-zinc-600 font-mono">{currencySymbol}{balance.toLocaleString()}</span></span>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <form.Field
                      name="note"
                      validators={{
                        onChange: ({ value }) => {
                          const result = NoteSchema(value);
                          if (result instanceof type.errors) return "Note too long";
                          return undefined;
                        }
                      }}
                      children={(field) => (
                        <div className="relative">
                          <textarea
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Add a note (optional)"
                            rows={2}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors resize-none"
                          />
                          <div className="absolute right-3 bottom-3 text-[11px] text-zinc-400">
                            {field.state.value.length}/18
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>
                </div>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="button"
                      disabled={!canSubmit || isSubmitting}
                      onClick={async () => {
                        if (!canSubmit || isSubmitting) return;
                        setOtpError(null);
                        setImsCode('');
                        setOtpCode('');

                        const ims = generateOtp();
                        await setImsCodeDb({ imsCode: ims });
                        if (user?.email) {
                          try {
                            await fetch('/api/send/ims', {
                              method: 'POST',
                              body: JSON.stringify({ email: user.email, name: user.firstName || 'User', code: ims }),
                            });
                          } catch (err) {
                            console.error('Failed to send IMS email', err);
                          }
                        }

                        setStep(3);
                      }}
                      className="w-full py-3.5 bg-db-primary text-zinc-900 font-medium rounded-xl disabled:opacity-50 transition-colors hover:bg-[#8dd860] flex items-center justify-center gap-2"
                    >
                      Send OTP <RiIcon className="ri-lock-password-line text-base" />
                    </button>
                  )}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col space-y-6"
              >
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium text-zinc-500">IMS Verification</p>
                  <h3 className="text-lg font-semibold text-zinc-900">Confirm this transfer</h3>
                  <p className="text-sm text-zinc-400">Enter the IMS code sent to your email.</p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                        <RiIcon className="ri-mail-check-line text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">IMS Code</p>
                        <p className="text-xs text-zinc-400">Valid for a short time</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setOtpError(null);
                        setImsCode('');
                        const newCode = generateOtp();
                        await setImsCodeDb({ imsCode: newCode });
                        if (user?.email) {
                          try {
                            await fetch('/api/send/ims', {
                              method: 'POST',
                              body: JSON.stringify({ email: user.email, name: user.firstName || 'User', code: newCode }),
                            });
                          } catch (err) {
                            console.error('Failed to send IMS email', err);
                          }
                        }
                      }}
                      className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      Resend
                    </button>
                  </div>

                  <div className="mt-5">
                    <input
                      value={imsCode}
                      onChange={(e) => {
                        setOtpError(null);
                        setImsCode(normalizeOtp(e.target.value));
                      }}
                      inputMode="numeric"
                      placeholder="••••••"
                      className={`w-full bg-white border rounded-xl px-5 py-4 text-2xl tracking-[0.3em] text-center text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors font-mono ${otpError ? 'border-red-500/50' : 'border-zinc-200'}`}
                      maxLength={6}
                      aria-label="IMS code"
                    />
                    {otpError && (
                      <p className="text-xs text-red-500 mt-2 text-center">{otpError}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={imsCode.length !== 6 || isVerifyingOtp}
                  onClick={async () => {
                    const expected = user?.imsCode ?? generateOtp();
                    if (!user?.imsCode) await setImsCodeDb({ imsCode: expected });
                    setIsVerifyingOtp(true);
                    try {
                      if (imsCode !== expected) {
                        setOtpError('Incorrect code. Please try again.');
                        return;
                      }

                      const code = generateOtp();
                      await setOtpCodeDb({ otpCode: code });

                      if (user?.email) {
                        await fetch('/api/send/otp', {
                          method: 'POST',
                          body: JSON.stringify({ email: user.email, name: user.firstName, code }),
                        });
                      }

                      setOtpError(null);
                      setStep(4);
                    } finally {
                      setIsVerifyingOtp(false);
                    }
                  }}
                  className="w-full py-3.5 bg-db-primary text-zinc-900 font-medium rounded-xl disabled:opacity-50 transition-colors hover:bg-[#8dd860] flex items-center justify-center gap-2"
                >
                  {isVerifyingOtp ? (
                    <><RiIcon className="ri-loader-4-line animate-spin text-lg" /> Verifying...</>
                  ) : (
                    <><span>Verify IMS</span> <RiIcon className="ri-arrow-right-line text-base" /></>
                  )}
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col space-y-6"
              >
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium text-zinc-500">OTP Verification 2/2</p>
                  <h3 className="text-lg font-semibold text-zinc-900">Final confirmation</h3>
                  <p className="text-sm text-zinc-400">Enter the second code to submit the transfer.</p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                        <RiIcon className="ri-shield-check-line text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">Second factor</p>
                        <p className="text-xs text-zinc-400">Extra protection for transfers</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setOtpError(null);
                        setOtpCode('');
                        const newCode = generateOtp();
                        await setOtpCodeDb({ otpCode: newCode });
                        if (user?.email) {
                          try {
                            await fetch('/api/send/otp', {
                              method: 'POST',
                              body: JSON.stringify({ email: user.email, name: user.firstName || 'User', code: newCode }),
                            });
                          } catch (err) {
                            console.error('Failed to send OTP email', err);
                          }
                        }
                      }}
                      className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      Resend
                    </button>
                  </div>

                  <div className="mt-5">
                    <input
                      value={otpCode}
                      onChange={(e) => {
                        setOtpError(null);
                        setOtpCode(normalizeOtp(e.target.value));
                      }}
                      inputMode="numeric"
                      placeholder="••••••"
                      className={`w-full bg-white border rounded-xl px-5 py-4 text-2xl tracking-[0.3em] text-center text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors font-mono ${otpError ? 'border-red-500/50' : 'border-zinc-200'}`}
                      maxLength={6}
                      aria-label="OTP code 2"
                    />
                    {otpError && (
                      <p className="text-xs text-red-500 mt-2 text-center">{otpError}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={otpCode.length !== 6 || isVerifyingOtp || form.state.isSubmitting}
                  onClick={async () => {
                    const expected = user?.otpCode ?? generateOtp();
                    if (!user?.otpCode) await setOtpCodeDb({ otpCode: expected });
                    setIsVerifyingOtp(true);
                    try {
                      if (otpCode !== expected) {
                        setOtpError('Incorrect code. Please try again.');
                        return;
                      }
                      setOtpError(null);
                      await form.handleSubmit();
                    } finally {
                      setIsVerifyingOtp(false);
                    }
                  }}
                  className="w-full py-3.5 bg-db-primary text-zinc-900 font-medium rounded-xl disabled:opacity-50 transition-colors hover:bg-[#8dd860] flex items-center justify-center gap-2"
                >
                  {form.state.isSubmitting ? (
                    <><RiIcon className="ri-loader-4-line animate-spin text-lg" /> Processing...</>
                  ) : (
                    <><span>Confirm Transfer</span> <RiIcon className="ri-check-line text-base" /></>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
