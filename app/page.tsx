"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/config";
import { events as allEvents } from "@/lib/events";
import { EventItem } from "@/lib/types";
import { getStatus, sortEvents } from "@/lib/status";
import StatusTabs, { FilterKey } from "@/components/StatusTabs";
import SearchBar from "@/components/SearchBar";
import EventList from "@/components/EventList";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-text-muted text-sm">
      Memuat peta...
    </div>
  ),
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const sorted = useMemo(() => sortEvents(allEvents), []);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: sorted.length, live: 0, upcoming: 0, past: 0 };
    sorted.forEach((e) => {
      c[getStatus(e.date)]++;
    });
    return c;
  }, [sorted]);

  const filtered = useMemo(() => {
    return sorted.filter((e) => {
      if (filter !== "all" && getStatus(e.date) !== filter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [sorted, filter, query]);

  function handleSelect(event: EventItem) {
    setFocusedId(event.id);
    setMobileView("map");
  }

  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <header className="border-b border-line px-4 sm:px-6 py-4 shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-live" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
            </span>
            <h1 className="font-display font-semibold text-[17px] tracking-tight text-text">
              {siteConfig.name}
            </h1>
          </div>
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <p className="text-[12px] text-text-muted mt-2">{siteConfig.tagline}</p>
        <div className="mt-3.5">
          <StatusTabs active={filter} counts={counts} onChange={setFilter} />
        </div>
      </header>

      {/* mobile view toggle */}
      <div className="sm:hidden flex border-b border-line shrink-0">
        {(["list", "map"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 py-2.5 text-[13px] font-medium transition-colors ${
              mobileView === v
                ? "text-text border-b-2 border-upcoming -mb-px"
                : "text-text-muted"
            }`}
          >
            {v === "list" ? `Daftar (${filtered.length})` : "Peta"}
          </button>
        ))}
      </div>

      {/* main split */}
      <main className="flex flex-1 min-h-0">
        <div
          className={`w-full sm:w-[380px] md:w-[420px] border-r border-line overflow-y-auto thin-scroll shrink-0 ${
            mobileView === "map" ? "hidden sm:block" : "block"
          }`}
        >
          <EventList events={filtered} focusedId={focusedId} onSelect={handleSelect} />
        </div>
        <div className={`flex-1 relative ${mobileView === "list" ? "hidden sm:block" : "block"}`}>
          <MapView events={filtered} focusedId={focusedId} onSelect={handleSelect} />
        </div>
      </main>
    </div>
  );
}
