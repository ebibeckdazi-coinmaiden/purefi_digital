'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries, Country } from '../../data/countries';
import { CircleFlag } from 'react-circle-flags';
import { ScrollArea } from './scroll-area';
import RiIcon from './RiIcon';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function PhoneInput({
  value,
  onChange,
  className = '',
  placeholder = '(555) 000-0000',
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [overrideCountryCode, setOverrideCountryCode] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Determine selected country from value
  const selectedCountry = useMemo(() => {
    // Clean value to just digits and +
    const cleanValue = value ? (value.startsWith('+') ? value : `+${value}`) : '';

    // If we have an override (user explicitly selected a country), check if it still matches the value
    if (overrideCountryCode) {
      const override = countries.find(c => c.code === overrideCountryCode);
      if (override) {
        // If value is empty, we stick to the override (user cleared input but wants to keep country)
        if (!cleanValue || cleanValue === '+') return override;

        // Check if value matches the override's dial code
        const codes = override.dial_code.split(',').map(d => d.trim().replace(/[^\d+]/g, ''));
        // We match if the value starts with the code, OR if the code starts with the value (user is typing the code)
        // Actually, typically value contains the code. 
        // If value is "+1", and code is "+1", it matches.
        if (codes.some(code => cleanValue.startsWith(code))) {
          return override;
        }
      }
    }

    if (!value) return countries.find(c => c.code === 'US') || countries[0];

    // Sort by dial_code length descending to match most specific code first
    const sortedCountries = [...countries].sort((a, b) => {
      const lenA = a.dial_code.replace(/\D/g, '').length;
      const lenB = b.dial_code.replace(/\D/g, '').length;
      if (lenA !== lenB) return lenB - lenA;
      // If lengths are equal (e.g. US +1 vs CA +1), prioritize US
      if (a.code === 'US') return -1;
      if (b.code === 'US') return 1;
      return 0;
    });

    const found = sortedCountries.find(c => {
      // Check if value starts with this dial code
      // Note: dial_code in data might be like "+1-242", we should check base code +1 or full code
      // My data has "+1" for US and "+1-242" for Bahamas.
      // If value is "+1242...", it should match Bahamas first because it's longer.

      // Handle complex dial codes in data (e.g. "+1-809, +1-829")
      const codes = c.dial_code.split(',').map(d => d.trim().replace(/[^\d+]/g, ''));
      return codes.some(code => cleanValue.startsWith(code));
    });

    return found || countries.find(c => c.code === 'US') || countries[0];
  }, [value, overrideCountryCode]);

  // Extract local number
  const localNumber = useMemo(() => {
    if (!value) return '';

    const cleanValue = value.replace(/[^\d]/g, '');
    const cleanDialCode = selectedCountry.dial_code.split(',')[0].replace(/[^\d]/g, '');

    if (cleanValue.startsWith(cleanDialCode)) {
      return cleanValue.slice(cleanDialCode.length);
    }
    // Fallback if mismatch (shouldn't happen if detection is correct)
    return cleanValue;
  }, [value, selectedCountry]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dial_code.includes(query) ||
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

  const handleCountrySelect = (country: Country) => {
    setIsOpen(false);
    setSearchQuery('');
    setOverrideCountryCode(country.code);

    // Construct new value with new country code + existing local number
    const cleanDialCode = country.dial_code.split(',')[0].replace(/[^\d]/g, '');
    onChange(cleanDialCode + localNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocal = e.target.value.replace(/[^\d]/g, '');
    const cleanDialCode = selectedCountry.dial_code.split(',')[0].replace(/[^\d]/g, '');
    onChange(cleanDialCode + newLocal);
  };

  // Format local number for display (simple US-like formatting for now)
  const displayValue = useMemo(() => {
    const clean = localNumber;
    // Apply formatting only if it looks like a standard number?
    // For now, let's just return the raw local number to avoid fighting the cursor
    // If we want masking, we need a library or careful implementation.
    // The design shows formatting. Let's try simple formatting.
    if (selectedCountry.code === 'US' || selectedCountry.code === 'CA') {
      if (clean.length > 6) return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
      if (clean.length > 3) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
      if (clean.length > 0) return `(${clean}`;
    }
    return clean;
  }, [localNumber, selectedCountry]);

  // Handle formatted input change is tricky. 
  // We'll stick to unformatted input for reliability, or just raw digits.
  // Wait, I used `displayValue` in render but `handleInputChange` reads `e.target.value`.
  // If I format the display, I must unformat in `handleInputChange`.

  return (
    <div className={`space-y-2  ${className}`}>
      <label className="text-sm font-medium text-gray-300">Phone number</label>
      <div className="relative z-50" ref={dropdownRef}>
        <div className={`flex border border-primary/40 hover:border-primary/70 bg-input rounded-xl transition-all text-foreground placeholder:text-muted-foreground/70 focus-within:bg-surface focus-within:border-primary focus:outline-none`}>
          {/* Country Selector Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-4 pr-3 py-3 border-r border-white/10 hover:bg-white/5 transition-colors rounded-l-xl shrink-0 min-w-[100px]"
          >
            <CircleFlag countryCode={selectedCountry.code.toLocaleLowerCase()} className='w-6 h-6' />
            <span className="text-body font-medium">{selectedCountry.code}</span>
            <span className="text-gray-400 text-sm">{selectedCountry.dial_code.split(',')[0]}</span>
            <RiIcon className={`ri-arrow-down-s-line text-gray-500 transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Phone Number Input */}
          <input
            type="tel"
            value={displayValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full bg-transparent border-none px-4 py-3 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-border focus:outline-none rounded-r-xl"
          />
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full mt-2 bg-input border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-[300px] flex flex-col z-90"
            >
              {/* Search Box */}
              <div className="p-3 border-b border-white/5 sticky top-0 bg-charcoal z-10">
                <div className="relative">
                  <RiIcon className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for countries"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-body placeholder-gray-500 focus:border-luxury-gold focus:outline-none"
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
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left`}
                    >
                      <CircleFlag countryCode={country.code.toLocaleLowerCase()} className='w-8 h-8' />
                      <span className="flex-1 text-body text-sm font-medium truncate">{country.name}</span>
                      <span className="text-gray-400 text-sm font-mono">{country.dial_code.split(',')[0]}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
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
