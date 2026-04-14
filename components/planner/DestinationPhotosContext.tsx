"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UnsplashPhoto } from "@/lib/unsplash-types";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

/** Lookup key for a stop within a destination-scoped batch result */
export function placeLookupKey(place: string): string {
  return norm(place);
}

type DestinationPhotosContextValue = {
  photos: UnsplashPhoto[];
  /** Destination search still loading */
  destinationLoading: boolean;
  /** Per-place batch (itinerary stops) */
  placesLoading: boolean;
  /** First result — hero */
  heroPhoto: UnsplashPhoto | null;
  /** Deterministic pick from destination pool when per-place not ready */
  pickForPlace: (place: string, destination: string) => UnsplashPhoto | null;
  /** Per-place Unsplash result (key = normalized place); undefined = not loaded yet */
  placeByKey: Record<string, UnsplashPhoto | null | undefined>;
};

const DestinationPhotosContext = createContext<DestinationPhotosContextValue | null>(null);

export function DestinationPhotosProvider({
  destination,
  places = [],
  children,
}: {
  destination: string;
  /** Unique place names from itinerary — powers per-place Unsplash search */
  places?: string[];
  children: ReactNode;
}) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(true);
  const [placeByKey, setPlaceByKey] = useState<Record<string, UnsplashPhoto | null | undefined>>({});
  const [placesLoading, setPlacesLoading] = useState(false);

  const dest = destination.trim();
  const placesKey = useMemo(
    () => places.map((p) => p.trim().toLowerCase()).sort().join("\0"),
    [places],
  );

  useEffect(() => {
    if (!dest) {
      setPhotos([]);
      setDestinationLoading(false);
      return;
    }

    let cancelled = false;
    setDestinationLoading(true);
    setPhotos([]);

    fetch(`/api/unsplash/search?q=${encodeURIComponent(dest)}&per_page=24`)
      .then(async (r) => {
        const data = (await r.json()) as { photos?: UnsplashPhoto[] };
        if (!cancelled) {
          setPhotos(Array.isArray(data.photos) ? data.photos : []);
        }
      })
      .catch(() => {
        if (!cancelled) setPhotos([]);
      })
      .finally(() => {
        if (!cancelled) setDestinationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dest]);

  useEffect(() => {
    if (!dest || places.length === 0) {
      setPlaceByKey({});
      setPlacesLoading(false);
      return;
    }

    let cancelled = false;
    setPlacesLoading(true);
    setPlaceByKey({});

    fetch("/api/unsplash/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination: dest, places }),
    })
      .then(async (r) => {
        const data = (await r.json()) as {
          results?: Record<string, UnsplashPhoto | null>;
        };
        if (cancelled) return;
        const raw = data.results && typeof data.results === "object" ? data.results : {};
        const next: Record<string, UnsplashPhoto | null | undefined> = {};
        for (const [k, v] of Object.entries(raw)) {
          next[norm(k)] = v;
        }
        setPlaceByKey(next);
      })
      .catch(() => {
        if (!cancelled) setPlaceByKey({});
      })
      .finally(() => {
        if (!cancelled) setPlacesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dest, placesKey]);

  const value = useMemo((): DestinationPhotosContextValue => {
    const keyFor = (place: string, d: string) => `${norm(place)}|${norm(d)}`;

    const pickForPlace = (place: string, d: string): UnsplashPhoto | null => {
      if (photos.length === 0) return null;
      const idx = hashString(keyFor(place, d)) % photos.length;
      return photos[idx] ?? null;
    };

    return {
      photos,
      destinationLoading,
      placesLoading,
      heroPhoto: photos[0] ?? null,
      pickForPlace,
      placeByKey,
    };
  }, [photos, destinationLoading, placesLoading, placeByKey]);

  return (
    <DestinationPhotosContext.Provider value={value}>{children}</DestinationPhotosContext.Provider>
  );
}

export function useDestinationPhotosOptional() {
  return useContext(DestinationPhotosContext);
}
