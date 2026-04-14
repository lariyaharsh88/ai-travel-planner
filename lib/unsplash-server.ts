import type { UnsplashPhoto } from "@/lib/unsplash-types";

type UnsplashSearchJson = {
  results?: Array<{
    urls?: { regular?: string; small?: string };
    user?: { name?: string; links?: { html?: string } };
    alt_description?: string | null;
    description?: string | null;
  }>;
};

const CACHE_MAX = 600;
/** In-memory cache for warm server instances (same query + per_page hits Unsplash once). */
const searchCache = new Map<string, UnsplashPhoto[]>();

function searchCacheKey(query: string, perPage: number): string {
  return `${query.trim().toLowerCase()}|p=${Math.min(Math.max(perPage, 1), 30)}`;
}

function parseSearchResults(data: UnsplashSearchJson): UnsplashPhoto[] {
  const results = data.results ?? [];
  const out: UnsplashPhoto[] = [];
  for (const r of results) {
    const src = r.urls?.regular ?? r.urls?.small;
    if (!src) continue;
    out.push({
      src,
      creditName: r.user?.name?.trim() || "Photographer",
      creditUrl: r.user?.links?.html ?? "https://unsplash.com",
      alt: (r.alt_description ?? r.description ?? "").trim() || "Destination photo",
    });
  }
  return out;
}

async function fetchUnsplashSearchUncached(
  query: string,
  perPage: number,
  accessKey: string,
): Promise<UnsplashPhoto[]> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.min(Math.max(perPage, 1), 30)));
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as UnsplashSearchJson;
  return parseSearchResults(data);
}

/**
 * Server-only: Unsplash Search API. Requires a valid access key from
 * https://unsplash.com/oauth/applications
 *
 * Results are cached in-memory per process to limit duplicate API calls.
 */
export async function fetchUnsplashDestinationPhotos(
  query: string,
  perPage: number,
  accessKey: string,
): Promise<UnsplashPhoto[]> {
  const key = searchCacheKey(query, perPage);
  const hit = searchCache.get(key);
  if (hit) {
    return hit;
  }

  const fresh = await fetchUnsplashSearchUncached(query, perPage, accessKey);
  if (searchCache.size >= CACHE_MAX) {
    searchCache.clear();
  }
  searchCache.set(key, fresh);
  return fresh;
}
