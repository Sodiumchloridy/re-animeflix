import AnimeCard from "../_components/AnimeCard";
import { searchAnime, fetchTopAiring } from "../lib/anime-client";
import Link from "next/link";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: rawQuery } = await searchParams;
  const query = rawQuery ? decodeURIComponent(rawQuery).trim() : "";
  const isCatalog = !query || ["trending", "catalog"].includes(query.toLowerCase());
  const searchResponse = isCatalog ? await fetchTopAiring() : await searchAnime(query);

  return (
    <div className="w-full flex-1 animate-in fade-in duration-500 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            {!isCatalog ? (
              <>
                Search Results for <span className="text-purple-400">&quot;{query}&quot;</span>
              </>
            ) : (
              "Trending Catalog"
            )}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Found {searchResponse.results.length} anime titles
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Results Grid */}
      {searchResponse.results.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {searchResponse.results.map((anime: any) => (
            <AnimeCard anime={anime} key={anime.id} />
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center space-y-3 bg-[#12151e] border border-white/10 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-zinc-200">No Anime Found</h2>
          <p className="text-xs text-zinc-400 max-w-sm">
            We couldn&apos;t find any results matching &quot;{query}&quot;. Try searching for another keyword or title.
          </p>
        </div>
      )}
    </div>
  );
}
