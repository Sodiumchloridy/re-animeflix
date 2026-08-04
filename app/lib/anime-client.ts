import { unstable_cache } from "next/cache";
import { getAnimeMapping } from "./id-mapper";

const ANILIST_API = "https://graphql.anilist.co";

const getMediaTitle = (titleObj?: { english?: string; romaji?: string; native?: string }): string => {
    return titleObj?.english || titleObj?.romaji || titleObj?.native || "Unknown Title";
};

const getMediaCover = (coverObj?: { extraLarge?: string; large?: string }): string => {
    return coverObj?.extraLarge || coverObj?.large || "";
};

async function anilistGraphQL(query: string, variables: Record<string, unknown> = {}) {
    const res = await fetch(ANILIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
        throw new Error(`AniList API responded with status ${res.status}`);
    }
    const json = await res.json();
    if (json.errors) {
        throw new Error(json.errors[0]?.message || "AniList GraphQL Error");
    }
    return json.data;
}

const safeCache = async <T>(
    fn: () => Promise<T>,
    keyParts: string[],
    options?: { revalidate?: number | false; tags?: string[] }
): Promise<T> => {
    try {
        const fetchCached = unstable_cache(fn, keyParts, options);
        return await fetchCached();
    } catch {
        return await fn();
    }
};

export const getAnimeInfo = async (id: string) => {
    return safeCache(
        async () => {
            const isNumeric = /^\d+$/.test(id);
            const mediaFields = `
                id
                idMal
                title { english romaji native }
                coverImage { extraLarge large }
                bannerImage
                description
                status
                genres
                episodes
                format
                nextAiringEpisode { episode }
                streamingEpisodes { title url }
                relations {
                    edges {
                        relationType
                        node {
                            id
                            title { english romaji native }
                            coverImage { extraLarge large }
                            format
                            status
                            type
                        }
                    }
                }
            `;
            const query = isNumeric
                ? `query ($id: Int) { Media (id: $id, type: ANIME) { ${mediaFields} } }`
                : `query ($search: String) { Media (search: $search, type: ANIME) { ${mediaFields} } }`;

            const variables = isNumeric ? { id: parseInt(id, 10) } : { search: id };
            const data = await anilistGraphQL(query, variables);
            const media = data?.Media;
            if (!media) return null;

            // Map streaming episode titles by episode number
            const streamEpMap = new Map<number, string>();
            if (media.streamingEpisodes) {
                for (const ep of media.streamingEpisodes) {
                    const match = ep.title?.match(/Episode\s+(\d+)/i);
                    if (match) {
                        streamEpMap.set(parseInt(match[1], 10), ep.title);
                    }
                }
            }

            let maxStreamEp = 0;
            if (streamEpMap.size > 0) {
                maxStreamEp = Math.max(...Array.from(streamEpMap.keys()));
            }

            // Calculate aired episodes count based on release status
            let totalEp = media.episodes;
            let airedEp = totalEp;

            if (media.status === "RELEASING") {
                if (media.nextAiringEpisode?.episode) {
                    airedEp = media.nextAiringEpisode.episode - 1;
                } else if (maxStreamEp > 0) {
                    airedEp = maxStreamEp;
                } else {
                    airedEp = media.episodes || 1;
                }
            } else if (media.status === "NOT_YET_RELEASED") {
                airedEp = 0;
            } else {
                if (!airedEp) {
                    if (maxStreamEp > 0) {
                        airedEp = maxStreamEp;
                    } else if (["MOVIE", "ONE_SHOT", "MUSIC"].includes(media.format)) {
                        airedEp = 1;
                    } else {
                        airedEp = 12;
                    }
                }
            }
            airedEp = Math.max(airedEp, 0);

            const episodesList = Array.from({ length: airedEp }, (_, i) => {
                const epNum = i + 1;
                const streamTitle = streamEpMap.get(epNum);
                return {
                    id: `${media.id}-${epNum}`,
                    number: epNum,
                    title: streamTitle || `Episode ${epNum}`,
                };
            });

            // Map related anime seasons
            const relationsList = (media.relations?.edges || [])
                .filter((edge: any) => edge.node && edge.node.type === "ANIME")
                .map((edge: any) => ({
                    id: String(edge.node.id),
                    title: getMediaTitle(edge.node.title),
                    image: getMediaCover(edge.node.coverImage),
                    relationType: edge.relationType,
                    type: edge.node.format || "TV",
                    status: edge.node.status,
                }));

            return {
                id: String(media.id),
                title: getMediaTitle(media.title),
                image: getMediaCover(media.coverImage),
                description: media.description,
                status: media.status,
                genres: media.genres || [],
                episodes: episodesList,
                relations: relationsList,
                hasSub: true,
                type: media.format || "TV",
            };
        },
        [`anime-info-v5-${id}`],
        { revalidate: 86400 }
    );
};

export interface EmbedServer {
    id: string;
    name: string;
    url: string;
    isEmbed: boolean;
}

export const getEpisodeSources = async (
    episodeId: string,
    anilistId?: string,
    episodeNum: number = 1
) => {
    const servers: EmbedServer[] = [];

    const numericId = anilistId || episodeId.split("-")[0];
    const mapping = numericId ? await getAnimeMapping(numericId) : null;

    if (mapping?.imdbId) {
        const season = mapping.season ?? 1;
        const isMovie = mapping.type === "MOVIE" || mapping.type === "Movie";

        // Server 1: VidSrc.to
        servers.push({
            id: "vidsrc-to",
            name: "Server 1 (VidSrc.to)",
            url: isMovie 
                ? `https://vidsrc.to/embed/movie/${mapping.imdbId}?ds_lang=en`
                : `https://vidsrc.to/embed/tv/${mapping.imdbId}/${season}/${episodeNum}?ds_lang=en`,
            isEmbed: true,
        });

        // Server 2: VidSrc.me
        servers.push({
            id: "vidsrc-me",
            name: "Server 2 (VidSrc.me)",
            url: isMovie
                ? `https://vidsrc.me/embed/movie/${mapping.imdbId}?ds_lang=en`
                : `https://vidsrc.me/embed/tv/${mapping.imdbId}/${season}-${episodeNum}?ds_lang=en`,
            isEmbed: true,
        });

        // Server 3: 2Embed
        servers.push({
            id: "2embed",
            name: "Server 3 (2Embed)",
            url: isMovie
                ? `https://www.2embed.cc/embed/${mapping.imdbId}`
                : `https://www.2embed.cc/embedtv/${mapping.imdbId}&s=${season}&e=${episodeNum}`,
            isEmbed: true,
        });
    } else {
        // Fallback server if no IMDB ID mapping exists
        const fallbackId = anilistId || episodeId.split("-")[0] || "1535";
        servers.push({
            id: "vidsrc-to-fallback",
            name: "Server 1 (VidSrc.to)",
            url: `https://vidsrc.to/embed/anime/${encodeURIComponent(fallbackId)}/${episodeNum}`,
            isEmbed: true,
        });
        servers.push({
            id: "vidsrc-me-fallback",
            name: "Server 2 (VidSrc.me)",
            url: `https://vidsrc.me/embed/anime/${encodeURIComponent(fallbackId)}/${episodeNum}`,
            isEmbed: true,
        });
    }

    const primary = servers[0];
    return {
        sources: [{ url: primary.url, isEmbed: primary.isEmbed, quality: "default" }],
        servers,
        server: primary.name,
    };
};

export const searchAnime = async (query: string) => {
    const gql = `query ($search: String) {
        Page (page: 1, perPage: 24) {
            media (search: $search, type: ANIME) {
                id
                title { english romaji native }
                coverImage { extraLarge large }
                genres
                status
                episodes
                format
            }
        }
    }`;
    const data = await anilistGraphQL(gql, { search: query });
    const results = (data?.Page?.media || [])
        .filter((anime: any) => anime.format !== "ONA")
        .map((anime: any) => ({
            id: String(anime.id),
            title: getMediaTitle(anime.title),
            image: getMediaCover(anime.coverImage),
            genres: anime.genres || [],
            status: anime.status,
            episodes: anime.episodes,
            type: anime.format,
        }));
    return { results };
};

export const fetchTopAiring = async () => {
    return safeCache(
        async () => {
            const gql = `query {
                Page (page: 1, perPage: 20) {
                    media (type: ANIME, sort: TRENDING_DESC) {
                        id
                        title { english romaji native }
                        coverImage { extraLarge large }
                        genres
                        status
                        episodes
                        format
                    }
                }
            }`;
            const data = await anilistGraphQL(gql);
            const results = (data?.Page?.media || [])
                .filter((anime: any) => anime.format !== "ONA")
                .map((anime: any) => ({
                    id: String(anime.id),
                    title: getMediaTitle(anime.title),
                    image: getMediaCover(anime.coverImage),
                    genres: anime.genres || [],
                    status: anime.status,
                    episodeNumber: anime.episodes,
                    episodeId: `${anime.id}-1`,
                    type: anime.format,
                }));
            return { results };
        },
        ["top-airing-v3"],
        { revalidate: 86400 }
    );
};

export const fetchRecentEpisodes = async () => {
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));

    return safeCache(
        async () => {
            const gql = `query {
                Page (page: 1, perPage: 30) {
                    airingSchedules (sort: TIME_DESC, airingAt_lesser: ${Math.floor(Date.now() / 1000)}) {
                        episode
                        airingAt
                        media {
                            id
                            title { english romaji native }
                            coverImage { extraLarge large }
                            genres
                            status
                            format
                        }
                    }
                }
            }`;
            const data = await anilistGraphQL(gql);
            const results = (data?.Page?.airingSchedules || [])
                .filter((item: any) => item.media && item.media.format !== "ONA")
                .map((item: any) => ({
                    id: String(item.media.id),
                    title: getMediaTitle(item.media.title),
                    image: getMediaCover(item.media.coverImage),
                    genres: item.media.genres || [],
                    status: item.media.status,
                    episodeNumber: item.episode,
                    episodeId: `${item.media.id}-${item.episode}`,
                    airingAt: item.airingAt,
                    type: item.media.format,
                }));
            return { results };
        },
        [`recent-episodes-v2-${currentHour}`],
        { revalidate: 3600 }
    );
};
