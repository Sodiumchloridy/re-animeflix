import { describe, it, expect } from 'vitest'
import { fetchPopularAnime, fetchRecentEpisodes, fetchTopAiring, getAnimeInfo, getEpisodeSources, searchAnime } from '../../app/lib/anime-client'
import { StreamingServers } from '@consumet/extensions';

describe('Anime Client', () => {
  it('returns a filled object of anime data', async () => {
    const data = await getAnimeInfo('spy-x-family');
    expect(data).not.toBeNull();
  });

  it('returns a filled object of episode sources', async () => {
    const data = await getEpisodeSources(
      'arifureta-shokugyou-de-sekai-saikyou-season-3-episode-1',
      StreamingServers.GogoCDN
    );
    expect(data.sources).not.toEqual([]);
    expect(data.subtitles).not.toEqual([]);
  });

  it('returns a filled array of anime list', async () => {
    const data = await searchAnime('spy x family');
    expect(data.results).not.toEqual([]);
  });

  it('returns a filled array of anime list', async () => {
    const data = await fetchTopAiring();
    expect(data).not.toEqual([]);

    const resultSample = data.results[0];
    expect(resultSample).toHaveProperty('genres');
    expect(resultSample).toHaveProperty('episodeNumber');
    expect(resultSample).toHaveProperty('episodeId');
  });

  it('returns a filled array of recent episodes', async () => {
    const data = await fetchRecentEpisodes();
    expect(data).not.toEqual([]);
  });

  it('returns a filled array of popular anime', async () => {
    const data = await fetchPopularAnime();
    expect(data).not.toEqual([]);
  });
})