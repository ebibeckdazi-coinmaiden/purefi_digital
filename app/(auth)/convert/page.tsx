'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { Loader2, ArrowDownUp } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { currencies } from '@/app/data/currencies';
import { fetchCurrencies } from '@/lib/currencyService';
import CurrencySelect from '@/app/components/ui/CurrencySelect';

export default function ConvertPage() {
  const accounts = useQuery(api.accounts.getAccounts);
  const convertMutation = useMutation(api.accounts.convertCurrency);
  const createNotification = useMutation(api.notifications.createNotification);

  const [amount, setAmount] = useState<string>('2140');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeRange, setTimeRange] = useState<'1D' | '5D' | '1M' | '1Y'>('1M');

  const availableCurrencies = useMemo(() => {
    if (!accounts) return [];
    return accounts.map(a => a.currency).filter(Boolean) as string[];
  }, [accounts]);

  const fromBalance = useMemo(() => {
    if (!accounts) return 0;
    const account = accounts.find(a => a.currency === fromCurrency);
    return account ? account.balance : 0;
  }, [accounts, fromCurrency]);

  const fromCurrencySymbol = useMemo(() => {
    return currencies.find((c) => c.code === fromCurrency)?.symbol ?? "";
  }, [fromCurrency]);

  useEffect(() => {
    if (availableCurrencies.length === 2) {
        const [c1, c2] = availableCurrencies;
        if (!availableCurrencies.includes(fromCurrency)) setFromCurrency(c1);
        if (!availableCurrencies.includes(toCurrency)) setToCurrency(c2);
        if (fromCurrency === c1 && toCurrency !== c2) setToCurrency(c2);
        if (fromCurrency === c2 && toCurrency !== c1) setToCurrency(c1);
    }
  }, [availableCurrencies, fromCurrency, toCurrency]);

  const handleFromChange = (value: string) => {
    setFromCurrency(value);
    if (availableCurrencies.length === 2) {
        const other = availableCurrencies.find(c => c !== value);
        if (other) setToCurrency(other);
    }
  };

  const handleToChange = (value: string) => {
    setToCurrency(value);
    if (availableCurrencies.length === 2) {
        const other = availableCurrencies.find(c => c !== value);
        if (other) setFromCurrency(other);
    }
  };

  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await fetchCurrencies();
        if (data?.data?.conversion_rates) {
          setRates(data.data.conversion_rates);
        }
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRates();
  }, []);

  const conversionRate = useMemo(() => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return 0;
    return rates[toCurrency] / rates[fromCurrency];
  }, [rates, fromCurrency, toCurrency]);

  const fee = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount * 0.005;
  }, [amount]);

  const totalToConvert = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    return numAmount - fee;
  }, [amount, fee]);

  const finalAmount = useMemo(() => {
    return totalToConvert * conversionRate;
  }, [totalToConvert, conversionRate]);

  const chartData = useMemo(() => {
    const data = [];
    let points = 50;

    switch (timeRange) {
        case '1D': points = 24; break;
        case '5D': points = 60; break;
        case '1M': points = 30; break;
        case '1Y': points = 52; break;
    }

    const baseValue = conversionRate;
    const volatility = 0.005;

    for (let i = 0; i < points; i++) {
      const date = new Date();
      if (timeRange === '1D') {
        date.setHours(date.getHours() - (points - i));
      } else if (timeRange === '1Y') {
        date.setDate(date.getDate() - (points - i) * 7);
      } else {
        date.setDate(date.getDate() - (points - i));
      }

      const randomChange = (Math.random() - 0.5) * volatility * baseValue;
      const trend = Math.sin(i / 5) * 0.002 * baseValue;

      data.push({
        date: date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: timeRange === '1D' ? 'numeric' : undefined
        }),
        value: baseValue + randomChange + trend
      });
    }
    if (data.length > 0) {
        data[data.length - 1].value = conversionRate;
    }
    return data;
  }, [conversionRate, timeRange]);

  const rateChange = useMemo(() => {
    if (chartData.length < 2) return { percent: 0, value: 0 };
    const firstValue = chartData[0]?.value ?? 0;
    const lastValue = chartData[chartData.length - 1]?.value ?? 0;
    const valueChange = lastValue - firstValue;
    const percentChange = firstValue === 0 ? 0 : (valueChange / firstValue) * 100;
    return { percent: percentChange, value: valueChange };
  }, [chartData]);

  const isRateDown = rateChange.percent < 0;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = async () => {
    setError('');
    setSuccess('');
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount > fromBalance) {
      setError('Insufficient balance');
      return;
    }

    setIsConverting(true);
    try {
        await convertMutation({
            fromCurrency,
            toCurrency,
            amount: numAmount,
            finalAmount
        });

        await createNotification({
            title: "Currency Converted",
            message: `Converted ${numAmount.toLocaleString()} ${fromCurrency} to ${finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`,
            type: "alert",
            icon: "ri-exchange-dollar-line",
        });

        setSuccess(`Successfully converted ${numAmount} ${fromCurrency} to ${finalAmount.toFixed(2)} ${toCurrency}`);
        setAmount('');
    } catch (err) {
        console.error(err);
        setError('Conversion failed. Please try again.');
    } finally {
        setIsConverting(false);
    }
  };

  const getCurrencyName = (code: string) => {
    return currencies.find(c => c.code === code)?.name || code;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (accounts === undefined) {
    return (
      <div className="p-6 md:p-12 max-w-7xl mx-auto w-full animate-pulse">
        <div className="mb-10">
          <div className="h-8 w-72 rounded-lg bg-zinc-200" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <div className="h-20 w-full bg-zinc-100 rounded-xl mb-4" />
              <div className="h-14 w-full bg-zinc-100 rounded-xl mb-6" />
              <div className="h-12 w-full bg-zinc-100 rounded-xl" />
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <div className="h-4 w-32 bg-zinc-100 rounded mb-4" />
              <div className="h-36 w-full bg-zinc-100 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <div className="h-5 w-56 bg-zinc-100 rounded mb-4" />
              <div className="h-64 w-full bg-zinc-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Convert currency</h1>
          <p className="text-zinc-500 mt-1.5 text-sm">Exchange between your accounts at the live market rate</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Conversion Input */}
          <div className="lg:col-span-5 space-y-6">

            {/* Main Input Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-2">

              {/* FROM Input */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-colors focus-within:border-db-primary">
                <label className="text-zinc-500 text-xs font-medium">Convert</label>
                <div className="flex items-center justify-between mt-2">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) setAmount(val);
                    }}
                    className="bg-transparent text-2xl sm:text-3xl font-semibold text-zinc-900 outline-none w-full min-w-0 placeholder-zinc-400 tracking-tight"
                    placeholder="0.00"
                  />
                  <div className="w-24 sm:w-27.5 shrink-0">
                    <CurrencySelect
                      value={fromCurrency}
                      onChange={handleFromChange}
                      showLabel={false}
                      variant="minimal"
                      restrictTo={availableCurrencies}
                    />
                  </div>
                </div>
              </div>

              {/* Balance Info */}
              <div className="mt-3 mb-6 px-1">
                <p className="text-zinc-500 text-sm">
                  You have <span className="text-zinc-700 font-medium">{fromCurrencySymbol}{fromBalance.toLocaleString()}</span> available
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-700 font-medium">{fromCurrencySymbol}{fee.toFixed(2)}</span>
                  <span className="text-zinc-500">Our fee</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-700 font-medium">{fromCurrencySymbol}{totalToConvert.toFixed(2)}</span>
                  <span className="text-zinc-500">Total to convert</span>
                </div>
                <div className="border-t border-zinc-100 pt-3 flex justify-between items-center text-sm">
                  <span className="text-db-primary font-semibold">{conversionRate.toFixed(6)}</span>
                  <span className="text-zinc-500">Live rate</span>
                </div>
              </div>

              {/* TO Input */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-colors relative">
                <div className="absolute left-1/2 -top-3.5 -translate-x-1/2">
                  <button
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:border-zinc-300 hover:text-zinc-700 transition-colors text-zinc-400"
                    title="Swap currencies"
                  >
                    <ArrowDownUp className="w-3.5 h-3.5" />
                  </button>
                </div>
                <label className="text-zinc-500 text-xs font-medium">To</label>
                <div className="flex items-center justify-between mt-2">
                  <input
                    type="text"
                    readOnly
                    value={finalAmount.toFixed(2)}
                    className="bg-transparent text-2xl sm:text-3xl font-semibold text-zinc-900 outline-none w-full min-w-0 placeholder-zinc-400 tracking-tight"
                  />
                  <div className="w-24 sm:w-27.5 shrink-0">
                    <CurrencySelect
                      value={toCurrency}
                      onChange={handleToChange}
                      showLabel={false}
                      variant="minimal"
                      restrictTo={availableCurrencies}
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                {success && <p className="text-emerald-600 text-sm mb-3 text-center">{success}</p>}
                <button
                  onClick={handleConvert}
                  disabled={isConverting || isLoading}
                  className="w-full py-3.5 bg-db-primary text-zinc-900 font-semibold rounded-xl text-base hover:bg-[#8dd860] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Chart & Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-full flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-zinc-900 mb-6">
                  {getCurrencyName(fromCurrency)} to {getCurrencyName(toCurrency)}
                </h2>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-zinc-900 tracking-tight">
                    {conversionRate.toFixed(4)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${isRateDown ? 'text-red-500' : 'text-emerald-600'} text-sm font-medium flex items-center gap-1`}
                    >
                      <span>{isRateDown ? '↓' : '↑'}</span>
                      {Math.abs(rateChange.percent).toFixed(2)}%
                    </span>
                    <span className={`${isRateDown ? 'text-red-500' : 'text-emerald-600'} text-sm`}>
                      {isRateDown ? '-' : '+'}
                      {Math.abs(rateChange.value).toFixed(4)} {timeRange}
                    </span>
                  </div>
                </div>

                <div className="text-zinc-400 text-xs flex gap-2">
                  <span>{new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })} UTC</span>
                  <span>•</span>
                  <span className="underline cursor-pointer hover:text-zinc-600 transition-colors">Disclaimer</span>
                </div>
              </div>

              {/* Time Range Selector */}
              <div className="flex gap-1 mb-8">
                {(['1D', '5D', '1M', '1Y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      timeRange === range
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div className="flex-1 min-h-87.5 w-full rounded-2xl border border-zinc-200 bg-white p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9fe870" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#9fe870" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#18181b', fontWeight: 600, fontSize: '14px' }}
                      labelStyle={{ color: '#71717a', marginBottom: '4px', fontSize: '12px' }}
                      formatter={(value) => [Number(value).toFixed(4), '']}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#a1a1aa', fontSize: 12 }}
                      dy={10}
                      minTickGap={30}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      hide
                    />
                    <CartesianGrid vertical={false} stroke="#f4f4f5" strokeDasharray="4 4" />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#9fe870"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
