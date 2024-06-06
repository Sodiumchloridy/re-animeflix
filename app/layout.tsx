import type { Metadata } from "next";
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
    <html lang="en">
      <body className={`${poppins.className} text-white bg-slate-900`}>
        <main>
          {/* Navbar */}
          <nav className="z-50 fixed top-0 left-0 right-0 h-16 flex items-center bg-black/75 shadow-md backdrop-blur-sm">
            <a href="/">
              <Image
                className="ml-8"
                alt="animeflix logo"
                width={30}
                height={30}
                src="/animeflix.svg"
                unoptimized
              />
            </a>
            {/* Search Box */}
            <form
              action="/search"
              className="h-10 w-[50%] max-w-[600px] border border-white rounded-lg flex items-center ml-8"
            >
              {/* Search Icon */}
              <button type="submit">
                <svg
                  className="fill-white w-4 h-4 mx-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </button>

              {/* Search Input */}
              <input
                className="bg-transparent w-full mx-2 focus:outline-none"
                type="text"
                name="query"
                placeholder="Search your anime here.."
              ></input>
            </form>
          </nav>

          {/* Content */}
          {children}

          {/* Footer */}
          <div className="text-white bg-slate-900 w-full p-4 text-sm grid place-items-center">
            <p>
              &copy; Animeflix {new Date().getFullYear()} by&nbsp;
              <a href="https://github.com/Sodiumchloridy">
                <span className="text-blue-500">Sodiumchloridy</span>
              </a>
              .
            </p>
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
