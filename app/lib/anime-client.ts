import { ANIME, StreamingServers } from "@consumet/extensions";

// Create a singleton instance
export const gogoanime = new ANIME.Gogoanime();

export const getAnimeInfo = async (id: string) => {
    return await gogoanime.fetchAnimeInfo(id);
};

export const getEpisodeSources = async (episodeId: string, server?: StreamingServers) => {
    return await gogoanime.fetchEpisodeSources(episodeId, server);
};

export const searchAnime = async (query: string) => {
    return await gogoanime.search(query);
};

export const fetchTopAiring = async () => {
    return await gogoanime.fetchTopAiring();
};

export const fetchRecentEpisodes = async () => {
    return await gogoanime.fetchRecentEpisodes();
};

export const fetchPopularAnime = async () => {
    return await gogoanime.fetchPopular();
};
