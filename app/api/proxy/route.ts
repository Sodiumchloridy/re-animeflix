import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const videoUrl = url.searchParams.get('url');

        if (!videoUrl) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        const decodedUrl = decodeURIComponent(videoUrl);
        // Determine the referer based on the URL domain
        const getReferer = (url: string) => {
            if (url.includes('hub26link.site') || url.includes('dev23app.site') || url.includes('pro25zone.site') || url.includes('kwik.cx')) {
                return 'https://kwik.cx/';
            }
            try {
                return new URL(url).origin;
            } catch {
                return 'https://kwik.cx/';
            }
        };
        const response = await fetch(decodedUrl, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': getReferer(decodedUrl)
            }
        });

        if (!response.ok) {
            return new NextResponse(`Upstream server error: ${response.statusText}`, {
                status: response.status
            });
        }

        // If it's an M3U8 file, we need to modify the contents
        if (response.headers.get('Content-Type')?.includes('application/vnd.apple.mpegurl')) {
            const text = await response.text();
            const baseUrl = new URL(decodedUrl).origin;
            const pathParts = new URL(decodedUrl).pathname.split('/');
            pathParts.pop(); // Remove the filename
            const basePath = pathParts.join('/');

            const toProxyUrl = (match: string) => {
                const absoluteUrl = match.startsWith('http')
                    ? match
                    : match.startsWith('/')
                        ? `${baseUrl}${match}`
                        : `${baseUrl}${basePath}/${match}`;
                return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
            };

            // Replace all segment URLs - match any non-comment, non-empty line that looks like a URL/path
            let modifiedContent = text.replace(/^(?!#)([^\s#]+\.(m3u8|ts|js|jpg|gif|jpeg|png|webp|mp4|aac))$/gm, toProxyUrl);

            // Also catch any line that's a full http URL (for variant playlists)
            modifiedContent = modifiedContent.replace(/^(?!#)(https?:\/\/[^\s#]+)$/gm, toProxyUrl);

            // Intercept decryption keys embedded inside #EXT-X-KEY tags
            modifiedContent = modifiedContent.replace(/URI="([^"]+)"/g, (match, uri) => {
                if (uri.startsWith('data:')) return match;
                return `URI="${toProxyUrl(uri)}"`;
            });

            return new NextResponse(modifiedContent, {
                headers: {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Expose-Headers': '*',
                },
            });
        }

        // For non-M3U8 files (video segments), return as blob with proper headers
        const data = await response.blob();
        return new NextResponse(data, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Expose-Headers': '*',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 