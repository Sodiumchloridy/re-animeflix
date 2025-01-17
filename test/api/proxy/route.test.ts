import { GET } from '../../../app/api/proxy/route';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Proxy API', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should return 400 if URL parameter is missing', async () => {
        const request = new Request('http://localhost/api/proxy');
        const response = await GET(request);

        expect(response.status).toBe(400);
        expect(await response.text()).toBe('Missing URL parameter');
    });

    it('should proxy regular content correctly', async () => {
        global.fetch = vi.fn().mockResolvedValue(new Response('test content', {
            headers: {
                'Content-Type': 'text/plain'
            },
            status: 200
        }));

        const request = new Request('http://localhost/api/proxy?url=' + encodeURIComponent('https://example.com/test.txt'));
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/plain');
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
        expect(await response.text()).toBe('test content');
    });

    it('should handle M3U8 content and rewrite URLs', async () => {
        const m3u8Content = `
            #EXTM3U
            #EXT-X-VERSION:3
            segment1.ts
            /absolute/segment2.ts
            https://example.com/segment3.ts
            subfolder/segment4.ts
        `.replaceAll(' ', '');

        global.fetch = vi.fn().mockResolvedValue(new Response(m3u8Content, {
            headers: {
                'Content-Type': 'application/vnd.apple.mpegurl'
            },
            status: 200
        }));

        const request = new Request('http://localhost/api/proxy?url=' + encodeURIComponent('https://example.com/path/playlist.m3u8'));
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/vnd.apple.mpegurl');

        const responseText = await response.text();
        expect(responseText).toContain('/api/proxy?url=https%3A%2F%2Fexample.com%2Fpath%2Fsegment1.ts');
        expect(responseText).toContain('/api/proxy?url=https%3A%2F%2Fexample.com%2Fabsolute%2Fsegment2.ts');
        expect(responseText).toContain('/api/proxy?url=https%3A%2F%2Fexample.com%2Fsegment3.ts');
        expect(responseText).toContain('/api/proxy?url=https%3A%2F%2Fexample.com%2Fpath%2Fsubfolder%2Fsegment4.ts');
    });

    it('should handle upstream server errors', async () => {
        global.fetch = vi.fn().mockResolvedValue(new Response('Not Found', {
            status: 404,
            statusText: 'Not Found'
        }));

        const request = new Request('http://localhost/api/proxy?url=' + encodeURIComponent('https://example.com/notfound'));
        const response = await GET(request);

        expect(response.status).toBe(404);
        expect(await response.text()).toBe('Upstream server error: Not Found');
    });

    it('should handle network errors', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const request = new Request('http://localhost/api/proxy?url=' + encodeURIComponent('https://example.com/error'));
        const response = await GET(request);

        expect(response.status).toBe(500);
        expect(await response.text()).toBe('Internal Server Error');
    });
});