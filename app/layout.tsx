import type { Metadata } from "next";
import Link from "next/link";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";

export const revalidate = 3600; // revalidate the data at most every hour

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Re: Animeflix",
  description: "An anime discovery, streaming site. Ad-free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.className} text-white bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900/20 to-black min-h-screen bg-fixed selection:bg-purple-500/30`}
      >
        <main className="flex flex-col min-h-screen pt-16">
            {/* Navbar */}
            <nav className="z-50 fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
              <Link href="/" className="flex-shrink-0 hover:scale-105 transition-transform">
                <Image
                  alt="animeflix logo"
                  width={30}
                  height={30}
                  src="/animeflix.svg"
                  unoptimized
                />
              </Link>
              {/* Search Box */}
              <form
                action="/search"
                className="h-10 w-full max-w-[500px] bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-purple-500/50 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.2)] rounded-full flex items-center mx-8 transition-all duration-300"
              >
                {/* Search Icon */}
                <button type="submit" className="pl-4 pr-2">
                  <svg
                    className="fill-white/70 w-4 h-4 hover:fill-white transition-colors"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                  </svg>
                </button>
              {/* Search Input */}
              <input
                className="bg-transparent w-full pr-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none"
                type="text"
                name="query"
                placeholder="Search anime..."
              ></input>
            </form>
            <div className="w-[30px] hidden sm:block"></div>
          </nav>
          {/* Content */}
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
            {children}
          </div>
            {/* Footer */}
            <div className="mt-auto text-white/60 bg-white/5 backdrop-blur-md border-t border-white/10 w-full p-8 text-sm grid place-items-center gap-2">
              <p>
                &copy; Animeflix {new Date().getFullYear()} by&nbsp;
                <a className="text-purple-400 hover:text-purple-300 transition-colors" href="https://github.com/Sodiumchloridy">Sodiumchloridy</a>
                .
              </p>
              <p className="text-center">
                This site does not store any files on its server. All contents
                are provided by non-affiliated third parties.
              </p>
            </div>
          </main>
        </body>
    </html>
  );
}
