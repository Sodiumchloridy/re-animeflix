"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";

interface Episode {
  id: string;
  number: number;
  title: string;
}

interface EpisodeSelectorProps {
  animeId: string;
  episodes: Episode[];
  currentEpNumber: number;
}

export default function EpisodeSelector({
  animeId,
  episodes,
  currentEpNumber,
}: EpisodeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);

  const chunkSize = 50;
  const isLargeSeries = episodes.length > chunkSize;

  // Calculate episode range chunks if anime has > 50 episodes
  const rangeChunks = useMemo(() => {
    if (!isLargeSeries) return [];
    const chunks = [];
    for (let i = 0; i < episodes.length; i += chunkSize) {
      const end = Math.min(i + chunkSize, episodes.length);
      chunks.push({ start: i + 1, end, items: episodes.slice(i, end) });
    }
    return chunks;
  }, [episodes, isLargeSeries]);

  // Set default range to contain current episode
  useEffect(() => {
    if (isLargeSeries && rangeChunks.length > 0) {
      const idx = rangeChunks.findIndex(
        (chunk) => currentEpNumber >= chunk.start && currentEpNumber <= chunk.end
      );
      if (idx !== -1) setSelectedRangeIndex(idx);
    }
  }, [currentEpNumber, isLargeSeries, rangeChunks]);

  // Filter episodes by search query
  const filteredEpisodes = useMemo(() => {
    if (!searchQuery.trim()) {
      if (isLargeSeries && rangeChunks[selectedRangeIndex]) {
        return rangeChunks[selectedRangeIndex].items;
      }
      return episodes;
    }
    const q = searchQuery.toLowerCase().trim();
    return episodes.filter(
      (ep) =>
        String(ep.number).includes(q) ||
        ep.title.toLowerCase().includes(q)
    );
  }, [episodes, searchQuery, isLargeSeries, rangeChunks, selectedRangeIndex]);

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span>Episodes</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {episodes.length} Total
            </span>
          </h2>

          {/* Grid / List View Mode Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/10 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="List View"
              aria-label="List View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Instant Episode Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter episode # or title..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-900/90 border border-white/10 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60"
          />
          <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear episode filter"
              className="absolute right-2 top-2 text-[10px] text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Range Tabs (for large series > 50 episodes) */}
        {isLargeSeries && !searchQuery && (
          <div className="flex flex-wrap gap-1.5 pt-1 overflow-x-auto custom-scrollbar pb-1">
            {rangeChunks.map((chunk, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRangeIndex(idx)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  selectedRangeIndex === idx
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
                }`}
              >
                {chunk.start}-{chunk.end}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Episode Container */}
      <div className="max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredEpisodes.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-5 sm:grid-cols-6 xl:grid-cols-4 gap-2">
              {filteredEpisodes.map((ep) => {
                const isActive = currentEpNumber === ep.number;
                return (
                  <Link
                    key={ep.id || ep.number}
                    href={`/anime/${animeId}?ep=${ep.number}`}
                    className={`
                      relative flex items-center justify-center aspect-square rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500
                      ${
                        isActive
                          ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400 scale-[1.02]"
                          : "bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-purple-500/40"
                      }
                    `}
                  >
                    {ep.number}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col space-y-1.5">
              {filteredEpisodes.map((ep) => {
                const isActive = currentEpNumber === ep.number;
                return (
                  <Link
                    key={ep.id || ep.number}
                    href={`/anime/${animeId}?ep=${ep.number}`}
                    className={`
                      flex items-center justify-between p-2.5 rounded-xl text-xs transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-purple-500
                      ${
                        isActive
                          ? "bg-purple-600 text-white border-purple-400 font-semibold shadow-md"
                          : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-purple-500/30"
                      }
                    `}
                  >
                    <span className="font-bold shrink-0 w-12">EP {ep.number}</span>
                    <span className="truncate flex-1 text-right text-zinc-400 hover:text-zinc-200">
                      {ep.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          )
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">
            No episodes matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
