"use client";
import React, { useEffect, useState } from "react";

interface AdBlockEnforcerProps {
    children: React.ReactNode;
}

export default function AdBlockEnforcer({ children }: AdBlockEnforcerProps) {
    const [isAdBlockerActive, setIsAdBlockerActive] = useState<boolean | null>(null);
    const [bypassed, setBypassed] = useState(false);

    // Check session storage on mount so user isn't prompted repeatedly during a viewing session
    useEffect(() => {
        if (typeof window !== "undefined" && window.sessionStorage.getItem("adblock_bypassed") === "true") {
            setBypassed(true);
        }
    }, []);

    const detectAdBlocker = async () => {
        let isBlocked = false;

        // Probe 1: Brave Browser & AdGuard object detection
        try {
            if (typeof window !== "undefined" && "adguard" in window) {
                setIsAdBlockerActive(true);
                return;
            }
            if (typeof navigator !== "undefined" && (navigator as any).brave?.isBrave) {
                const isBrave = await (navigator as any).brave.isBrave();
                if (isBrave) {
                    setIsAdBlockerActive(true);
                    return;
                }
            }
        } catch {
            // Ignore error and continue probing
        }

        // Probe 2: Script Tag Load Failure / uBlock Origin Stubbing
        const scriptBlocked = await new Promise<boolean>((resolve) => {
            if (typeof document === "undefined") return resolve(false);
            const script = document.createElement("script");
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?t=" + Date.now();
            script.async = true;

            const timeout = setTimeout(() => {
                script.remove();
                resolve(false);
            }, 1500);

            script.onerror = () => {
                clearTimeout(timeout);
                script.remove();
                resolve(true);
            };
            script.onload = () => {
                clearTimeout(timeout);
                script.remove();
                // If uBlock stubbed the script, window.adsbygoogle won't be initialized as expected
                resolve(!("adsbygoogle" in window));
            };

            document.head.appendChild(script);
        });

        if (scriptBlocked) {
            isBlocked = true;
        }

        // Probe 3: Fetch Probing against known ad & popunder domains
        if (!isBlocked) {
            const trackerUrls = [
                "https://static.popads.net/pop.js",
                "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
                "https://adservice.google.com/adsid/integrator.js",
            ];
            for (const url of trackerUrls) {
                try {
                    await fetch(url, { method: "GET", mode: "no-cors", cache: "no-store" });
                } catch {
                    isBlocked = true;
                    break;
                }
            }
        }

        // Probe 4: DOM Cosmetic Filter Detection
        if (!isBlocked && typeof document !== "undefined") {
            const bait = document.createElement("div");
            bait.className = "adsbygoogle ad-banner pub_300x250 pub_300x250m ad-slot text-ad text_ad ad_box";
            bait.style.cssText = "width: 100px; height: 100px; opacity: 0.01; position: absolute; top: -1000px; left: -1000px; pointer-events: none;";
            bait.setAttribute("aria-hidden", "true");
            document.body.appendChild(bait);

            await new Promise((r) => setTimeout(r, 60));

            const style = window.getComputedStyle(bait);
            if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                bait.offsetHeight === 0 ||
                bait.clientHeight === 0
            ) {
                isBlocked = true;
            }
            bait.remove();
        }

        setIsAdBlockerActive(isBlocked);
    };

    useEffect(() => {
        detectAdBlocker();
    }, []);

    const handleBypass = () => {
        setBypassed(true);
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem("adblock_bypassed", "true");
        }
    };

    // If ad blocker is detected, user explicitly bypassed, or initial check is loading, render player
    if (isAdBlockerActive === true || bypassed || isAdBlockerActive === null) {
        return <>{children}</>;
    }

    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-b from-slate-950/95 via-black/90 to-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center shadow-[0_0_60px_rgba(147,51,234,0.15)] group">
            {/* Ambient Background Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Header Shield Icon */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(147,51,234,0.25)]">
                <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-ping opacity-25" />
                <svg className="w-8 h-8 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>

            {/* Title & Description */}
            <h3 className="relative z-10 text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300 tracking-tight mb-2">
                Ad Blocker Recommended
            </h3>
            <p className="relative z-10 text-xs sm:text-sm text-white/70 max-w-md mb-6 leading-relaxed">
                Third-party video servers may trigger popups or redirect ads. Install a trusted ad blocker below for a smooth streaming experience:
            </p>

            {/* Extension Cards with Custom SVG Logos */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 mb-6 max-w-xl">
                {/* AdGuard Chrome/Edge */}
                <a
                    href="https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-white/90 hover:text-white transition-all duration-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:-translate-y-0.5"
                >
                    <svg className="w-4 h-4 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                        <path d="M12 1L3.5 4.5v6.2c0 5.6 3.6 10.8 8.5 12.3 4.9-1.5 8.5-6.7 8.5-12.3V4.5L12 1zm-1.2 14.8l-3.6-3.6 1.4-1.4 2.2 2.2 5.6-5.6 1.4 1.4-7 7z" />
                    </svg>
                    <span>AdGuard (Chrome / Edge)</span>
                </a>

                {/* AdGuard Firefox */}
                <a
                    href="https://addons.mozilla.org/en-US/firefox/addon/adguard-adblocker/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-orange-500/40 text-xs font-medium text-white/90 hover:text-white transition-all duration-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.15)] hover:-translate-y-0.5"
                >
                    <svg className="w-4 h-4 fill-orange-400 shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09.32.22.65.37.95 1.07 2.14 3.26 3.6 5.79 3.6 2.05 0 3.9-.95 5.1-2.45-.04.47-.1.95-.2 1.42-.87 3.39-3.79 6-7.27 6.2z" />
                    </svg>
                    <span>AdGuard (Firefox)</span>
                </a>

                {/* uBlock Origin Lite */}
                <a
                    href="https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-rose-500/40 text-xs font-medium text-white/90 hover:text-white transition-all duration-300 hover:shadow-[0_4px_20px_rgba(244,63,94,0.15)] hover:-translate-y-0.5"
                >
                    <svg className="w-4 h-4 fill-rose-400 shrink-0" viewBox="0 0 24 24">
                        <path d="M12 1L3.5 4.5v6.2c0 5.6 3.6 10.8 8.5 12.3 4.9-1.5 8.5-6.7 8.5-12.3V4.5L12 1zm-1 15h2v-2h-2v2zm0-4h2V7h-2v5z" />
                    </svg>
                    <span>uBlock Origin Lite</span>
                </a>
            </div>

            {/* Action Section */}
            <div className="relative z-10 flex flex-col items-center gap-3">
                <button
                    onClick={() => detectAdBlocker()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 border border-purple-400/40 flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-check Ad Blocker
                </button>
                <button
                    onClick={handleBypass}
                    className="text-xs text-white/40 hover:text-white/80 underline decoration-white/20 hover:decoration-white/50 underline-offset-4 transition-colors font-normal pt-1"
                >
                    I already have an adblocker
                </button>
            </div>
        </div>
    );
}
