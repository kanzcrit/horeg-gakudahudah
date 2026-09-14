"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EventItem } from "@/lib/types";
import { getStatus } from "@/lib/status";
import { siteConfig } from "@/lib/config";

const DOT_COLOR: Record<string, string> = {
  live: "#35d488",
  upcoming: "#f2a93c",
  past: "#4a5372",
};

function markerIcon(status: string, isFocused: boolean) {
  const color = DOT_COLOR[status];
  const size = isFocused ? 18 : 12;
  return L.divIcon({
    className: "",
    html: `<span style="
      display:block;
      width:${size}px;
      height:${size}px;
      border-radius:9999px;
      background:${color};
      border:2px solid #0b0f1a;
      box-shadow:0 0 0 1px ${color}55;
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapView({
  events,
  focusedId,
  onSelect,
}: {
  events: EventItem[];
  focusedId: string | null;
  onSelect: (event: EventItem) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(
      [siteConfig.defaultMapCenter.lat, siteConfig.defaultMapCenter.lng],
      siteConfig.defaultMapZoom
    );

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // sync markers with events
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // remove markers no longer present
    markersRef.current.forEach((marker, id) => {
      if (!events.find((e) => e.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    events.forEach((event) => {
      const status = getStatus(event.date);
      const isFocused = event.id === focusedId;
      let marker = markersRef.current.get(event.id);

      if (!marker) {
        marker = L.marker([event.lat, event.lng], {
          icon: markerIcon(status, isFocused),
        })
          .addTo(map)
          .bindPopup(
            `<strong>${escapeHtml(event.title)}</strong><br/>${escapeHtml(
              event.location
            )}`
          )
          .on("click", () => onSelect(event));
        markersRef.current.set(event.id, marker);
      } else {
        marker.setIcon(markerIcon(status, isFocused));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, focusedId]);

  // fly to focused event
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !focusedId) return;
    const event = events.find((e) => e.id === focusedId);
    if (!event) return;
    map.flyTo([event.lat, event.lng], Math.max(map.getZoom(), 12), {
      duration: 0.6,
    });
    markersRef.current.get(event.id)?.openPopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId]);

  return <div ref={mapRef} className="h-full w-full" />;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
