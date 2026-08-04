const ANIME_LIST_URL =
  "https://raw.githubusercontent.com/Fribb/anime-lists/master/anime-list-full.json";

interface AnimeListEntry {
  anilist_id?: number;
  imdb_id?: string[];
  themoviedb_id?: { tv?: number; movie?: number };
  season?: { tvdb?: number; tmdb?: number };
  type?: string;
}

/** Resolved mapping for a single AniList entry */
export interface AnimeMapping {
  imdbId: string;
  tmdbId?: number;
  season: number;
  type: string;
}

const cache = new Map<number, AnimeMapping>();
let loadPromise: Promise<void> | null = null;

async function loadMappings(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch(ANIME_LIST_URL);
      if (!res.ok) throw new Error(`Failed to fetch anime-list: ${res.status}`);

      const entries: AnimeListEntry[] = await res.json();
      for (const entry of entries) {
        if (entry.anilist_id != null && entry.imdb_id?.[0]) {
          const s = entry.season?.tvdb || entry.season?.tmdb;
          cache.set(entry.anilist_id, {
            imdbId: entry.imdb_id[0],
            tmdbId: entry.themoviedb_id?.tv ?? entry.themoviedb_id?.movie,
            season: s && s > 0 ? s : 1,
            type: entry.type ?? "TV",
          });
        }
      }
    } catch (err) {
      loadPromise = null;
      console.error("[id-mapper] Error loading mappings:", err);
    }
  })();

  return loadPromise;
}

export async function getAnimeMapping(anilistId: number | string): Promise<AnimeMapping | null> {
  try {
    await loadMappings();
    const numId = Number(anilistId);
    return Number.isNaN(numId) ? null : cache.get(numId) ?? null;
  } catch {
    return null;
  }
}
