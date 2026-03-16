import { META, ANIME, StreamingServers } from "@consumet/extensions";
import { unstable_cache } from "next/cache";

// Create a singleton instance using Anilist for metadata and AnimeKai for episodes.
const animekai = new (ANIME as any).AnimeKai();

export const anilist = new META.Anilist(animekai);

// Helper to normalize the Anilist title object to a simple string to match the rest of the app
const normalizeAnimeTitle = (res: any) => {
    if (res?.title && typeof res.title === 'object') {
        res.title = res.title.english || res.title.romaji || res.title.native || "Unknown Title";
    }
    if (res?.results) {
        res.results = res.results.map((anime: any) => {
            if (anime?.title && typeof anime.title === 'object') {
                anime.title = anime.title.english || anime.title.romaji || anime.title.native || "Unknown Title";
            }
            return anime;
        });
    }
    return res;
};

// Cache Anime Info for 1 hour (3600 seconds) - Info rarely changes frequently
export const getAnimeInfo = async (id: string) => {
    const fetchCached = unstable_cache(
        async () => {
            const res = await anilist.fetchAnimeInfo(id);
            return normalizeAnimeTitle(res);
        },
        [`anime-info-${id}`],
        { revalidate: 3600 }
    );
    return fetchCached();
};

// Cache Stream Links for 30 mins (1800 seconds) - Stream URLs can expire, so we can't cache them forever
export const getEpisodeSources = async (episodeId: string, server?: StreamingServers) => {
    const fetchCached = unstable_cache(
        async () => {
            try {
                return await anilist.fetchEpisodeSources(episodeId);
            } catch (error) {
                console.error("Failed to fetch episode sources:", error);
                return { sources: [] }; // Return empty sources gracefully instead of crashing
            }
        },
        [`episode-sources-${episodeId}`],
        { revalidate: 1800 }
    );
    return fetchCached();
};

export const searchAnime = async (query: string) => {
    const res = await anilist.search(query);
    return normalizeAnimeTitle(res);
};

export const fetchTopAiring = async () => {
    const fetchCached = unstable_cache(
        async () => {
            const res = await anilist.fetchTrendingAnime();
            return normalizeAnimeTitle(res);
        },
        ['top-airing'],
        { revalidate: 3600 }
    );
    return fetchCached();
};

export const fetchRecentEpisodes = async () => {
    // We use the unstable_cache wrapper but generate dynamic timestamps inside the wrapper 
    // to ensure it fetches recent airing schedules. 
    // To keep cache hits high, we'll align the timestamp to the current hour.
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
    
    const fetchCached = unstable_cache(
        async () => {
            const now = Math.round(Date.now() / 1000);
            // Fetch episodes that aired in the last 3 days up to right now
            const res = await anilist.fetchAiringSchedule(1, 40, now - (86400 * 3), now);
            
            // Sort by most recently aired first (descending)
            if (res.results) {
                res.results.sort((a: any, b: any) => b.airingAt - a.airingAt);
            }
            
            return normalizeAnimeTitle(res);
        },
        [`recent-episodes-${currentHour}`], // Rotate cache key every hour
        { revalidate: 3600 }
    );
    return fetchCached();
};

export const fetchPopularAnime = async () => {
    const res = await anilist.fetchPopularAnime();
    return normalizeAnimeTitle(res);
};
