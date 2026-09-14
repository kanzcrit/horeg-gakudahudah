"use client";

import { EventItem } from "@/lib/types";
import { formatShortDate, getStatus, STATUS_LABEL } from "@/lib/status";

const STATUS_DOT: Record<string, string> = {
  live: "bg-live",
  upcoming: "bg-upcoming",
  past: "bg-past",
};

const STATUS_TEXT: Record<string, string> = {
  live: "text-live",
  upcoming: "text-upcoming",
  past: "text-text-muted",
};

export default function EventCard({
  event,
  isFocused,
  onSelect,
}: {
  event: EventItem;
  isFocused: boolean;
  onSelect: (event: EventItem) => void;
}) {
  const status = getStatus(event.date);
  const { day, month } = formatShortDate(event.date);

  return (
    <button
      onClick={() => onSelect(event)}
      className={`group flex w-full text-left overflow-hidden border transition-colors rounded-sm ${
        isFocused
          ? "border-upcoming/60 bg-surface-2"
          : "border-line bg-surface hover:border-text-muted"
      } ${status === "past" ? "opacity-60" : ""}`}
    >
      {/* date stub with perforated edge */}
      <div className="relative flex flex-col items-center justify-center w-16 shrink-0 border-r border-dashed border-line py-3 font-display">
        <span className="text-lg font-semibold leading-none text-text">{day}</span>
        <span className="text-[11px] uppercase tracking-wide text-text-muted mt-1">
          {month}
        </span>
        {/* perforation notches */}
        <span className="absolute -right-[5px] -top-[5px] h-2.5 w-2.5 rounded-full bg-bg" />
        <span className="absolute -right-[5px] -bottom-[5px] h-2.5 w-2.5 rounded-full bg-bg" />
      </div>

      <div className="flex-1 min-w-0 px-3.5 py-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]} ${
              status === "live" ? "pulse-dot" : ""
            }`}
          />
          <span className={`text-[11px] font-medium ${STATUS_TEXT[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          {event.tag && (
            <span className="text-[11px] text-text-muted font-data">· {event.tag}</span>
          )}
        </div>
        <h3 className="text-[14px] font-semibold text-text leading-snug truncate">
          {event.title}
        </h3>
        <p className="text-[12px] text-text-muted mt-0.5 truncate">{event.location}</p>
      </div>
    </button>
  );
}
