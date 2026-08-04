import { NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': '*',
};

const getReferer = (urlStr: string, origin: string) =>
    /hub26link|dev23app|pro25zone|kwik\.cx/.test(urlStr) ? 'https://kwik.cx/' : origin || 'https://kwik.cx/';

export async function GET(request: Request) {
    try {
        const videoUrl = new URL(request.url).searchParams.get('url');
        if (!videoUrl) return new NextResponse('Missing URL parameter', { status: 400 });

        const decodedUrl = decodeURIComponent(videoUrl);
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(decodedUrl);
        } catch {
            return new NextResponse('Invalid URL parameter', { status: 400 });
        }

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return new NextResponse('Unsupported URL protocol', { status: 400 });
        }

        const response = await fetch(decodedUrl, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': getReferer(decodedUrl, parsedUrl.origin)
            }
        });

        if (!response.ok) {
            return new NextResponse(`Upstream server error: ${response.statusText}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/vnd.apple.mpegurl')) {
            const text = await response.text();
            const baseUrl = parsedUrl.origin;
            const basePath = parsedUrl.pathname.split('/').slice(0, -1).join('/');

            const toProxyUrl = (match: string) => {
                const abs = match.startsWith('http') ? match : match.startsWith('/') ? `${baseUrl}${match}` : `${baseUrl}${basePath}/${match}`;
                return `/api/proxy?url=${encodeURIComponent(abs)}`;
            };

            const modifiedContent = text
                .replace(/^(?!#)([^\s#]+\.(m3u8|ts|js|jpg|gif|jpeg|png|webp|mp4|aac))$/gm, toProxyUrl)
                .replace(/^(?!#)(https?:\/\/[^\s#]+)$/gm, toProxyUrl)
                .replace(/URI="([^"]+)"/g, (m, uri) => uri.startsWith('data:') ? m : `URI="${toProxyUrl(uri)}"`);

            return new NextResponse(modifiedContent, {
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/vnd.apple.mpegurl' },
            });
        }

        const data = await response.blob();
        return new NextResponse(data, {
            headers: { ...CORS_HEADERS, 'Content-Type': contentType || 'application/octet-stream' },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 