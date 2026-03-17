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
        { revalidate: 86400 } // 24 hours - Anilist rate limits heavily
    );
    return fetchCached();
};

// Try multiple servers until one works
const SERVERS = [null, StreamingServers.VidStreaming, StreamingServers.StreamTape];

export const getEpisodeSources = async (episodeId: string) => {
    for (const server of SERVERS) {
        try {
            const res = await anilist.fetchEpisodeSources(episodeId, server);
            if (res?.sources?.length) return { sources: res.sources, server };
        } catch (e: any) {
            console.error(`Server ${server || 'default'} failed:`, e?.message || e);
        }
    }
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
        { revalidate: 86400 } // 24 hours
    );
    return fetchCached();
};

export const fetchRecentEpisodes = async () => {
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));

    const fetchCached = unstable_cache(
        async () => {
            const now = Math.round(Date.now() / 1000);
            const res = await anilist.fetchAiringSchedule(1, 40, now - (86400 * 3), now);

            if (res.results) {
                res.results.sort((a: any, b: any) => b.airingAt - a.airingAt);
            }

            return normalizeAnimeTitle(res);
        },
        [`recent-episodes-${currentHour}`],
        { revalidate: 3600 } // 1 hour - needs to be fresher for new episodes
    );
    return fetchCached();
};
