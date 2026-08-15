// 'use client';

// import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
// import { useQuery, useMutation } from 'convex/react';
// import { motion } from 'framer-motion';
// import { AreaChart, Area, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import { api } from '@/convex/_generated/api';
// import { CustomAvatar } from '@/app/components/ui/CustomAvatar';
// import Dialog from '@/app/components/ui/Dialog';
// import { useRouter } from 'next/navigation';
// import { currencies } from '@/app/data/currencies';
// import { fetchCurrencies } from '@/lib/currencyService';
// import RiIcon from '@/app/components/ui/RiIcon';

// type StockQuote = {
//     price: number;
//     changePercent: number;
//     changeValue: number;
//     isPositive: boolean;
//     name?: string; // Optional name for chart X-axis
// };


// type StockItemBase = {
//     name: string;
//     symbol: string;
//     apiSymbol?: string;
//     price: number;
//     change: string;
//     isPositive: boolean;
//     color?: string;
//     icon?: string;
//     data?: number[];
// };

// type AlphaVantageDailyResponse = {
//     'Error Message'?: string;
//     Note?: string;
//     'Time Series (Daily)'?: Record<string, Record<string, string | undefined> | undefined>;
// };

// type AlphaVantageIntradayResponse = {
//     'Error Message'?: string;
//     Note?: string;
//     'Time Series (5min)'?: Record<string, Record<string, string | undefined> | undefined>;
// };

// type AlphaVantageWeeklyResponse = {
//     'Error Message'?: string;
//     Note?: string;
//     'Weekly Time Series'?: Record<string, Record<string, string | undefined> | undefined>;
// };

// type AlphaVantageMonthlyResponse = {
//     'Error Message'?: string;
//     Note?: string;
//     'Monthly Time Series'?: Record<string, Record<string, string | undefined> | undefined>;
// };

// type AlphaVantageGlobalQuoteResponse = {
//     'Error Message'?: string;
//     Note?: string;
//     'Global Quote'?: Record<string, string | undefined>;
// };

// type AlphaVantageCompanyOverview = {
//     Symbol?: string;
//     Name?: string;
//     Description?: string;
//     Exchange?: string;
//     Currency?: string;
//     Sector?: string;
//     Industry?: string;
//     MarketCapitalization?: string;
// };

// type AlphaVantageCompanyProfile = {
//     symbol?: string;
//     companyName?: string;
//     currency?: string;
//     exchange?: string;
//     industry?: string;
//     sector?: string;
//     description?: string;
//     marketCap?: number;
// };

// const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co';
// const AV_DEBUG = process.env.NODE_ENV !== 'production';
// const getAlphaVantageApiKey = () =>
//     process.env.NEXT_PUBLIC_ALPHA_API_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';

// function buildAlphaVantageUrl(params: Record<string, string>) {
//     const url = new URL('/query', ALPHA_VANTAGE_BASE_URL);
//     const search = new URLSearchParams();
//     for (const [key, value] of Object.entries(params)) search.set(key, value);
//     search.set('apikey', getAlphaVantageApiKey());
//     url.search = search.toString();
//     return url.toString();
// }

// function mockBaseFromSymbol(symbol: string) {
//     let hash = 0;
//     for (let i = 0; i < symbol.length; i++) hash = (hash * 31 + symbol.charCodeAt(i)) % 100000;
//     return 20 + (hash % 980);
// }

// function getStockLogoUrl(symbol: string) {
//     const normalized = symbol.replace('.', '-');
//     return `https://images.financialmodelingprep.com/symbol/${encodeURIComponent(normalized)}.png`;
// }

// function generateDefaultSeries(basePrice: number = 700): StockQuote[] {
//     return Array.from({ length: 20 }, (_, i) => {
//         // Generate a random variation between -2% and +2%
//         const variation = (Math.random() * 0.04) - 0.02;
//         const price = Number((basePrice * (1 + variation)).toFixed(2));
//         return {
//             name: String(i),
//             price: price,
//             changePercent: 0,
//             changeValue: 0,
//             isPositive: true
//         };
//     });
// }

// let avRequestChain: Promise<void> = Promise.resolve();
// let avLastRequestAt = 0;

// async function runWithAlphaVantageRateLimit<T>(fn: () => Promise<T>): Promise<T> {
//     const run = avRequestChain.then(async () => {
//         const minIntervalMs = 5000;
//         const now = Date.now();
//         const waitMs = Math.max(0, minIntervalMs - (now - avLastRequestAt));
//         if (waitMs > 0) await new Promise((r) => setTimeout(r, waitMs));
//         avLastRequestAt = Date.now();
//         return fn();
//     });

//     avRequestChain = run.then(
//         () => undefined,
//         () => undefined,
//     );

//     return run;
// }

// async function fetchAlphaVantageWeeklySeries(symbol: string, points?: number): Promise<StockQuote[] | null> {
//     const url = buildAlphaVantageUrl({
//         function: 'TIME_SERIES_WEEKLY',
//         symbol,
//     });

//     return runWithAlphaVantageRateLimit(async () => {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) {
//             if (AV_DEBUG) console.error('AV_WEEKLY_ERROR', symbol, res.status, await res.text());
//             return null;
//         }
//         const json = (await res.json()) as AlphaVantageWeeklyResponse;
//         if (AV_DEBUG) console.debug('AV_WEEKLY_DATA', symbol, json);
//         if (json['Error Message'] || json.Note) return null;
//         const series = json['Weekly Time Series'];
//         if (!series) return null;

//         const datesDesc = Object.keys(series).sort((a, b) => (a < b ? 1 : -1));
//         const latest = points ? datesDesc.slice(0, points) : datesDesc;
//         const oldestFirst = [...latest].reverse();

//         const pointsParsed: StockQuote[] = [];
//         for (let i = 0; i < oldestFirst.length; i++) {
//             const date = oldestFirst[i];
//             const row = series[date];
//             const closeStr = row?.['4. close'];
//             const close = closeStr ? Number(closeStr) : NaN;
            
//             if (!Number.isFinite(close)) continue;

//             let changeValue = 0;
//             let changePercent = 0;

//             if (i > 0) {
//                 const prevDate = oldestFirst[i - 1];
//                 const prevRow = series[prevDate];
//                 const prevClose = prevRow?.['4. close'] ? Number(prevRow['4. close']) : NaN;
//                 if (Number.isFinite(prevClose) && prevClose !== 0) {
//                     changeValue = close - prevClose;
//                     changePercent = (changeValue / prevClose) * 100;
//                 }
//             }

//             pointsParsed.push({
//                 name: date,
//                 price: close,
//                 changeValue,
//                 changePercent,
//                 isPositive: changeValue >= 0
//             });
//         }

//         return pointsParsed.length >= 2 ? pointsParsed : null;
//     });
// }

// async function fetchAlphaVantageMonthlySeries(symbol: string): Promise<StockQuote[] | null> {
//     const url = buildAlphaVantageUrl({
//         function: 'TIME_SERIES_MONTHLY',
//         symbol,
//     });

//     return runWithAlphaVantageRateLimit(async () => {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) {
//             if (AV_DEBUG) console.error('AV_MONTHLY_ERROR', symbol, res.status, await res.text());
//             return null;
//         }
//         const json = (await res.json()) as AlphaVantageMonthlyResponse;
//         if (AV_DEBUG) console.debug('AV_MONTHLY_DATA', symbol, json);
//         if (json['Error Message'] || json.Note) return null;
//         const series = json['Monthly Time Series'];
//         if (!series) return null;

//         const datesDesc = Object.keys(series).sort((a, b) => (a < b ? 1 : -1));
//         const oldestFirst = [...datesDesc].reverse();

//         const pointsParsed: StockQuote[] = [];
//         for (let i = 0; i < oldestFirst.length; i++) {
//             const date = oldestFirst[i];
//             const row = series[date];
//             const closeStr = row?.['4. close'];
//             const close = closeStr ? Number(closeStr) : NaN;

//              if (!Number.isFinite(close)) continue;

//             let changeValue = 0;
//             let changePercent = 0;

//             if (i > 0) {
//                 const prevDate = oldestFirst[i - 1];
//                 const prevRow = series[prevDate];
//                 const prevClose = prevRow?.['4. close'] ? Number(prevRow['4. close']) : NaN;
//                 if (Number.isFinite(prevClose) && prevClose !== 0) {
//                     changeValue = close - prevClose;
//                     changePercent = (changeValue / prevClose) * 100;
//                 }
//             }

//              pointsParsed.push({
//                 name: date,
//                 price: close,
//                 changeValue,
//                 changePercent,
//                 isPositive: changeValue >= 0
//             });
//         }

//         return pointsParsed.length >= 2 ? pointsParsed : null;
//     });
// }

// async function fetchAlphaVantageIntradaySeries(symbol: string): Promise<StockQuote[] | null> {
//     const url = buildAlphaVantageUrl({
//         function: 'TIME_SERIES_INTRADAY',
//         symbol,
//         interval: '5min',
//         outputsize: 'compact',
//     });

//     return runWithAlphaVantageRateLimit(async () => {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) {
//             if (AV_DEBUG) console.error('AV_INTRADAY_ERROR', symbol, res.status, await res.text());
//             return null;
//         }
//         const json = (await res.json()) as AlphaVantageIntradayResponse;
//         if (AV_DEBUG) console.debug('AV_INTRADAY_DATA', symbol, json);
//         if (json['Error Message'] || json.Note) return null;
//         const series = json['Time Series (5min)'];
//         if (!series) return null;

//         const datesDesc = Object.keys(series).sort((a, b) => (a < b ? 1 : -1));
//         // Get last trading day (approx 78 points for 5min interval from 9:30 to 16:00)
//         // Compact returns 100 points, so we slice to cover the trading day
//         const latest = datesDesc.slice(0, 78);
//         const oldestFirst = [...latest].reverse();

//         const pointsParsed: StockQuote[] = [];
//          for (let i = 0; i < oldestFirst.length; i++) {
//             const date = oldestFirst[i];
//             const row = series[date];
//             const closeStr = row?.['4. close'];
//             const close = closeStr ? Number(closeStr) : NaN;
//             // Format time: "2023-10-27 16:00:00" -> "16:00"
//             const timeStr = date.split(' ')[1]?.substring(0, 5) || date;

//              if (!Number.isFinite(close)) continue;

//             let changeValue = 0;
//             let changePercent = 0;

//             if (i > 0) {
//                 const prevDate = oldestFirst[i - 1];
//                 const prevRow = series[prevDate];
//                 const prevClose = prevRow?.['4. close'] ? Number(prevRow['4. close']) : NaN;
//                 if (Number.isFinite(prevClose) && prevClose !== 0) {
//                     changeValue = close - prevClose;
//                     changePercent = (changeValue / prevClose) * 100;
//                 }
//             }

//              pointsParsed.push({
//                 name: timeStr,
//                 price: close,
//                 changeValue,
//                 changePercent,
//                 isPositive: changeValue >= 0
//             });
//         }

//         return pointsParsed.length >= 2 ? pointsParsed : null;
//     });
// }

// async function fetchAlphaVantageDailySeries(symbol: string, points: number): Promise<StockQuote[] | null> {
//     const url = buildAlphaVantageUrl({
//         function: 'TIME_SERIES_DAILY',
//         symbol,
//         outputsize: 'compact',
//     });

//     return runWithAlphaVantageRateLimit(async () => {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) {
//             if (AV_DEBUG) console.error('AV_DAILY_ERROR', symbol, res.status, await res.text());
//             return null;
//         }
//         const json = (await res.json()) as AlphaVantageDailyResponse;
//         if (AV_DEBUG) console.debug('AV_DAILY_DATA', symbol, json);
//         if (json['Error Message'] || json.Note) return null;
//         const series = json['Time Series (Daily)'];
//         if (!series) return null;

//         const datesDesc = Object.keys(series).sort((a, b) => (a < b ? 1 : -1));
//         const latest = datesDesc.slice(0, Math.max(points, 2));
//         const oldestFirst = [...latest].reverse();

//         const pointsParsed: StockQuote[] = [];
//         for (let i = 0; i < oldestFirst.length; i++) {
//             const date = oldestFirst[i];
//             const row = series[date];
//             const closeStr = row?.['4. close'];
//             const close = closeStr ? Number(closeStr) : NaN;

//              if (!Number.isFinite(close)) continue;

//             let changeValue = 0;
//             let changePercent = 0;

//             if (i > 0) {
//                 const prevDate = oldestFirst[i - 1];
//                 const prevRow = series[prevDate];
//                 const prevClose = prevRow?.['4. close'] ? Number(prevRow['4. close']) : NaN;
//                 if (Number.isFinite(prevClose) && prevClose !== 0) {
//                     changeValue = close - prevClose;
//                     changePercent = (changeValue / prevClose) * 100;
//                 }
//             }

//              pointsParsed.push({
//                 name: date,
//                 price: close,
//                 changeValue,
//                 changePercent,
//                 isPositive: changeValue >= 0
//             });
//         }

//         return pointsParsed.length >= 2 ? pointsParsed : null;
//     });
// }

// async function fetchAlphaVantageCompanyOverview(symbol: string): Promise<AlphaVantageCompanyProfile | null> {
//     const url = buildAlphaVantageUrl({ function: 'OVERVIEW', symbol });

//     return runWithAlphaVantageRateLimit(async () => {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) {
//             if (AV_DEBUG) console.error('AV_OVERVIEW_ERROR', symbol, res.status, await res.text());
//             return null;
//         }
//         const json = (await res.json()) as AlphaVantageCompanyOverview & { Note?: string };
//         if (AV_DEBUG) console.debug('AV_OVERVIEW_DATA', symbol, json);
//         if (json.Note || !json.Symbol) return null;

//         const marketCapNum = json.MarketCapitalization ? Number(json.MarketCapitalization) : NaN;

//         return {
//             symbol: json.Symbol,
//             companyName: json.Name,
//             description: json.Description,
//             exchange: json.Exchange,
//             currency: json.Currency,
//             sector: json.Sector,
//             industry: json.Industry,
//             marketCap: Number.isFinite(marketCapNum) ? marketCapNum : undefined,
//         };
//     });
// }

// async function fetchAlphaVantageQuote(symbol: string): Promise<StockQuote | null> {
//     const url = buildAlphaVantageUrl({ function: 'GLOBAL_QUOTE', symbol });

//     return runWithAlphaVantageRateLimit(async () => {
//         const res = await fetch(url, { cache: 'no-store' });
//         if (!res.ok) {
//             if (AV_DEBUG) console.error('AV_QUOTE_ERROR', symbol, res.status, await res.text());
//             return null;
//         }
//         const json = (await res.json()) as AlphaVantageGlobalQuoteResponse;
//         if (AV_DEBUG) console.debug('AV_QUOTE_DATA', symbol, json);
//         if (json['Error Message'] || json.Note) return null;

//         const row = json['Global Quote'];
//         const priceRaw = row?.['05. price'];
//         const changeRaw = row?.['09. change'];
//         const changePercentRaw = row?.['10. change percent'];

//         const price = priceRaw ? Number(priceRaw) : NaN;
//         const changeValue = changeRaw ? Number(changeRaw) : NaN;
//         const changePercent = changePercentRaw ? Number(String(changePercentRaw).replace('%', '')) : NaN;

//         if (!Number.isFinite(price)) return null;

//         const resolvedChangeValue = Number.isFinite(changeValue) ? changeValue : 0;
//         const resolvedChangePercent = Number.isFinite(changePercent)
//             ? changePercent
//             : price === 0
//                 ? 0
//                 : (resolvedChangeValue / price) * 100;

//         return {
//             price,
//             changePercent: resolvedChangePercent,
//             changeValue: resolvedChangeValue,
//             isPositive: resolvedChangePercent >= 0,
//         };
//     });
// }

// function formatMarketCap(value?: number) {
//     if (typeof value !== 'number' || !Number.isFinite(value)) return null;
//     const abs = Math.abs(value);
//     if (abs >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
//     if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
//     if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
//     return value.toLocaleString();
// }

// function quoteFromDailySeries(series: StockQuote[]): StockQuote | null {
//     if (series.length < 2) return null;
//     const last = series[series.length - 1];
//     return last;
// }

// const FEATURED_INVESTMENTS: StockItemBase[] = [
//     {
//         name: 'Apple Inc.',
//         symbol: 'AAPL',
//         apiSymbol: 'AAPL',
//         price: mockBaseFromSymbol('AAPL'),
//         change: '—',
//         isPositive: true,
//         color: 'from-gray-500 to-gray-600',
//         icon: 'ri-apple-fill',
//     },
//     {
//         name: 'Microsoft Corp',
//         symbol: 'MSFT',
//         apiSymbol: 'MSFT',
//         price: mockBaseFromSymbol('MSFT'),
//         change: '—',
//         isPositive: true,
//         color: 'from-blue-500 to-blue-600',
//         icon: 'ri-windows-fill',
//     },
//     {
//         name: 'Nvidia Corp',
//         symbol: 'NVDA',
//         apiSymbol: 'NVDA',
//         price: mockBaseFromSymbol('NVDA'),
//         change: '—',
//         isPositive: true,
//         color: 'from-green-500 to-green-600',
//         icon: 'ri-cpu-fill',
//     },
// ];

// const WATCHLIST: StockItemBase[] = [
//     { name: 'Apple Inc.', symbol: 'AAPL', apiSymbol: 'AAPL', price: mockBaseFromSymbol('AAPL'), change: '—', isPositive: true },
//     { name: 'Microsoft Corp', symbol: 'MSFT', apiSymbol: 'MSFT', price: mockBaseFromSymbol('MSFT'), change: '—', isPositive: true },
//     { name: 'Nvidia Corp', symbol: 'NVDA', apiSymbol: 'NVDA', price: mockBaseFromSymbol('NVDA'), change: '—', isPositive: true },
//     { name: 'Amazon.com Inc', symbol: 'AMZN', apiSymbol: 'AMZN', price: mockBaseFromSymbol('AMZN'), change: '—', isPositive: true },
//     { name: 'Meta Platforms Inc', symbol: 'META', apiSymbol: 'META', price: mockBaseFromSymbol('META'), change: '—', isPositive: true },
//     { name: 'Alphabet Inc Class A', symbol: 'GOOGL', apiSymbol: 'GOOGL', price: mockBaseFromSymbol('GOOGL'), change: '—', isPositive: true },
//     { name: 'Alphabet Inc Class C', symbol: 'GOOG', apiSymbol: 'GOOG', price: mockBaseFromSymbol('GOOG'), change: '—', isPositive: true },
//     { name: 'Tesla Inc', symbol: 'TSLA', apiSymbol: 'TSLA', price: mockBaseFromSymbol('TSLA'), change: '—', isPositive: true },
//     { name: 'Berkshire Hathaway Class B', symbol: 'BRK.B', apiSymbol: 'BRK.B', price: mockBaseFromSymbol('BRK.B'), change: '—', isPositive: true },
//     { name: 'JPMorgan Chase & Co', symbol: 'JPM', apiSymbol: 'JPM', price: mockBaseFromSymbol('JPM'), change: '—', isPositive: true },
//     { name: 'Visa Inc', symbol: 'V', apiSymbol: 'V', price: mockBaseFromSymbol('V'), change: '—', isPositive: true },
//     { name: 'UnitedHealth Group', symbol: 'UNH', apiSymbol: 'UNH', price: mockBaseFromSymbol('UNH'), change: '—', isPositive: true },
//     { name: 'Procter & Gamble Co', symbol: 'PG', apiSymbol: 'PG', price: mockBaseFromSymbol('PG'), change: '—', isPositive: true },
//     { name: 'Johnson & Johnson', symbol: 'JNJ', apiSymbol: 'JNJ', price: mockBaseFromSymbol('JNJ'), change: '—', isPositive: true },
//     { name: 'Home Depot', symbol: 'HD', apiSymbol: 'HD', price: mockBaseFromSymbol('HD'), change: '—', isPositive: true },
//     { name: 'Mastercard Inc', symbol: 'MA', apiSymbol: 'MA', price: mockBaseFromSymbol('MA'), change: '—', isPositive: true },
//     { name: 'Exxon Mobil Corp', symbol: 'XOM', apiSymbol: 'XOM', price: mockBaseFromSymbol('XOM'), change: '—', isPositive: true },
//     { name: 'AbbVie Inc', symbol: 'ABBV', apiSymbol: 'ABBV', price: mockBaseFromSymbol('ABBV'), change: '—', isPositive: true },
//     { name: 'Bank of America', symbol: 'BAC', apiSymbol: 'BAC', price: mockBaseFromSymbol('BAC'), change: '—', isPositive: true },
//     { name: 'Coca-Cola Co', symbol: 'KO', apiSymbol: 'KO', price: mockBaseFromSymbol('KO'), change: '—', isPositive: true },
//     { name: 'Pfizer Inc', symbol: 'PFE', apiSymbol: 'PFE', price: mockBaseFromSymbol('PFE'), change: '—', isPositive: true },
//     { name: 'Chevron Corp', symbol: 'CVX', apiSymbol: 'CVX', price: mockBaseFromSymbol('CVX'), change: '—', isPositive: true },
//     { name: 'Eli Lilly & Co', symbol: 'LLY', apiSymbol: 'LLY', price: mockBaseFromSymbol('LLY'), change: '—', isPositive: true },
//     { name: 'Costco Wholesale', symbol: 'COST', apiSymbol: 'COST', price: mockBaseFromSymbol('COST'), change: '—', isPositive: true },
//     { name: 'Netflix Inc', symbol: 'NFLX', apiSymbol: 'NFLX', price: mockBaseFromSymbol('NFLX'), change: '—', isPositive: true },
//     { name: 'Adobe Inc', symbol: 'ADBE', apiSymbol: 'ADBE', price: mockBaseFromSymbol('ADBE'), change: '—', isPositive: true },
//     { name: 'Comcast Corp', symbol: 'CMCSA', apiSymbol: 'CMCSA', price: mockBaseFromSymbol('CMCSA'), change: '—', isPositive: true },
//     { name: 'Oracle Corp', symbol: 'ORCL', apiSymbol: 'ORCL', price: mockBaseFromSymbol('ORCL'), change: '—', isPositive: true },
//     { name: 'Nike Inc', symbol: 'NKE', apiSymbol: 'NKE', price: mockBaseFromSymbol('NKE'), change: '—', isPositive: true },
//     { name: 'Verizon Communications', symbol: 'VZ', apiSymbol: 'VZ', price: mockBaseFromSymbol('VZ'), change: '—', isPositive: true },
//     { name: 'AT&T Inc', symbol: 'T', apiSymbol: 'T', price: mockBaseFromSymbol('T'), change: '—', isPositive: true },
//     { name: 'Walmart Inc', symbol: 'WMT', apiSymbol: 'WMT', price: mockBaseFromSymbol('WMT'), change: '—', isPositive: true },
//     { name: 'Merck & Co', symbol: 'MRK', apiSymbol: 'MRK', price: mockBaseFromSymbol('MRK'), change: '—', isPositive: true },
//     { name: 'Morgan Stanley', symbol: 'MS', apiSymbol: 'MS', price: mockBaseFromSymbol('MS'), change: '—', isPositive: true },
//     { name: 'Texas Instruments', symbol: 'TXN', apiSymbol: 'TXN', price: mockBaseFromSymbol('TXN'), change: '—', isPositive: true },
//     { name: 'Qualcomm Inc', symbol: 'QCOM', apiSymbol: 'QCOM', price: mockBaseFromSymbol('QCOM'), change: '—', isPositive: true },
//     { name: 'Charles Schwab', symbol: 'SCHW', apiSymbol: 'SCHW', price: mockBaseFromSymbol('SCHW'), change: '—', isPositive: true },
//     { name: 'Salesforce', symbol: 'CRM', apiSymbol: 'CRM', price: mockBaseFromSymbol('CRM'), change: '—', isPositive: true },
//     { name: 'Danaher Corp', symbol: 'DHR', apiSymbol: 'DHR', price: mockBaseFromSymbol('DHR'), change: '—', isPositive: true },
//     { name: 'Abbott Laboratories', symbol: 'ABT', apiSymbol: 'ABT', price: mockBaseFromSymbol('ABT'), change: '—', isPositive: true },
//     { name: 'American Express', symbol: 'AXP', apiSymbol: 'AXP', price: mockBaseFromSymbol('AXP'), change: '—', isPositive: true },
//     { name: 'Accenture', symbol: 'ACN', apiSymbol: 'ACN', price: mockBaseFromSymbol('ACN'), change: '—', isPositive: true },
//     { name: 'Advanced Micro Devices', symbol: 'AMD', apiSymbol: 'AMD', price: mockBaseFromSymbol('AMD'), change: '—', isPositive: true },
//     { name: 'Amgen', symbol: 'AMGN', apiSymbol: 'AMGN', price: mockBaseFromSymbol('AMGN'), change: '—', isPositive: true },
//     { name: 'BlackRock', symbol: 'BLK', apiSymbol: 'BLK', price: mockBaseFromSymbol('BLK'), change: '—', isPositive: true },
//     { name: 'American International Group', symbol: 'AIG', apiSymbol: 'AIG', price: mockBaseFromSymbol('AIG'), change: '—', isPositive: true },
//     { name: 'BNY Mellon', symbol: 'BK', apiSymbol: 'BK', price: mockBaseFromSymbol('BK'), change: '—', isPositive: true },
//     { name: 'American Tower', symbol: 'AMT', apiSymbol: 'AMT', price: mockBaseFromSymbol('AMT'), change: '—', isPositive: true },
//     { name: 'Align Technology', symbol: 'ALGN', apiSymbol: 'ALGN', price: mockBaseFromSymbol('ALGN'), change: '—', isPositive: true },
// ];


export default function InvestmentsPage() {
    // const user = useQuery(api.user.user);
    // const investments = useQuery(api.investments.getInvestments);
    // const accounts = useQuery(api.accounts.getAccounts);
    // const [selectedStock, setSelectedStock] = useState<StockItemBase | null>(null);
    // const [quotesBySymbol, setQuotesBySymbol] = useState<Record<string, StockQuote>>({});
    // const quotesBySymbolRef = useRef(quotesBySymbol);
    // const fetchingSymbolsRef = useRef<Set<string>>(new Set());
    // const [rates, setRates] = useState<Record<string, number>>({});

    // const displayCurrency =
    //     accounts?.find((a) => a.type === 'local' || a.kind === 'local')?.currency || 'USD';
    // const currencySymbol = currencies.find((c) => c.code === displayCurrency)?.symbol || '$';

    // useEffect(() => {
    //     const loadRates = async () => {
    //         try {
    //             const data = await fetchCurrencies();
    //             const nextRates = data?.data?.conversion_rates;
    //             if (nextRates) setRates(nextRates);
    //         } catch {
    //             setRates({});
    //         }
    //     };
    //     void loadRates();
    // }, []);

    // const getFxRate = useCallback(
    //     (fromCurrency: string, toCurrency: string) => {
    //         const from = rates[fromCurrency];
    //         const to = rates[toCurrency];
    //         if (!from || !to) return 1;
    //         return to / from;
    //     },
    //     [rates],
    // );

    // const convertToLocal = useCallback(
    //     (amount: number, fromCurrency: string) => {
    //         return amount * getFxRate(fromCurrency, displayCurrency);
    //     },
    //     [displayCurrency, getFxRate],
    // );

    // const formatLocalMoney = useCallback((amount: number, fractionDigits = 2) => {
    //     return `${currencySymbol}${amount.toLocaleString(undefined, {
    //         minimumFractionDigits: fractionDigits,
    //         maximumFractionDigits: fractionDigits,
    //     })}`;
    // }, [currencySymbol]);

    // const formatMoney = useCallback(
    //     (amount: number, fromCurrency: string, fractionDigits = 2) => {
    //         return formatLocalMoney(convertToLocal(amount, fromCurrency), fractionDigits);
    //     },
    //     [convertToLocal, formatLocalMoney],
    // );

    // useEffect(() => {
    //     quotesBySymbolRef.current = quotesBySymbol;
    // }, [quotesBySymbol]);
    // const [sparksBySymbol, setSparksBySymbol] = useState<Record<string, number[]>>({});
    // const [detailedSeries, setDetailedSeries] = useState<StockQuote[]>(() => generateDefaultSeries(700));
    // const [selectedProfile, setSelectedProfile] = useState<AlphaVantageCompanyProfile | null>(null);
    // const [tradeQuantity, setTradeQuantity] = useState<string>('1');
    // const [selectedTimeRange, setSelectedTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | 'All'>('1M'); // Defaulting to 1M behavior (20 days)

    // const portfolioStats = useMemo(() => {
    //     if (!investments) return { balance: 0, change: 0, changePercent: 0 };

    //     let totalBalanceLocal = 0;
    //     let totalCostLocal = 0;

    //     investments.forEach((inv: any) => {
    //         const fromCurrency = inv.currency || 'USD';
    //         const liveQuote = quotesBySymbol[inv.symbol];
    //         const currentPrice = liveQuote ? liveQuote.price : (inv.currentPrice || inv.averagePrice);

    //         const valueLocal = convertToLocal(inv.quantity * currentPrice, fromCurrency);
    //         const costLocal = convertToLocal(inv.quantity * inv.averagePrice, fromCurrency);

    //         totalBalanceLocal += valueLocal;
    //         totalCostLocal += costLocal;
    //     });

    //     const change = totalBalanceLocal - totalCostLocal;
    //     const changePercent = totalCostLocal > 0 ? (change / totalCostLocal) * 100 : 0;

    //     return {
    //         balance: totalBalanceLocal,
    //         change,
    //         changePercent
    //     };
    // }, [convertToLocal, investments, quotesBySymbol]);

    // const featuredWithLive = useMemo(() => {
    //     return FEATURED_INVESTMENTS.map((item) => {
    //         const live = quotesBySymbol[item.symbol];
    //         if (!live) return item;
    //         return {
    //             ...item,
    //             price: live.price,
    //             change: `${live.changePercent >= 0 ? '+' : '-'}${Math.abs(live.changePercent).toFixed(2)}%`,
    //             isPositive: live.isPositive,
    //         };
    //     });
    // }, [quotesBySymbol]);

    // const watchlistWithLive = useMemo(() => {
    //     return WATCHLIST.slice(0, 5).map((item) => {
    //         const live = quotesBySymbol[item.symbol];
    //         const spark = sparksBySymbol[item.symbol];
    //         return {
    //             ...item,
    //             price: live ? live.price : item.price,
    //             change: live ? `${live.changePercent >= 0 ? '+' : '-'}${Math.abs(live.changePercent).toFixed(2)}%` : item.change,
    //             isPositive: live ? live.isPositive : item.isPositive,
    //             data: spark && spark.length > 1 ? spark : item.data,
    //         };
    //     });
    // }, [quotesBySymbol, sparksBySymbol]);

    // const selectedLive = useMemo(() => {
    //     if (!selectedStock) return null;
    //     return quotesBySymbol[selectedStock.symbol] || null;
    // }, [quotesBySymbol, selectedStock]);

    // const selectedPrice = selectedLive?.price ?? selectedStock?.price ?? 0;
    // const selectedIsPositive = selectedLive?.isPositive ?? selectedStock?.isPositive ?? true;
    // const selectedChangePercent = selectedLive ? `${selectedLive.changePercent >= 0 ? '+' : '-'}${Math.abs(selectedLive.changePercent).toFixed(2)}%` : selectedStock?.change ?? '';
    // const selectedChangeValue = selectedLive?.changeValue ?? (selectedStock ? selectedStock.price * 0.05 : 0);

    // const ownedInvestment = useMemo(() => {
    //     if (!investments || !selectedStock) return null;
    //     return investments.find(inv => inv.symbol === selectedStock.symbol);
    // }, [investments, selectedStock]);

    // const ownedQuantity = ownedInvestment?.quantity || 0;

    // const selectedQuoteCurrency = selectedProfile?.currency || ownedInvestment?.currency || 'USD';
    // const selectedMarketCapLocal =
    //     typeof selectedProfile?.marketCap === 'number'
    //         ? convertToLocal(selectedProfile.marketCap, selectedQuoteCurrency)
    //         : undefined;

    // const quantityNum = parseFloat(tradeQuantity) || 0;
    // const estimatedValue = quantityNum * selectedPrice;
    // const estimatedFee = Math.max(2, estimatedValue * 0.001); // Min $2 or 0.1%

    // useEffect(() => {
    //     const loadFeaturedQuotes = async () => {
    //         // Load quotes for featured
    //         for (const item of FEATURED_INVESTMENTS) {
    //             if (!item.apiSymbol) continue;
    //             if (quotesBySymbolRef.current[item.symbol] || fetchingSymbolsRef.current.has(item.symbol)) continue;

    //             fetchingSymbolsRef.current.add(item.symbol);
    //             try {
    //                 const quote = await fetchAlphaVantageQuote(item.apiSymbol);
    //                 if (quote) setQuotesBySymbol((prev) => ({ ...prev, [item.symbol]: quote }));
    //             } finally {
    //                 fetchingSymbolsRef.current.delete(item.symbol);
    //             }
    //         }
    //     };

    //     void loadFeaturedQuotes();
    // }, []);

    // useEffect(() => {
    //     const loadWatchlistSparks = async () => {
    //         for (const item of WATCHLIST) {
    //             if (!item.apiSymbol) continue;
    //             if (sparksBySymbol[item.symbol] || fetchingSymbolsRef.current.has(item.symbol)) continue;

    //             fetchingSymbolsRef.current.add(item.symbol);
    //             try {
    //                 // Fetch intraday for sparkline (last ~10 points)
    //                 // We can reuse fetchAlphaVantageIntradaySeries but limit processing
    //                 // Or maybe we need a dedicated function if we want to be lighter.
    //                 // For now, let's just use fetchAlphaVantageIntradaySeries and take last 6 points
    //                 // But we have rate limits (5s per call). This will be very slow for full list.
    //                 // Alpha Vantage free tier is very restrictive (5 calls/min, 500 calls/day).
    //                 // We can't realistically fetch sparklines for 50+ items on free tier.
    //                 // We will fetch for first 5 only to show functionality.
    //                 if (Object.keys(sparksBySymbol).length >= 5) break;

    //                 const series = await fetchAlphaVantageIntradaySeries(item.apiSymbol);
    //                 if (series && series.length > 0) {
    //                     const sparkData = series.slice(-10).map(p => p.price);
    //                     setSparksBySymbol(prev => ({ ...prev, [item.symbol]: sparkData }));
    //                 }
    //             } finally {
    //                 fetchingSymbolsRef.current.delete(item.symbol);
    //             }
    //         }
    //     };

    //     void loadWatchlistSparks();
    // }, [sparksBySymbol]);

    // useEffect(() => {
    //     const loadInvestmentQuotes = async () => {
    //         if (!investments) return;
    //         // Load quotes for user investments
    //         for (const inv of investments) {
    //             if (!inv.symbol) continue;
    //             // Skip if already loaded or fetching
    //             if (quotesBySymbolRef.current[inv.symbol] || fetchingSymbolsRef.current.has(inv.symbol)) continue;
                
    //             fetchingSymbolsRef.current.add(inv.symbol);
    //             try {
    //                 // We assume symbol is the API symbol for now, or we might need a mapping
    //                 const quote = await fetchAlphaVantageQuote(inv.symbol);
    //                 if (quote) setQuotesBySymbol((prev) => ({ ...prev, [inv.symbol]: quote }));
    //             } finally {
    //                 fetchingSymbolsRef.current.delete(inv.symbol);
    //             }
    //         }
    //     };

    //     void loadInvestmentQuotes();
    // }, [investments]);

    // useEffect(() => {
    //     const loadSelectedSeries = async () => {
    //         const apiSymbol = selectedStock?.apiSymbol;
    //         if (!apiSymbol) {
    //             setDetailedSeries(generateDefaultSeries(700));
    //             setSelectedProfile(null);
    //             return;
    //         }

    //         // Set a temporary series based on the current price to avoid showing old data or empty chart
    //         setDetailedSeries(generateDefaultSeries(selectedStock?.price || 100));

    //         const [series, profile] = await Promise.all([
    //             selectedTimeRange === '1D' 
    //                 ? fetchAlphaVantageIntradaySeries(apiSymbol)
    //                 : selectedTimeRange === 'All'
    //                 ? fetchAlphaVantageMonthlySeries(apiSymbol)
    //                 : selectedTimeRange === '6M'
    //                 ? fetchAlphaVantageWeeklySeries(apiSymbol, 26)
    //                 : fetchAlphaVantageDailySeries(apiSymbol, 
    //                     selectedTimeRange === '1W' ? 5 :
    //                     selectedTimeRange === '3M' ? 60 :
    //                     20 // Default 1M
    //                   ),
    //             fetchAlphaVantageCompanyOverview(apiSymbol),
    //         ]);

    //         if (series && series.length >= 2) {
    //             setDetailedSeries(series);
    //             // Only update sparklines if we are in default view or it's appropriate? 
    //             // Actually sparklines on the left list are separate.
    //             // But we were updating sparksBySymbol based on selected series before.
    //             // We should probably only do that if the series is appropriate (e.g. daily default).
    //             // Let's keep it simple for now.
    //             if (selectedTimeRange !== '1D') {
    //                 setSparksBySymbol((prev) => ({ ...prev, [selectedStock.symbol]: series.slice(-6).map((p) => p.price) }));
    //             }
    //         }
    //         setSelectedProfile(profile);

    //         const quote = await fetchAlphaVantageQuote(apiSymbol);
    //         if (quote) setQuotesBySymbol((prev) => ({ ...prev, [selectedStock.symbol]: quote }));
    //         else if (series) {
    //             const derivedQuote = quoteFromDailySeries(series);
    //             if (derivedQuote) setQuotesBySymbol((prev) => ({ ...prev, [selectedStock.symbol]: derivedQuote }));
    //         }
    //     };

    //     void loadSelectedSeries();
    // }, [selectedStock, selectedTimeRange]);

    // const [isBuying, setIsBuying] = useState(false);
    // const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    // const [successModalOpen, setSuccessModalOpen] = useState(false);
    // const buyStock = useMutation(api.investments.buyStock);
    // const router = useRouter();

    // const handleBuy = async () => {
    //     if (!selectedStock) return;
    //     const quantity = parseFloat(tradeQuantity);
    //     if (isNaN(quantity) || quantity <= 0) return;

    //     setIsBuying(true);
    //     try {
    //         await buyStock({
    //             symbol: selectedStock.symbol,
    //             name: selectedStock.name,
    //             quantity: quantity,
    //             price: selectedPrice,
    //             sector: selectedProfile?.sector,
    //             currency: selectedProfile?.currency,
    //         });
    //         setSuccessModalOpen(true);
    //         setTradeQuantity('0');
    //     } catch (error: any) {
    //         if (error.message.includes('Verification documents not approved')) {
    //             setVerificationModalOpen(true);
    //         } else {
    //             alert('Failed to purchase stock: ' + error.message);
    //         }
    //     } finally {
    //         setIsBuying(false);
    //     }
    // };

    // if (user === undefined || investments === undefined || accounts === undefined) {
    //     return (
    //         <>
    //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    //                     <div className="lg:col-span-1 space-y-8">
    //                         <div className="p-5 sm:p-8 rounded-3xl bg-db-hover border border-db-border">
    //                             <div className="flex items-center justify-between mb-8">
    //                                 <div className="w-10 h-10 rounded-full bg-db-hover" />
    //                                 <div className="w-10 h-10 rounded-full bg-db-hover" />
    //                             </div>
    //                             <div className="h-4 w-32 bg-db-hover rounded mb-2" />
    //                             <div className="h-10 w-56 bg-db-hover rounded mb-4" />
    //                             <div className="h-6 w-44 bg-db-hover rounded" />
    //                         </div>
    //                         <div className="p-5 sm:p-8 rounded-3xl bg-db-hover border border-db-border">
    //                             <div className="h-5 w-36 bg-db-hover rounded mb-6" />
    //                             <div className="space-y-4">
    //                                 {Array.from({ length: 5 }).map((_, i) => (
    //                                     <div key={i} className="h-12 w-full bg-db-hover rounded-2xl" />
    //                                 ))}
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className="lg:col-span-2 space-y-8">
    //                         <div className="p-5 sm:p-8 rounded-3xl bg-db-hover border border-db-border">
    //                             <div className="h-6 w-44 bg-db-hover rounded mb-6" />
    //                             <div className="h-80 w-full bg-db-hover rounded-2xl" />
    //                         </div>
    //                         <div className="p-5 sm:p-8 rounded-3xl bg-db-hover border border-db-border">
    //                             <div className="h-6 w-40 bg-db-hover rounded mb-6" />
    //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                                 {Array.from({ length: 4 }).map((_, i) => (
    //                                     <div key={i} className="h-20 w-full bg-db-hover rounded-2xl" />
    //                                 ))}
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }

    return (
        // <>
        //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        //                 {/* Left Column: Portfolio & Watchlist */}
        //                 <div className="lg:col-span-1 space-y-8">
        //                     {/* Portfolio Card */}
        //                     <motion.div
        //                         initial={{ opacity: 0, y: 20 }}
        //                         animate={{ opacity: 1, y: 0 }}
        //                         className="p-5 sm:p-8 rounded-3xl bg-linear-to-br from-[#FF4B6E] to-[#FF0F7B] text-white relative overflow-hidden shadow-2xl shadow-pink-500/20"
        //                     >
        //                         <div className="relative z-10">
        //                             <div className="flex items-center justify-between mb-8">
        //                                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
        //                                     <RiIcon className="ri-flashlight-fill text-white" />
        //                                 </div>
        //                                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md overflow-hidden border border-white/20">
        //                                     <CustomAvatar
        //                                         src={user?.image}
        //                                         name={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'}
        //                                         size={40}
        //                                         className="w-full h-full"
        //                                         rounded="rounded-none"
        //                                     />
        //                                 </div>
        //                             </div>

        //                             <p className="text-white/80 font-medium mb-1">Your portfolio</p>
        //                             <h2 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold mb-2 break-words">
        //                                 {formatLocalMoney(portfolioStats.balance)}
        //                             </h2>
        //                             <div className="flex items-center gap-2 bg-white/20 w-fit max-w-full px-3 py-1 rounded-full backdrop-blur-sm">
        //                                 <RiIcon className={portfolioStats.change >= 0 ? "ri-arrow-right-up-line" : "ri-arrow-right-down-line"} />
        //                                 <span className="text-sm font-bold truncate">
        //                                     {formatLocalMoney(Math.abs(portfolioStats.change))} ({portfolioStats.changePercent >= 0 ? '+' : ''}{portfolioStats.changePercent.toFixed(2)}%)
        //                                 </span>
        //                             </div>
        //                         </div>

        //                         {/* Decorative Circles */}
        //                         <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        //                         <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
        //                     </motion.div>

        //                     {/* Featured Investments */}
        //                     <div>
        //                         <div className="flex items-center justify-between mb-4">
        //                             <h3 className="text-lg font-bold text-db-text-secondary">Featured Investments</h3>
        //                             <button className="text-sm text-db-primary hover:text-db-text-primary transition-colors">See all</button>
        //                         </div>
        //                         <ScrollArea className="w-full pb-4 whitespace-nowrap">
        //                             <div className="flex gap-4">
        //                                 {featuredWithLive.map((item, index) => (
        //                                     <motion.div
        //                                         key={index}
        //                                         initial={{ opacity: 0, x: 20 }}
        //                                         animate={{ opacity: 1, x: 0 }}
        //                                         transition={{ delay: index * 0.1 }}
        //                                         onClick={() => setSelectedStock(item)}
        //                                         className="min-w-40 p-5 rounded-2xl bg-white border border-db-border hover:border-db-primary/30 transition-all cursor-pointer group"
        //                                     >
        //                                         <img
        //                                             src={getStockLogoUrl(item.symbol)}
        //                                             alt={item.symbol}
        //                                             className="w-10 h-10  rounded-full object-cover relative"
        //                                             onError={(e) => {
        //                                                 e.currentTarget.style.display = 'none';
        //                                             }}
        //                                         />
        //                                         <h4 className="font-bold text-db-text-primary mb-1">{item.symbol}</h4>
        //                                         <p className="text-xs text-db-text-secondary mb-3">{item.name}</p>

        //                                         <div>
        //                                             <p className="font-bold text-db-text-primary">{formatMoney(item.price, 'USD')}</p>
        //                                             <p className={`text-xs font-bold ${item.isPositive ? 'text-db-success' : 'text-db-danger'}`}>
        //                                                 {item.change}
        //                                             </p>
        //                                         </div>
        //                                     </motion.div>
        //                                 ))}
        //                             </div>
        //                             <ScrollBar className="hidden" orientation="horizontal" />
        //                         </ScrollArea>
        //                     </div>

        //                     {/* Watchlist */}
        //                     <div>
        //                         <div className="flex items-center justify-between mb-4">
        //                             <h3 className="text-lg font-bold text-db-text-secondary">My watchlist</h3>
        //                             <button className="text-sm text-db-primary hover:text-db-text-primary transition-colors">See all</button>
        //                         </div>
        //                         <div className="space-y-3">
        //                             {watchlistWithLive.map((item, index) => (
        //                                 <motion.div
        //                                     key={index}
        //                                     initial={{ opacity: 0, y: 10 }}
        //                                     animate={{ opacity: 1, y: 0 }}
        //                                     transition={{ delay: 0.2 + (index * 0.1) }}
        //                                     onClick={() => setSelectedStock(item)}
        //                                     className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-db-hover transition-colors cursor-pointer group border border-db-border"
        //                                 >
        //                                     <div className="flex items-center gap-4">
        //                                         <div className="w-10 h-10 rounded-full bg-db-hover border border-db-border flex items-center justify-center font-bold text-db-text-primary overflow-hidden relative">
        //                                             <img
        //                                                 src={getStockLogoUrl(item.symbol)}
        //                                                 alt={item.symbol}
        //                                                 className="w-full h-full object-cover relative"
        //                                                 onError={(e) => {
        //                                                     e.currentTarget.style.display = 'none';
        //                                                 }}
        //                                             />
        //                                         </div>
        //                                         <div className="min-w-0">
        //                                             <h4 className="font-bold text-db-text-primary">{item.symbol}</h4>
        //                                             <p className="text-xs text-db-text-muted truncate">{item.name}</p>
        //                                         </div>
        //                                     </div>

        //                                     {/* Mini Chart (Sparkline) */}
        //                                     <div className="hidden sm:block w-24 h-10">
        //                                         <ResponsiveContainer width="100%" height="100%">
        //                                             <LineChart data={(item.data || []).map((val, i) => ({ i, val }))}>
        //                                                 <Line
        //                                                     type="monotone"
        //                                                     dataKey="val"
        //                                                     stroke={item.isPositive ? '#10B981' : '#EF4444'}
        //                                                     strokeWidth={2}
        //                                                     dot={false}
        //                                                 />
        //                                             </LineChart>
        //                                         </ResponsiveContainer>
        //                                     </div>

        //                                     <div className="text-right min-w-20">
        //                                         <p className="font-bold text-db-text-primary">{formatMoney(item.price, 'USD')}</p>
        //                                         <p className={`text-xs font-bold ${item.isPositive ? 'text-db-success' : 'text-db-danger'}`}>
        //                                             {item.change}
        //                                         </p>
        //                                     </div>
        //                                 </motion.div>
        //                             ))}
        //                         </div>
        //                     </div>
        //                 </div>

        //                 {/* Right Column: Detailed View / Chart */}
        //                 <div className="lg:col-span-2">
        //                     <motion.div
        //                         layoutId={selectedStock ? `stock-${selectedStock.symbol}` : 'stock-default'}
        //                         className="h-full bg-white rounded-3xl border border-db-border p-5 sm:p-8 relative overflow-hidden flex flex-col"
        //                     >
        //                         {selectedStock ? (
        //                             <>
        //                                 <div className="flex items-center justify-between gap-3 mb-8">
        //                                     <button onClick={() => setSelectedStock(null)} className="w-10 h-10 shrink-0 rounded-full bg-db-hover flex items-center justify-center hover:bg-db-hover transition-colors">
        //                                         <RiIcon className="ri-arrow-left-line text-db-text-primary" />
        //                                     </button>
        //                                     <div className="flex items-center gap-3 min-w-0">
        //                                         <div className="text-right min-w-0">
        //                                             <h2 className="text-xl font-bold text-db-text-primary truncate">{selectedProfile?.companyName || selectedStock.name}</h2>
        //                                             <p className="text-sm text-db-text-secondary">
        //                                                 {selectedStock.symbol}
        //                                                 {selectedProfile?.exchange ? ` • ${selectedProfile.exchange}` : ''}
        //                                                 {selectedProfile?.currency ? ` • ${selectedProfile.currency}` : ''}
        //                                             </p>
        //                                         </div>
        //                                        <img
        //                                             src={getStockLogoUrl(selectedStock.symbol)}
        //                                             alt={selectedStock.symbol}
        //                                             className="w-12 h-12  rounded-full object-cover relative"
        //                                             onError={(e) => {
        //                                                 e.currentTarget.style.display = 'none';
        //                                             }}
        //                                         />
        //                                     </div>
        //                                     <button className="w-10 h-10 shrink-0 rounded-full bg-db-hover flex items-center justify-center hover:bg-db-hover transition-colors">
        //                                         <RiIcon className="ri-more-fill text-db-text-primary" />
        //                                     </button>
        //                                 </div>

        //                                 <div className="mb-8 p-6 bg-[#8B5CF6] rounded-3xl relative overflow-hidden shadow-lg shadow-purple-500/20">
        //                                     <div className="relative z-10 flex justify-between items-start gap-3">
        //                                         <div className="min-w-0">
        //                                             <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold text-white break-words">{formatMoney(selectedPrice, selectedQuoteCurrency)}</h1>
        //                                             <p className="text-white/80 font-medium mt-1 flex items-center gap-2 truncate">
        //                                                 <RiIcon className={selectedIsPositive ? 'ri-arrow-right-up-line' : 'ri-arrow-right-down-line'} />
        //                                                 {formatMoney(Math.abs(selectedChangeValue), selectedQuoteCurrency)} ({selectedChangePercent})
        //                                             </p>
        //                                         </div>
        //                                         <div className="flex gap-2">
        //                                             <button className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white hover:bg-white/30"><RiIcon className="ri-line-chart-line" /></button>
        //                                             <button className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white hover:bg-white/30"><RiIcon className="ri-time-line" /></button>
        //                                         </div>
        //                                     </div>

        //                                     <div className="h-52 sm:h-64 mt-6 -mx-4 -mb-6">
        //                                         <ResponsiveContainer width="100%" height="100%">
        //                                             <AreaChart data={detailedSeries}>
        //                                                 <defs>
        //                                                     <linearGradient id="colorDetailed" x1="0" y1="0" x2="0" y2="1">
        //                                                         <stop offset="5%" stopColor="#fff" stopOpacity={0.3} />
        //                                                         <stop offset="95%" stopColor="#fff" stopOpacity={0} />
        //                                                     </linearGradient>
        //                                                 </defs>
        //                                                 <Area type="monotone" dataKey="price" stroke="#fff" strokeWidth={3} fillOpacity={1} fill="url(#colorDetailed)" />
        //                                             </AreaChart>
        //                                         </ResponsiveContainer>
        //                                     </div>

        //                                     <div className="flex justify-between px-4 pb-2 mt-4 relative z-10">
        //                                         {(['1D', '1W', '1M', '3M', '6M', 'All'] as const).map((p) => (
        //                                             <button 
        //                                                 key={p} 
        //                                                 onClick={() => setSelectedTimeRange(p)}
        //                                                 className={`text-xs font-bold px-3 py-1 rounded-full ${selectedTimeRange === p ? 'bg-white text-purple-600' : 'text-white/60 hover:text-white'}`}
        //                                             >
        //                                                 {p}
        //                                             </button>
        //                                         ))}
        //                                     </div>
        //                                 </div>

        //                                 <div className="grid grid-cols-3 gap-4 mb-8">
        //                                     <div className="p-3 sm:p-4 bg-db-hover rounded-2xl border border-db-border min-w-0">
        //                                         <p className="text-xs text-db-text-secondary mb-1">Owned</p>
        //                                         <p className="text-base sm:text-lg md:text-xl font-bold text-db-text-primary leading-tight truncate">{ownedQuantity}</p>
        //                                     </div>
        //                                     <div className="p-3 sm:p-4 bg-db-hover rounded-2xl border border-db-border min-w-0">
        //                                         <p className="text-xs text-db-text-secondary mb-1">Market Cap</p>
        //                                         <p className="text-sm sm:text-base md:text-lg font-bold text-db-text-primary leading-tight truncate">
        //                                             {selectedMarketCapLocal ? `${currencySymbol}${formatMarketCap(selectedMarketCapLocal)}` : '-'}
        //                                         </p>
        //                                     </div>
        //                                     <div className="p-3 sm:p-4 bg-db-hover rounded-2xl border border-db-border min-w-0">
        //                                         <p className="text-xs text-db-text-secondary mb-1">Industry</p>
        //                                         <p className="text-sm sm:text-base md:text-lg font-bold text-db-text-primary leading-tight truncate">
        //                                             {selectedProfile?.industry || '-'}
        //                                         </p>
        //                                     </div>
        //                                 </div>

        //                                 {selectedProfile?.description ? (
        //                                     <div className="mb-8 p-5 bg-db-hover rounded-2xl border border-db-border">
        //                                         <p className="text-xs text-db-text-secondary mb-2">About</p>
        //                                         <p className="text-sm text-db-text-primary leading-relaxed max-h-22 overflow-hidden">
        //                                             {selectedProfile.description}
        //                                         </p>
        //                                     </div>
        //                                 ) : null}

        //                                 <div className="mt-auto">
        //                                     <div className="p-4 bg-db-hover rounded-2xl border border-db-border mb-4">
        //                                         <div className="flex justify-between mb-2">
        //                                             <span className="text-db-text-secondary text-sm">Quantity</span>
        //                                             <div className="flex gap-2">
        //                                                 <span className="text-db-text-primary text-sm font-bold bg-db-hover px-2 py-0.5 rounded">Market</span>
        //                                                 <span className="text-db-text-muted text-sm">Limit</span>
        //                                             </div>
        //                                         </div>
        //                                         <div className="flex items-end justify-between">
        //                                             <input
        //                                                 type="number"
        //                                                 min="0"
        //                                                 value={tradeQuantity}
        //                                                 onChange={(e) => setTradeQuantity(e.target.value)}
        //                                                 className="text-3xl font-bold text-db-text-primary bg-transparent border-none outline-none w-32 placeholder-db-text-muted"
        //                                                 placeholder="0"
        //                                             />
        //                                             <span className="text-db-text-muted text-sm mb-1">Fee: ~{formatMoney(estimatedFee, selectedQuoteCurrency)}</span>
        //                                         </div>
        //                                         <p className="text-xs text-db-text-muted mt-1">{formatMoney(estimatedValue, selectedQuoteCurrency)}</p>
        //                                     </div>

        //                                     <div className="grid grid-cols-2 gap-4">
        //                                         <button className="py-4 rounded-xl bg-db-hover text-db-text-primary font-bold hover:bg-db-hover transition-colors border border-db-border">
        //                                             Sell
        //                                         </button>
        //                                         <button 
        //                                             onClick={handleBuy}
        //                                             disabled={isBuying}
        //                                             className={`py-4 rounded-xl bg-db-primary text-db-text-primary font-bold transition-all shadow-lg shadow-db-primary/20 ${isBuying ? 'opacity-50 cursor-not-allowed' : ''}`}
        //                                         >
        //                                             {isBuying ? 'Processing...' : 'Buy'}
        //                                         </button>
        //                                     </div>
        //                                 </div>
        //                             </>
        //                         ) : (
        //                             <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
        //                                 <div className="w-24 h-24 rounded-full bg-db-hover flex items-center justify-center mb-6">
        //                                     <RiIcon className="ri-bar-chart-box-line text-4xl text-db-text-muted" />
        //                                 </div>
        //                                 <h3 className="text-2xl font-bold text-db-text-primary mb-2">Select an Investment</h3>
        //                                 <p className="text-db-text-secondary max-w-xs">Click on any stock from the list to view detailed performance and trade.</p>
        //                             </div>
        //                         )}
        //                     </motion.div>
        //                 </div>
        //             </div>
        //         </div>
        //     {/* Verification Required Modal */}
        //     <Dialog
        //         isOpen={verificationModalOpen}
        //         onClose={() => setVerificationModalOpen(false)}
        //         title="Verification Required"
        //         description="To ensure the security of your investments and comply with regulations, we require all users to complete identity verification before trading."
        //         type="warning"
        //         actions={
        //             <>
        //                 <button 
        //                     onClick={() => setVerificationModalOpen(false)}
        //                     className="px-4 py-2 text-sm font-medium text-db-text-secondary hover:text-db-text-primary transition-colors"
        //                 >
        //                     Cancel
        //                 </button>
        //                 <button 
        //                     onClick={() => router.push('/settings')}
        //                     className="px-6 py-2 rounded-lg bg-db-primary text-db-text-primary font-bold text-sm transition-all shadow-lg shadow-db-primary/20"
        //                 >
        //                     Verify Identity
        //                 </button>
        //             </>
        //         }
        //     />

        //     {/* Success Modal */}
        //     <Dialog
        //         isOpen={successModalOpen}
        //         onClose={() => setSuccessModalOpen(false)}
        //         title="Purchase Successful!"
        //         description={`You have successfully purchased ${tradeQuantity} shares of ${selectedStock?.symbol}. This investment has been added to your portfolio.`}
        //         type="success"
        //         actions={
        //             <button 
        //                 onClick={() => setSuccessModalOpen(false)}
        //                 className="px-6 py-2 rounded-lg bg-db-hover text-db-text-primary font-bold text-sm transition-all"
        //             >
        //                 Done
        //             </button>
        //         }
        //     />
        // </>
        <div>
            working on it
        </div>
    );
}

