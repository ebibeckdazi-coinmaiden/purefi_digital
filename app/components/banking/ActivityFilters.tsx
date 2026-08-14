"use client";
import { Magnifer, Filter } from "@solar-icons/react-perf/BoldDuotone";

interface FilterTab {
  label: string;
  value: string;
}

interface ActivityFiltersProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}

export function ActivityFilters({ tabs, activeTab, onTabChange, searchPlaceholder = "Search", onSearch }: ActivityFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 border-b border-db-border pb-4 sm:border-0 sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === tab.value
                ? "bg-db-primary text-white"
                : "text-db-text-secondary hover:bg-db-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {onSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-db-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-db-bg border border-db-border rounded-lg text-xs font-medium text-db-text-primary placeholder:text-db-text-muted focus:outline-none focus:border-db-primary/50 transition-colors"
            />
          </div>
          <button className="min-h-11 min-w-11 p-2 flex items-center justify-center rounded-lg bg-db-bg border border-db-border text-db-text-muted hover:text-db-text-primary transition-colors">
            <Filter size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
