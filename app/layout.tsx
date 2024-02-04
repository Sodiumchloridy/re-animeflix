import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Re: Animeflix",
  description: "Animeflix rebuilt for the n-th time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <main>
          {/* Navbar */}
          <nav className="z-50 fixed top-0 flex left-0 right-0 items-center h-16 bg-black/75 shadow-md backdrop-blur-sm">
            <a className="ml-8 w-fit h-fit text-white" href="/">
              <Image
                alt="animeflix logo"
                width={30}
                height={30}
                src="/animeflix.svg"
                unoptimized
              />
            </a>
          </nav>

          {/* Content */}
          {children}

          {/* Footer */}
          <div className="text-white bg-slate-900 w-full p-4 text-xs">
            <p>
              &copy; Animeflix {new Date().getFullYear()} by&nbsp;
              <a href="https://github.com/Sodiumchloridy">
                <span>Sodiumchloridy</span>
              </a>
              .
            </p>
            <br />
            <p>
              This site does not store any files on its server. All contents are
              provided by non-affiliated third parties.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
