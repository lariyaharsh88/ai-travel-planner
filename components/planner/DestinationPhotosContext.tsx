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

type DestinationPhotosContextValue = {
  photos: UnsplashPhoto[];
  loading: boolean;
  /** First result — best for hero / destination vibe */
  heroPhoto: UnsplashPhoto | null;
  /** Deterministic pick for card imagery (place + trip context) */
  pickForPlace: (place: string, destination: string) => UnsplashPhoto | null;
};

const DestinationPhotosContext = createContext<DestinationPhotosContextValue | null>(null);

export function DestinationPhotosProvider({
  destination,
  children,
}: {
  destination: string;
  children: ReactNode;
}) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = destination.trim();
    if (!q) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/unsplash/search?q=${encodeURIComponent(q)}&per_page=20`)
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
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [destination]);

  const value = useMemo((): DestinationPhotosContextValue => {
    const keyFor = (place: string, dest: string) =>
      `${place.trim().toLowerCase()}|${dest.trim().toLowerCase()}`;

    const pickForPlace = (place: string, dest: string): UnsplashPhoto | null => {
      if (photos.length === 0) return null;
      const idx = hashString(keyFor(place, dest)) % photos.length;
      return photos[idx] ?? null;
    };

    return {
      photos,
      loading,
      heroPhoto: photos[0] ?? null,
      pickForPlace,
    };
  }, [photos, loading]);

  return (
    <DestinationPhotosContext.Provider value={value}>{children}</DestinationPhotosContext.Provider>
  );
}

export function useDestinationPhotosOptional() {
  return useContext(DestinationPhotosContext);
}
