import { NextResponse } from "next/server";
import { fetchUnsplashDestinationPhotos } from "@/lib/unsplash-server";
import type { UnsplashPhoto } from "@/lib/unsplash-types";

const MAX_Q = 160;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get("q")?.trim() ?? "";
  const perPage = Math.min(
    30,
    Math.max(1, Number.parseInt(searchParams.get("per_page") ?? "18", 10) || 18),
  );

  if (rawQ.length < 1) {
    return NextResponse.json(
      { photos: [] as UnsplashPhoto[], source: "empty_query" as const },
      { status: 400 },
    );
  }

  if (rawQ.length > MAX_Q) {
    return NextResponse.json(
      { photos: [] as UnsplashPhoto[], source: "query_too_long" as const },
      { status: 400 },
    );
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!accessKey) {
    return NextResponse.json({
      photos: [] as UnsplashPhoto[],
      source: "missing_key" as const,
      message: "Set UNSPLASH_ACCESS_KEY for destination photos from Unsplash.",
    });
  }

  try {
    const photos = await fetchUnsplashDestinationPhotos(rawQ, perPage, accessKey);
    return NextResponse.json({ photos, source: "unsplash" as const });
  } catch {
    return NextResponse.json({
      photos: [] as UnsplashPhoto[],
      source: "error" as const,
    });
  }
}
