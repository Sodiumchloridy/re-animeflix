"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function FloatingDock() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const focusSearch = () => {
    const searchInput = document.getElementById("main-search-input");
    if (searchInput) {
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Home */}
      <Link
        href="/"
        className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Home"
        title="Home"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6" />
        </svg>
      </Link>

      {/* Search */}
      <button
        onClick={focusSearch}
        className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Focus Search"
        title="Quick Search (Ctrl+K)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-[1px] h-4 bg-white/10 mx-1" />

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="p-2 rounded-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 transition-all"
          aria-label="Scroll to top"
          title="Scroll to Top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
