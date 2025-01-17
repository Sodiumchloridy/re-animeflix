"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

export default function Profile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className="cursor-pointer" ref={dropdownRef}>
          <div className="flex items-center gap-2" onClick={() => setShowDropdown(!showDropdown)}>
            <Image
              src="/animeflix.svg"
              alt="Profile Picture"
              width={40}
              height={40}
              className="rounded-full"
            />
            <FaChevronDown
              className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''
                }`}
            />
          </div>
          {showDropdown && (
            <div
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
          )}
        </div>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <div className="cursor-pointer relative mr-4" ref={dropdownRef}>
          <div
            className="flex items-center gap-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaChevronDown
              className={`border-2 w-8 h-8 p-2 border-white rounded-full transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''
                }`}
            />
          </div>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <button className="block w-full" type="button" onClick={() => setShowDropdown(false)}>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Login
                </Link>
              </button>
              <button className="block w-full" type="button" onClick={() => setShowDropdown(false)}>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Register
                </Link>
              </button>
            </div>
          )}
        </div>
      );
    }
  };
  
  return <div className="flex items-center ml-auto mr-4 relative">{showSession()}</div>;
}
