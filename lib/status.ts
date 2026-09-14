import { EventItem, EventStatus } from "./types";

export function getStatus(dateISO: string): EventStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateISO + "T00:00:00");

  if (eventDate.getTime() === today.getTime()) return "live";
  if (eventDate.getTime() > today.getTime()) return "upcoming";
  return "past";
}

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export function formatShortDate(dateISO: string): { day: string; month: string } {
  const d = new Date(dateISO + "T00:00:00");
  return { day: String(d.getDate()), month: MONTHS_ID[d.getMonth()] };
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  live: "Berlangsung",
  upcoming: "Mendatang",
  past: "Selesai",
};

export function sortEvents(items: EventItem[]): EventItem[] {
  return [...items].sort((a, b) => {
    const sa = getStatus(a.date);
    const sb = getStatus(b.date);
    const rank: Record<EventStatus, number> = { live: 0, upcoming: 1, past: 2 };
    if (rank[sa] !== rank[sb]) return rank[sa] - rank[sb];
    // upcoming: soonest first; past: most recent first
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return sa === "past" ? db - da : da - db;
  });
}
