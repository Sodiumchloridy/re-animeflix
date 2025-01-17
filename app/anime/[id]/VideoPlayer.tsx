"use client";
import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

interface PlayerProps {
    option: {
        url: string;
        [key: string]: any;
    };
    [key: string]: any;
}

function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
    if (Hls.isSupported()) {
        if (art.hls) art.hls.destroy();
        const hls = new Hls();
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        hls.loadSource(proxyUrl);
        hls.attachMedia(video);
        art.hls = hls;
        art.on('destroy', () => hls.destroy());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = `/api/proxy?url=${encodeURIComponent(url)}`;
    } else {
        art.notice.show = 'Unsupported playback format: m3u8';
    }
}

export default function Player({ option, ...rest }: PlayerProps) {
    const artRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (artRef.current) {
            const art = new Artplayer({
                ...option,
                container: artRef.current,
                type: 'm3u8',
                customType: {
                    m3u8: playM3u8,
                },
                fullscreen: true,
            });

            art.on('ready', () => {
                console.info(art.hls);
            });

            return () => {
                if (art && art.destroy) {
                    art.destroy(false);
                }
            };
        }
    }, []);

    return <div className='w-full h-[60vh]' ref={artRef} {...rest}></div>;
}