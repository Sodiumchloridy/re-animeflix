import { unstable_cache } from "next/cache";
import { getAnimeMapping } from "./id-mapper";

const ANILIST_API = "https://graphql.anilist.co";

const getMediaTitle = (t?: { english?: string; romaji?: string; native?: string }) =>
    t?.english || t?.romaji || t?.native || "Unknown Title";

const getMediaCover = (c?: { extraLarge?: string; large?: string }) =>
    c?.extraLarge || c?.large || "";

async function anilistGraphQL(query: string, variables: Record<string, unknown> = {}) {
    const res = await fetch(ANILIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`AniList API responded with status ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0]?.message || "AniList GraphQL Error");
    return json.data;
}

const safeCache = async <T>(
    fn: () => Promise<T>,
    keyParts: string[],
    options?: { revalidate?: number | false; tags?: string[] }
): Promise<T> => {
    try {
        return await unstable_cache(fn, keyParts, options)();
    } catch {
        return await fn();
    }
};

export const getAnimeInfo = async (id: string) => {
    return safeCache(
        async () => {
            const isNumeric = /^\d+$/.test(id);
            const mediaFields = `id idMal title { english romaji native } coverImage { extraLarge large } bannerImage description status genres episodes format nextAiringEpisode { episode } streamingEpisodes { title url } relations { edges { relationType node { id title { english romaji native } coverImage { extraLarge large } format status type } } }`;
            const query = isNumeric
                ? `query ($id: Int) { Media (id: $id, type: ANIME) { ${mediaFields} } }`
                : `query ($search: String) { Media (search: $search, type: ANIME) { ${mediaFields} } }`;

            const data = await anilistGraphQL(query, isNumeric ? { id: parseInt(id, 10) } : { search: id });
            const media = data?.Media;
            if (!media) return null;

            const streamEpMap = new Map<number, string>();
            if (media.streamingEpisodes) {
                for (const ep of media.streamingEpisodes) {
                    const match = ep.title?.match(/Episode\s+(\d+)/i);
                    if (match) streamEpMap.set(parseInt(match[1], 10), ep.title);
                }
            }
            const maxStreamEp = streamEpMap.size > 0 ? Math.max(...Array.from(streamEpMap.keys())) : 0;

            let airedEp = media.episodes;
            if (media.status === "RELEASING") {
                airedEp = media.nextAiringEpisode?.episode ? media.nextAiringEpisode.episode - 1 : maxStreamEp || media.episodes || 1;
            } else if (media.status === "NOT_YET_RELEASED") {
                airedEp = 0;
            } else if (!airedEp) {
                airedEp = maxStreamEp || (["MOVIE", "ONE_SHOT", "MUSIC"].includes(media.format) ? 1 : 12);
            }
            airedEp = Math.max(airedEp, 0);

            const episodesList = Array.from({ length: airedEp }, (_, i) => ({
                id: `${media.id}-${i + 1}`,
                number: i + 1,
                title: streamEpMap.get(i + 1) || `Episode ${i + 1}`,
            }));

            const relationsList = (media.relations?.edges || [])
                .filter((e: any) => e.node?.type === "ANIME")
                .map((e: any) => ({
                    id: String(e.node.id),
                    title: getMediaTitle(e.node.title),
                    image: getMediaCover(e.node.coverImage),
                    relationType: e.relationType,
                    type: e.node.format || "TV",
                    status: e.node.status,
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
    const numericId = anilistId || episodeId.split("-")[0] || "1535";
    const mapping = await getAnimeMapping(numericId);
    const servers: EmbedServer[] = [];

    if (mapping?.imdbId) {
        const s = mapping.season ?? 1;
        const isMovie = mapping.type === "MOVIE" || mapping.type === "Movie";
        const imdb = mapping.imdbId;

        servers.push(
            { id: "vidsrc-to", name: "Server 1 (VidSrc.to)", url: isMovie ? `https://vidsrc.to/embed/movie/${imdb}?ds_lang=en` : `https://vidsrc.to/embed/tv/${imdb}/${s}/${episodeNum}?ds_lang=en`, isEmbed: true },
            { id: "vidsrc-me", name: "Server 2 (VidSrc.me)", url: isMovie ? `https://vidsrc.me/embed/movie/${imdb}?ds_lang=en` : `https://vidsrc.me/embed/tv/${imdb}/${s}-${episodeNum}?ds_lang=en`, isEmbed: true },
            { id: "2embed", name: "Server 3 (2Embed)", url: isMovie ? `https://www.2embed.cc/embed/${imdb}` : `https://www.2embed.cc/embedtv/${imdb}&s=${s}&e=${episodeNum}`, isEmbed: true }
        );
    } else {
        const idEnc = encodeURIComponent(numericId);
        servers.push(
            { id: "vidsrc-to-fallback", name: "Server 1 (VidSrc.to)", url: `https://vidsrc.to/embed/anime/${idEnc}/${episodeNum}`, isEmbed: true },
            { id: "vidsrc-me-fallback", name: "Server 2 (VidSrc.me)", url: `https://vidsrc.me/embed/anime/${idEnc}/${episodeNum}`, isEmbed: true }
        );
    }

    const primary = servers[0];
    return {
        sources: [{ url: primary.url, isEmbed: primary.isEmbed, quality: "default" }],
        servers,
        server: primary.name,
    };
};

export const searchAnime = async (query: string) => {
    const gql = `query ($search: String) { Page (page: 1, perPage: 24) { media (search: $search, type: ANIME) { id title { english romaji native } coverImage { extraLarge large } genres status episodes format } } }`;
    const data = await anilistGraphQL(gql, { search: query });
    const results = (data?.Page?.media || [])
        .filter((a: any) => a.format !== "ONA")
        .map((a: any) => ({
            id: String(a.id),
            title: getMediaTitle(a.title),
            image: getMediaCover(a.coverImage),
            genres: a.genres || [],
            status: a.status,
            episodes: a.episodes,
            type: a.format,
        }));
    return { results };
};

export const fetchTopAiring = async () => {
    return safeCache(
        async () => {
            const gql = `query { Page (page: 1, perPage: 20) { media (type: ANIME, sort: TRENDING_DESC) { id title { english romaji native } coverImage { extraLarge large } genres status episodes format } } }`;
            const data = await anilistGraphQL(gql);
            const results = (data?.Page?.media || [])
                .filter((a: any) => a.format !== "ONA")
                .map((a: any) => ({
                    id: String(a.id),
                    title: getMediaTitle(a.title),
                    image: getMediaCover(a.coverImage),
                    genres: a.genres || [],
                    status: a.status,
                    episodeNumber: a.episodes,
                    episodeId: `${a.id}-1`,
                    type: a.format,
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
            const gql = `query { Page (page: 1, perPage: 30) { airingSchedules (sort: TIME_DESC, airingAt_lesser: ${Math.floor(Date.now() / 1000)}) { episode airingAt media { id title { english romaji native } coverImage { extraLarge large } genres status format } } } }`;
            const data = await anilistGraphQL(gql);
            const results = (data?.Page?.airingSchedules || [])
                .filter((i: any) => i.media && i.media.format !== "ONA")
                .map((i: any) => ({
                    id: String(i.media.id),
                    title: getMediaTitle(i.media.title),
                    image: getMediaCover(i.media.coverImage),
                    genres: i.media.genres || [],
                    status: i.media.status,
                    episodeNumber: i.episode,
                    episodeId: `${i.media.id}-${i.episode}`,
                    airingAt: i.airingAt,
                    type: i.media.format,
                }));
            return { results };
        },
        [`recent-episodes-v2-${currentHour}`],
        { revalidate: 3600 }
    );
};
