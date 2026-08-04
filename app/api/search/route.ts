import { NextResponse } from "next/server";
import { searchAnime, fetchTopAiring } from "@/app/lib/anime-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("query");
    const query = rawQuery ? rawQuery.trim() : "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    if (query.toLowerCase() === "trending" || query.toLowerCase() === "catalog") {
      const data = await fetchTopAiring();
      return NextResponse.json(data);
    }

    const data = await searchAnime(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API route error:", error);
    return NextResponse.json({ results: [], error: "Failed to search anime" }, { status: 500 });
  }
}
