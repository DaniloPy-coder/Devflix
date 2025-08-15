"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { useSearch } from "context/SearchContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { search, setSearch } = useSearch();
  const pathname = usePathname();

  const isMoviePage = pathname.startsWith("/movie/");

  return (
    <header className="bg-gray-900 text-white fixed top-0 left-0 w-full p-4 flex flex-col sm:flex-row sm:items-center z-50">
      <Link
        href="/"
        className="text-3xl font-bold text-red-600 tracking-wide mb-3 sm:mb-0"
      >
        Dev<span className="text-white">flix</span>
      </Link>

      {/* Barra de pesquisa */}
      {!isMoviePage && (
        <div className="w-64 sm:ml-auto">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      )}
    </header>
  );
}
