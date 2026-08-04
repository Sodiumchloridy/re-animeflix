import { describe, it, expect } from 'vitest';
import { getAnimeMapping } from '../../app/lib/id-mapper';

describe('ID Mapper', () => {
  it('correctly maps 100 Girlfriends Season 2 (AniList ID 172258) to season 2', async () => {
    const mapping = await getAnimeMapping(172258);
    expect(mapping).not.toBeNull();
    expect(mapping?.season).toBe(2);
    expect(mapping?.imdbId).toBe('tt28919914');
  });

  it('correctly maps Mushoku Tensei Season 2 (AniList ID 146065) to season 2', async () => {
    const mapping = await getAnimeMapping(146065);
    expect(mapping).not.toBeNull();
    expect(mapping?.season).toBe(2);
  });
});
