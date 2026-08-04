import { describe, it, expect } from 'vitest'
import { fetchRecentEpisodes, fetchTopAiring, getAnimeInfo, getEpisodeSources, searchAnime } from '../../app/lib/anime-client'

describe('Anime Client', () => {
  it('returns a filled object of anime data', async () => {
    const data = await getAnimeInfo('1535');
    expect(data).not.toBeNull();
    expect(data).toHaveProperty('title');
  });

  it('returns a filled object of episode sources and multi-server embed options', async () => {
    const data = await getEpisodeSources(
      'arifureta-shokugyou-de-sekai-saikyou-season-3-episode-1',
      '1535',
      1
    );
    expect(data.sources).not.toEqual([]);
    expect(data.servers.length).toBeGreaterThan(0);
    expect(data.servers[0]).toHaveProperty('url');
    expect(data.servers[0]).toHaveProperty('isEmbed');
  });

  it('returns a filled array of anime list', async () => {
    const data = await searchAnime('spy x family');
    expect(data.results).not.toEqual([]);
  });

  it('returns a filled array of top airing anime list', async () => {
    const data = await fetchTopAiring();
    expect(data.results).not.toEqual([]);

    const resultSample = data.results[0];
    expect(resultSample).toHaveProperty('genres');
    expect(resultSample).toHaveProperty('id');
    expect(resultSample).toHaveProperty('title');
  });

  it('returns a filled array of recent episodes', async () => {
    const data = await fetchRecentEpisodes();
    expect(data.results).not.toEqual([]);
  });
})