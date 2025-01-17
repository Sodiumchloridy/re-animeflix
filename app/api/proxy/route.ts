import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const videoUrl = url.searchParams.get('url');

        if (!videoUrl) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        const decodedUrl = decodeURIComponent(videoUrl);
        const response = await fetch(decodedUrl, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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

            // Replace relative URLs with absolute URLs through our proxy
            const modifiedContent = text.replace(/^(?!#)(.+\.m3u8|.+\.ts)$/gm, (match) => {
                const absoluteUrl = match.startsWith('http')
                    ? match
                    : match.startsWith('/')
                        ? `${baseUrl}${match}`
                        : `${baseUrl}${basePath}/${match}`;
                return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
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

        // For non-M3U8 files, return as blob
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