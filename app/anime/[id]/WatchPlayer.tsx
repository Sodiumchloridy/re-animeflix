"use client";

import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import AdBlockEnforcer from "@/app/_components/AdBlockEnforcer";
import { EmbedServer } from "@/app/lib/anime-client";

interface WatchPlayerProps {
    servers: EmbedServer[];
    animeTitle?: string;
}

export default function WatchPlayer({ servers, animeTitle }: WatchPlayerProps) {
    const [activeServerIndex, setActiveServerIndex] = useState(0);

    if (!servers || servers.length === 0) {
        return (
            <div className="w-full max-w-6xl bg-[#12151e] rounded-2xl border border-white/10 p-12 text-center text-zinc-400 min-h-[350px] flex flex-col items-center justify-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-sm font-medium">Video stream source currently unavailable. Please try again later or check another title.</p>
            </div>
        );
    }

    const currentServer = servers[activeServerIndex] || servers[0];

    return (
        <div className="w-full max-w-6xl flex flex-col space-y-3">
            {/* Server Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#12151e] border border-white/10 rounded-xl shadow-md">
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Stream Server:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {servers.map((server, index) => {
                        const isActive = activeServerIndex === index;
                        return (
                            <button
                                key={server.id || index}
                                onClick={() => setActiveServerIndex(index)}
                                className={`
                                    px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500
                                    ${isActive 
                                        ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)] border border-purple-400" 
                                        : "bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-purple-500/30"}
                                `}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                                {server.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Video Player Wrapped in AdBlockEnforcer */}
            <AdBlockEnforcer>
                <VideoPlayer
                    option={{
                        url: currentServer.url,
                        isEmbed: currentServer.isEmbed,
                        title: animeTitle,
                    }}
                />
            </AdBlockEnforcer>
        </div>
    );
}
