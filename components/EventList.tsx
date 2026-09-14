"use client";

import { EventItem } from "@/lib/types";
import EventCard from "./EventCard";

export default function EventList({
  events,
  focusedId,
  onSelect,
}: {
  events: EventItem[];
  focusedId: string | null;
  onSelect: (event: EventItem) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
        <div className="h-8 w-8 rounded-full border border-dashed border-line mb-3" />
        <p className="text-sm text-text-muted">
          Tidak ada acara yang cocok. Coba ubah kata kunci atau filter status.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isFocused={event.id === focusedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
