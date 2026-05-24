"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "./SearchBar";
import MovieCard, { Movie } from "./MovieCard";
import LoadingSpinner from "./LoadingSpinner";
import { fetchPopularMovies } from "../services/tmdb";
import { useDebounce } from "../hooks/useDebounce";

interface MovieCatalogProps {
  initialData: Movie[];
}

export default function MovieCatalog({ initialData }: MovieCatalogProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data: tmdbMovies, isLoading } = useQuery<Movie[]>({
    queryKey: ["movies", "popular", page],
    queryFn: () => fetchPopularMovies(page),
    placeholderData: page === 1 ? initialData : undefined,
  });

  const filteredTmdb = (tmdbMovies || []).filter((m) =>
    m.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          Filmes Recomendados
        </h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredTmdb.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
