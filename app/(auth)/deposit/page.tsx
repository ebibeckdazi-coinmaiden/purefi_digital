'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { currencies } from '@/app/data/currencies';
import RiIcon from '@/app/components/ui/RiIcon';

type DepositMethod = 'bank' | 'card' | 'crypto';

export default function DepositPage() {
  const router = useRouter();
  const [method, setMethod] = useState<DepositMethod>('card');
  const [amount, setAmount] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cryptoSearch, setCryptoSearch] = useState('');
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [copiedChain, setCopiedChain] = useState<string | null>(null);
  
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const identity = useQuery(api.user.user);
  const accounts = useQuery(api.accounts.getAccounts);
  const cryptoVault = useQuery(api.user.getMyCryptoVault, {});

  useEffect(() => {
    if (!identity) return;
    void ensureUserAccounts({}).catch(() => {});
  }, [ensureUserAccounts, identity]);

  const localAccount = accounts?.find((acc) => acc.type === "local" || acc.kind === "local") ?? null;
  const currencyCode = localAccount?.currency || 'USD';
  const currencySymbol = currencies.find(c => c.code === currencyCode)?.symbol || '$';

  const chainDisplayName: Record<string, string> = useMemo(
    () => ({
      ethereum: 'Ethereum',
      smartchain: 'BNB Smart Chain',
      bnb: 'BNB Smart Chain',
      bitcoin: 'Bitcoin',
      solana: 'Solana',
      tron: 'Tron',
      xrp: 'XRP Ledger',
      atom: 'Cosmos Hub (ATOM)',
      sei: 'Sei',
      inj: 'Injective',
      ton: 'Ton',
      polkadot: 'Polkadot',
      doge: 'Dogecoin',
      litecoin: 'Litecoin',
      polygon: 'Polygon',
      'usdt-ethereum': 'Tether (ERC20)',
      'usdt-polygon': 'Tether (Polygon)',
      'usdt-tron': 'Tether (TRC20)',
      'usdc-ethereum': 'USD Coin (ERC20)',
      'usdc-polygon': 'USD Coin (Polygon)',
      'dai-ethereum': 'Dai (ERC20)',
    }),
    [],
  );

  const parsedAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const canSubmit = useMemo(() => {
    if (!Number.isFinite(parsedAmount)) return false;
    if (parsedAmount <= 0) return false;
    if (isLoading || success) return false;
    return true;
  }, [isLoading, parsedAmount, success]);

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => {
      router.push('/home');
    }, 2000);
    return () => window.clearTimeout(t);
  }, [router, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      await new Promise((r) => window.setTimeout(r, 900));
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const methods: Array<{
    id: DepositMethod;
    label: string;
    desc: string;
    icon: string;
  }> = [
    { id: 'card', label: 'Card', desc: 'Instant top up with a debit card', icon: 'ri-bank-card-line' },
    { id: 'bank', label: 'Bank', desc: 'Transfer from your bank account', icon: 'ri-bank-line' },
    { id: 'crypto', label: 'Crypto', desc: 'Deposit using a wallet transfer', icon: 'ri-bit-coin-line' },
  ];

  const cryptoCoins = useMemo(() => {
    const addresses = cryptoVault?.addresses ?? {};
    const chains = cryptoVault?.chains ?? {};

    return Object.entries(addresses).map(([chain, address]) => {
      const chainInfo = chains[chain];
      const name = chainDisplayName[chain] ?? chain;
      const symbol = chainInfo?.symbol ?? chain.toUpperCase();
      const network = chainInfo?.network ?? 'mainnet';
      const chainId = chainInfo?.chainId;
      return { chain, address, name, symbol, network, chainId };
    });
  }, [chainDisplayName, cryptoVault?.addresses, cryptoVault?.chains]);

  const filteredCryptoCoins = useMemo(() => {
    const q = cryptoSearch.trim().toLowerCase();
    if (!q) return cryptoCoins;
    return cryptoCoins.filter((c) => {
      return (
        c.chain.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        c.network.toLowerCase().includes(q)
      );
    });
  }, [cryptoCoins, cryptoSearch]);

  const selectedCrypto = useMemo(() => {
    const byChain = new Map(cryptoCoins.map((c) => [c.chain, c]));
    if (selectedChain && byChain.has(selectedChain)) return byChain.get(selectedChain) ?? null;
    if (filteredCryptoCoins.length === 1) return filteredCryptoCoins[0] ?? null;
    return null;
  }, [cryptoCoins, filteredCryptoCoins, selectedChain]);

  const copyAddress = async (chain: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = address;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedChain(chain);
    window.setTimeout(() => setCopiedChain((prev) => (prev === chain ? null : prev)), 1500);
  };

  const getCoinIcon = (symbol: string) => {
    const s = symbol.toLowerCase();
    const map: Record<string, string> = {
      'bnb': 'bnb',
      'btc': 'btc',
      'eth': 'eth',
      'sol': 'sol',
      'trx': 'trx',
      'xrp': 'xrp',
      'atom': 'atom',
      'dot': 'dot',
      'doge': 'doge',
      'ltc': 'ltc',
      'pol': 'pol',
      'ton': 'ton',
      'inj': 'inj',
      'sei': 'sei',
      'usdt': 'usdt',
      'usdc': 'usdc',
      'dai': 'dai'
    };
    return map[s] || s;
  };

  if (accounts === undefined) {
    return (
      <>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-32 lg:pb-12 animate-pulse">
          <div className="mb-8 text-center">
            <div className="h-9 w-32 bg-db-hover rounded-lg mx-auto mb-3" />
            <div className="h-4 w-72 max-w-full bg-db-hover rounded mx-auto" />
          </div>
          <div className="bg-white rounded-3xl border border-db-border p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-db-hover" />
              <div className="h-4 w-24 bg-db-hover rounded" />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-db-hover" />
                ))}
              </div>
              <div className="h-14 w-full rounded-2xl bg-db-hover" />
              <div className="h-14 w-full rounded-2xl bg-db-hover" />
              <div className="h-12 w-full rounded-xl bg-db-hover" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-32 lg:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Top Up</h1>
          <p className="text-db-text-secondary">Add money to your balance in seconds</p>
        </motion.div>

        <div className="bg-white rounded-3xl border border-db-border p-6 sm:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/home')}
              className="w-10 h-10 rounded-full bg-db-hover flex items-center justify-center hover:bg-db-hover transition-colors cursor-pointer"
              type="button"
            >
              <RiIcon className="ri-arrow-left-line text-db-text-primary" />
            </button>
            <div className="text-sm text-db-text-secondary">Secure Top Up</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {methods.map((m) => {
              const active = m.id === method;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-db-hover border-db-primary'
                      : 'bg-transparent border-db-border hover:border-db-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        active ? 'bg-db-primary-subtle text-db-primary' : 'bg-db-hover text-db-text-secondary'
                      }`}
                    >
                      <RiIcon className={`${m.icon} text-lg`} />
                    </div>
                    <div>
                      <div className="font-bold text-db-text-primary">{m.label}</div>
                      <div className="text-xs text-db-text-muted">{m.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {method === 'crypto' ? (
            <div className="space-y-6">
              <div className="border border-db-border rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-db-text-primary">Deposit crypto</div>
                    <div className="text-xs text-db-text-muted">
                      Pick a coin, copy the address, then send from your external wallet.
                    </div>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-full bg-db-primary-subtle text-db-primary flex items-center justify-center">
                    <RiIcon className="ri-wallet-3-line text-lg" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <RiIcon className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-db-text-muted" />
                <input
                  type="text"
                  value={cryptoSearch}
                  onChange={(e) => setCryptoSearch(e.target.value)}
                  className="w-full border border-db-border rounded-xl px-4 py-3.5 pl-12 text-db-text-primary placeholder-gray-600 focus:border-db-primary focus:ring-1 focus:ring-db-primary transition-all outline-none"
                  placeholder="Search coin (e.g. BTC, ETH, Solana)"
                />
              </div>

              <div className="border border-db-border rounded-2xl overflow-hidden p-4">
                {cryptoVault === undefined ? (
                  <div className="text-sm text-db-text-muted flex items-center gap-2">
                    <RiIcon className="ri-loader-4-line animate-spin" />
                    Loading your wallet addresses…
                  </div>
                ) : filteredCryptoCoins.length === 0 ? (
                  <div className="text-center text-db-text-muted py-4">
                    <RiIcon className="ri-file-search-line text-3xl mb-2 block" />
                    <div className="text-sm">No coins match your search.</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredCryptoCoins.map((coin) => {
                      const active = selectedChain === coin.chain;
                      return (
                        <button
                          key={coin.chain}
                          type="button"
                          onClick={() => setSelectedChain(coin.chain)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                            active
                              ? 'bg-db-hover border-db-primary shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                              : 'bg-db-hover border-db-border hover:bg-db-hover hover:border-db-border'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-full bg-db-hover p-1 flex items-center justify-center">
                              <img 
                                src={`/${getCoinIcon(coin.symbol)}-logo.svg`} 
                                alt={coin.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <span className="hidden text-[10px] font-bold text-db-text-secondary">{coin.symbol.slice(0, 2)}</span>
                            </div>
                            {active && (
                              <div className="w-5 h-5 rounded-full bg-db-primary text-db-text-primary flex items-center justify-center">
                                <RiIcon className="ri-check-line text-xs font-bold" />
                              </div>
                            )}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="text-db-text-primary text-sm font-bold truncate mb-0.5">{coin.name}</div>
                            <div className="text-[10px] text-db-text-muted flex items-center gap-1">
                              <span className="uppercase">{coin.symbol}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                              <span className="truncate max-w-15">{coin.network}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedCrypto && (
                <div className="bg-db-hover border border-db-border rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-db-text-primary">
                        {selectedCrypto.name} deposit address
                      </div>
                      <div className="text-xs text-db-text-muted">
                        Send only {selectedCrypto.symbol} on {selectedCrypto.network}.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyAddress(selectedCrypto.chain, selectedCrypto.address)}
                      className="shrink-0 px-3 py-2.5 rounded-xl bg-db-primary text-db-text-primary font-bold text-sm transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <RiIcon className={copiedChain === selectedCrypto.chain ? 'ri-check-line' : 'ri-file-copy-line'} />
                      {copiedChain === selectedCrypto.chain ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="mt-4 border border-db-border rounded-xl px-4 py-3 font-mono text-sm text-db-text-primary break-all">
                    {selectedCrypto.address}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-db-text-secondary mb-2 uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative">
                  <RiIcon className="ri-money-dollar-circle-line absolute left-4 top-1/2 -translate-y-1/2 text-db-text-muted" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-db-border rounded-xl px-4 py-4 pl-12 text-db-text-primary placeholder-gray-600 focus:border-db-primary focus:ring-1 focus:ring-db-primary transition-all outline-none font-bold text-lg"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-db-primary font-bold">
                    {currencyCode}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {[50, 100, 250, 500].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className="px-3 py-1.5 rounded-lg bg-db-hover border border-db-border text-sm text-db-text-secondary hover:bg-db-hover hover:text-db-text-primary transition-colors cursor-pointer"
                    >
                      {currencySymbol}{v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-db-text-secondary mb-2 uppercase tracking-wider">
                  Reference (optional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full border border-db-border rounded-xl px-4 py-4 text-db-text-primary placeholder-gray-600 focus:border-db-primary focus:ring-1 focus:ring-db-primary transition-all outline-none"
                  placeholder="e.g. Savings top up"
                  maxLength={32}
                />
                <div className="mt-2 text-xs text-db-text-muted flex items-center justify-between">
                  <span>Keep it short and clear</span>
                  <span>{reference.length}/32</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg ${
                  success
                    ? 'bg-db-success text-white'
                    : 'bg-db-primary text-db-text-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <RiIcon className="ri-loader-4-line animate-spin" /> Processing...
                  </>
                ) : success ? (
                  <>
                    <RiIcon className="ri-check-line" /> Top Up Successful
                  </>
                ) : (
                  `Confirm Top Up (${method.toUpperCase()})`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
