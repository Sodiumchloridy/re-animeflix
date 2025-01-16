"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Profile() {
  const [showDropdown, setShowDropdown] = useState(false);

  const { status } = useSession();
  const router = useRouter();

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className="cursor-pointer">
          <Image
            src="/animeflix.svg" // Replace with the actual path to the profile picture
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown ? (
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <a
                href="/watch-list"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                Watch List
              </a>
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  signOut({ redirect: false }).then(() => {
                    router.push("/");
                  });
                }}
              >
                Sign Out
              </button>
            </div>
          ) : null}
        </div>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <div className="flex items-center ml-auto mr-8">
          <Link href="/auth/login" className="mx-4">
            Login
          </Link>
          <Link href="/auth/register" className="mx-4">
            Register
          </Link>
        </div>
      );
    }
  };
  
  return <div className="flex items-center ml-auto mr-8 relative">{showSession()}</div>;
}
