"use client";

import { EventStatus } from "@/lib/types";

export type FilterKey = "all" | EventStatus;

const TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "live", label: "Berlangsung" },
  { key: "upcoming", label: "Mendatang" },
  { key: "past", label: "Selesai" },
];

export default function StatusTabs({
  active,
  counts,
  onChange,
}: {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative px-3.5 py-1.5 text-[13px] font-medium transition-colors rounded-sm border ${
              isActive
                ? "border-upcoming/60 text-text bg-surface-2"
                : "border-line text-text-muted hover:text-text hover:border-text-muted"
            }`}
          >
            {isActive && (
              <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 border-t border-l border-upcoming" />
            )}
            {tab.label}
            <span className="ml-1.5 font-data text-[11px] text-text-muted tabular-nums">
              {counts[tab.key]}
            </span>
            {isActive && (
              <span className="absolute -right-[3px] -bottom-[3px] h-1.5 w-1.5 border-b border-r border-upcoming" />
            )}
          </button>
        );
      })}
    </div>
  );
}
