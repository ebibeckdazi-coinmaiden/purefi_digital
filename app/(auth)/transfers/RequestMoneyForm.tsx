/* eslint-disable react/no-children-prop */
'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { type } from 'arktype';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { currencies } from '@/app/data/currencies';
import RiIcon from '@/app/components/ui/RiIcon';
import { api } from '@/convex/_generated/api';

// --- ArkType Schemas ---
const AmountSchema = type("number > 0").describe("Amount must be positive");
const NoteSchema = type("string <= 18").describe("Note must be 18 characters or less");

interface RequestMoneyFormProps {
  localAccountId: Id<"bank_accounts">;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const getCurrencySymbol = (currencyCode: string = 'USD') => {
  return currencies.find(c => c.code === currencyCode)?.symbol || '$';
};

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

export default function RequestMoneyForm({
  localAccountId,
  currency = 'USD',
  onSuccess,
  onCancel,
}: RequestMoneyFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const currencySymbol = getCurrencySymbol(currency);

  const createTransfer = useMutation(api.transfers.createTransfer);
  const createNotification = useMutation(api.notifications.createNotification);

  const goBack = () => {
    if (step === 1) {
      onCancel();
      return;
    }
    setStep(1);
  };

  const form = useForm({
    defaultValues: {
      recipient: '',
      amount: '',
      note: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const amount = parseFloat(value.amount);
        await createTransfer({
          recipient: value.recipient,
          amount,
          note: value.note,
          type: 'request',
          fromAccountId: localAccountId,
        });

        await createNotification({
          title: "Request Sent",
          message: `You requested ${currencySymbol}${value.amount} from ${value.recipient}`,
          type: "info",
          icon: "ri-hand-coin-line",
        });

        onSuccess();
      } catch (error) {
        console.error('Request failed', error);
      }
    },
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200">

      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
        <button
          type="button"
          onClick={goBack}
          className="w-11 h-11 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors"
        >
          <RiIcon className="ri-arrow-left-line text-lg" />
        </button>
        <h2 className="text-sm font-semibold text-zinc-900">Request Money</h2>
        <div className="w-9" />
      </div>

      <div className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col"
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
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Request From (Email)</label>
                  <form.Field
                    name="recipient"
                    children={(field) => (
                      <div className="relative">
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={() => field.handleBlur()}
                          placeholder="user@example.com"
                          className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                          <RiIcon className="ri-mail-line text-lg" />
                        </div>
                      </div>
                    )}
                  />
                </div>

                <form.Subscribe
                  selector={(state) => [state.values.recipient]}
                  children={([recipient]) => (
                    <button
                      type="button"
                      onClick={() => { if (validateEmail(recipient)) setStep(2); }}
                      disabled={!validateEmail(recipient)}
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
                  selector={(state) => [state.values.recipient]}
                  children={([recipient]) => (
                    <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-db-primary-subtle flex items-center justify-center text-db-primary">
                          <RiIcon className="ri-hand-coin-line text-lg" />
                        </div>
                        <div>
                          <p className="text-[11px] text-zinc-500 font-medium">Request From</p>
                          <p className="text-sm font-semibold text-zinc-900 truncate max-w-50">{recipient}</p>
                        </div>
                      </div>
                    </div>
                  )}
                />

                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <form.Field
                      name="amount"
                      validators={{
                        onChange: ({value}) => {
                          const result = AmountSchema(parseFloat(value));
                          if (value && result instanceof type.errors) return "Invalid amount";
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
                          {field.state.meta.errors && (
                            <div className="flex justify-center">
                              <span className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <form.Field
                      name="note"
                      validators={{
                        onChange: ({value}) => {
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
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full py-3.5 bg-db-primary text-zinc-900 font-medium rounded-xl disabled:opacity-50 transition-colors hover:bg-[#8dd860] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><RiIcon className="ri-loader-4-line animate-spin text-lg" /> Processing...</>
                      ) : (
                        <><span>Send Request</span> <RiIcon className="ri-send-plane-fill text-base" /></>
                      )}
                    </button>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
