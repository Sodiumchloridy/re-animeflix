import { META, ANIME, StreamingServers } from "@consumet/extensions";
import { unstable_cache } from "next/cache";

const provider = new (ANIME as any).AnimeKai();
export const anilist = new META.Anilist(provider);

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

// Try multiple servers until one works
const SERVERS = [null, StreamingServers.VidStreaming, StreamingServers.StreamTape];

export const getEpisodeSources = async (episodeId: string) => {
    console.log("Fetching episode sources for:", episodeId);
    for (const server of SERVERS) {
        try {
            console.log(`Trying server: ${server || 'default'}`);
            const res = await anilist.fetchEpisodeSources(episodeId, server);
            console.log(`Server ${server || 'default'} returned ${res?.sources?.length} sources`);
            if (res?.sources?.length) return { sources: res.sources, server };
        } catch (e: any) {
            console.error(`Server ${server || 'default'} failed:`, e?.message || e);
        }
    }
    console.warn("All servers failed, returning empty sources");
    return { sources: [] };
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
