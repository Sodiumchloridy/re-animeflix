import { META, ANIME, StreamingServers } from "@consumet/extensions";

// Create a singleton instance using Anilist for metadata and AnimePahe for episodes.
// This is the most stable and feature-rich combination since standalone providers shut down often.
export const anilist = new META.Anilist(new (ANIME as any).AnimePahe());

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

export const getAnimeInfo = async (id: string) => {
    const res = await anilist.fetchAnimeInfo(id);
    return normalizeAnimeTitle(res);
};

export const getEpisodeSources = async (episodeId: string, server?: StreamingServers) => {
    return await anilist.fetchEpisodeSources(episodeId);
};

export const searchAnime = async (query: string) => {
    const res = await anilist.search(query);
    return normalizeAnimeTitle(res);
};

export const fetchTopAiring = async () => {
    // Anilist has trending natively
    const res = await anilist.fetchTrendingAnime();
    return normalizeAnimeTitle(res);
};

export const fetchRecentEpisodes = async () => {
    // Recent episodes endpoint on consumet for external providers is deprecated
    // Falling back to Trending to avoid 404 and populate the homepage properly
    const res = await anilist.fetchTrendingAnime();
    return normalizeAnimeTitle(res);
};

export const fetchPopularAnime = async () => {
    const res = await anilist.fetchPopularAnime();
    return normalizeAnimeTitle(res);
};
