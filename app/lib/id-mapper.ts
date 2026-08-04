const ANIME_LIST_URL =
  "https://raw.githubusercontent.com/Fribb/anime-lists/master/anime-list-full.json";

interface AnimeListEntry {
  anilist_id?: number;
  mal_id?: number;
  imdb_id?: string[];
  themoviedb_id?: { tv?: number; movie?: number };
  season?: { tvdb?: number; tmdb?: number };
  type?: string;
}

/** Resolved mapping for a single AniList entry */
export interface AnimeMapping {
  imdbId: string;
  tmdbId?: number;
  /** The TMDB season number (e.g. Grand Blue S3 → season 3) */
  season: number;
  type: string;
}

/** Module-level cache: anilist_id → mapping info */
const cache = new Map<number, AnimeMapping>();

/** Singleton promise so the remote list is fetched at most once. */
let loadPromise: Promise<void> | null = null;

async function loadMappings(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch(ANIME_LIST_URL);

      if (!res.ok) {
        throw new Error(`Failed to fetch anime-list: ${res.status} ${res.statusText}`);
      }

      const entries: AnimeListEntry[] = await res.json();

      for (const entry of entries) {
        if (
          entry.anilist_id != null &&
          Array.isArray(entry.imdb_id) &&
          entry.imdb_id.length > 0
        ) {
          const tvdbSeason = entry.season?.tvdb;
          const tmdbSeason = entry.season?.tmdb;
          const season = (tvdbSeason != null && tvdbSeason > 0 ? tvdbSeason : tmdbSeason) ?? 1;

          cache.set(entry.anilist_id, {
            imdbId: entry.imdb_id[0],
            tmdbId: entry.themoviedb_id?.tv ?? entry.themoviedb_id?.movie,
            season,
            type: entry.type ?? "TV",
          });
        }
      }
    } catch (err) {
      // Reset so a subsequent call can retry after a transient failure.
      loadPromise = null;
      console.error("[id-mapper] Error loading anime-list mappings:", err);
    }
  })();

  return loadPromise;
}

/**
 * Resolve an AniList ID to its IMDB ID, TMDB season number, and type.
 * Returns `null` when no mapping exists or the remote list could not be loaded.
 */
export async function getAnimeMapping(
  anilistId: number | string,
): Promise<AnimeMapping | null> {
  try {
    await loadMappings();

    const numericId =
      typeof anilistId === "string" ? parseInt(anilistId, 10) : anilistId;

    if (Number.isNaN(numericId)) return null;

    return cache.get(numericId) ?? null;
  } catch {
    return null;
  }
}
