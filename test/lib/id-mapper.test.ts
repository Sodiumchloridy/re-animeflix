import { describe, it, expect, vi, beforeAll } from "vitest";
import { getAnimeMapping } from "../../app/lib/id-mapper";

const FIXTURE = [
  {
    anilist_id: 172258,
    imdb_id: ["tt28919914"],
    season: { tvdb: 2 },
    type: "TV",
  },
  {
    anilist_id: 146065,
    imdb_id: ["tt15214350"],
    season: { tvdb: 2 },
    type: "TV",
  },
];

beforeAll(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      ({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => FIXTURE,
      }) as any,
    ),
  );
});

describe("ID Mapper", () => {
  it("correctly maps 100 Girlfriends Season 2 (AniList ID 172258) to season 2", async () => {
    const mapping = await getAnimeMapping(172258);
    expect(mapping).not.toBeNull();
    expect(mapping?.season).toBe(2);
    expect(mapping?.imdbId).toBe("tt28919914");
  });

  it("correctly maps Mushoku Tensei Season 2 (AniList ID 146065) to season 2", async () => {
    const mapping = await getAnimeMapping(146065);
    expect(mapping).not.toBeNull();
    expect(mapping?.season).toBe(2);
  });
});
