'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries, Country } from '../../data/countries';
import { CircleFlag } from 'react-circle-flags'
import { ScrollArea } from './scroll-area';
import RiIcon from './RiIcon';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function CountrySelect({
  value,
  onChange,
  className = '',
  placeholder = 'Select a country',
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected country object based on value (name)
  const selectedCountry = useMemo(() => {
    return countries.find(c => c.name === value) || null;
  }, [value]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-foreground/85">Country</label>
      <div className="relative z-40" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex border border-primary/40 hover:border-primary/70 bg-input justify-between rounded-xl transition-all text-foreground px-4 py-3 placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none`}
        >
          <div className="flex items-center gap-3">
            <RiIcon className="ri-global-line text-muted-foreground" />
            {selectedCountry ? (
              <span className="flex items-center gap-2 text-foreground">
                <CircleFlag countryCode={selectedCountry.code.toLocaleLowerCase()} className='w-5 h-5' />
                <span>{selectedCountry.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground/70">{placeholder}</span>
            )}
          </div>
          <RiIcon className={`ri-arrow-down-s-line text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full mt-2 bg-input border border-border rounded-xl shadow-xl overflow-hidden max-h-[300px] flex flex-col z-60 text-foreground"
            >
              {/* Search Box */}
              <div className="p-3 border-b border-border sticky top-0 bg-charcoal z-10">
                <div className="relative">
                  <RiIcon className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full bg-white/5 border border-border rounded-lg py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Country List */}
              <ScrollArea className="w-full h-40">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left text-foreground`}
                    >
                      <CircleFlag countryCode={country.code.toLocaleLowerCase()} className='w-8 h-8' />
                      <span className="flex-1 text-sm font-medium truncate">{country.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No countries found
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
