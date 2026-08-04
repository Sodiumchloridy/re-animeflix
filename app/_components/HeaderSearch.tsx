"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  image: string;
  type?: string;
  status?: string;
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("main-search-input")?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Instant search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="flex-1 max-w-xl relative group">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search Icon / Spinner */}
        <div className="absolute left-3.5 pointer-events-none text-zinc-400 group-focus-within:text-purple-400 transition-colors">
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        <input
          id="main-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search anime title, genre, keyword..."
          className="w-full h-10 pl-10 pr-12 text-sm bg-zinc-900/90 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:bg-zinc-900 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-inner"
        />

        <div className="absolute right-3 hidden sm:flex items-center gap-1 pointer-events-none text-[10px] font-semibold text-zinc-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
          ⌘K
        </div>
      </form>

      {/* Debounced Instant Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-12 left-0 right-0 z-50 bg-[#12151e] border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-1">
            {results.length > 0 ? (
              results.slice(0, 7).map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}?ep=1`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="relative w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
                    <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-purple-300 line-clamp-1 transition-colors">
                      {anime.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span className="uppercase font-medium px-1.5 py-0.2 rounded bg-white/5 border border-white/10">
                        {anime.type || "TV"}
                      </span>
                      {anime.status && (
                        <span className="capitalize text-zinc-500">{anime.status.toLowerCase()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-zinc-400">
                No matching anime titles found.
              </div>
            )}

            {results.length > 0 && (
              <button
                onClick={handleSubmit}
                className="w-full text-center py-2 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/20 transition-colors mt-1"
              >
                View all results for &quot;{query}&quot; →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
