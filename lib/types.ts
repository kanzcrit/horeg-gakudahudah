export type EventStatus = "live" | "upcoming" | "past";

export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string; // ISO date, e.g. "2026-09-18"
  time?: string; // e.g. "19:00"
  lat: number;
  lng: number;
  tag?: string; // small label, e.g. category or intensity note
  description?: string;
}
