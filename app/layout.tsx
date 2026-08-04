import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import FloatingDock from "./_components/FloatingDock";
import HeaderSearch from "./_components/HeaderSearch";

export const revalidate = 3600;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Re: Animeflix — Accessible & Streamlined Anime Discovery",
  description: "Experience ultra-fast anime discovery and streaming with custom players, HD streams, and modern visual design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} text-zinc-100 bg-[#090a0f] min-h-screen flex flex-col antialiased selection:bg-purple-500/30 selection:text-purple-200`}
      >
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full h-16 bg-[#090a0f]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group outline-none focus:outline-none focus:ring-0 p-1">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                  <Image
                    alt="Re:Animeflix logo"
                    width={20}
                    height={20}
                    src="/animeflix.svg"
                    unoptimized
                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-purple-300">
                Anime<span className="text-purple-400">flix</span>
              </span>
            </Link>

            {/* Search Input Bar (Miruro / Lunar style with debounced instant search) */}
            <HeaderSearch />

            {/* Right side navigation items */}
            <nav className="flex items-center gap-3">
              <Link
                href="/search"
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-zinc-300 hover:text-white transition-all"
              >
                Catalog
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
          {children}
        </main>

        {/* Floating Quick Dock */}
        <FloatingDock />

        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-zinc-950/80 backdrop-blur-md py-8 px-4 text-xs text-zinc-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-200">Re: Animeflix</span>
              <span>&copy; {new Date().getFullYear()}</span>
              <span>•</span>
              <a
                href="https://github.com/Sodiumchloridy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sodiumchloridy
              </a>
            </div>
            <p className="text-center sm:text-right text-zinc-500 max-w-md leading-relaxed">
              This site does not host any media files. All content is provided by non-affiliated third party services.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
