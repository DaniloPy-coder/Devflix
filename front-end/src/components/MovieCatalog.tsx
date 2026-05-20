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

  const {
    data: movies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => fetchPopularMovies(page),
    initialData: page === 1 ? initialData : undefined,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <p className="text-center text-red-500">Erro ao carregar os filmes.</p>
    );
  }

  const filteredMovies = (movies || []).filter((movie: Movie) =>
    movie.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />

      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            Nenhum filme encontrado para &quot;{search}&quot;.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {search === "" && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                ← Anterior
              </button>

              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Página {page}
              </span>

              <button
                onClick={() => setPage((old) => old + 1)}
                disabled={page >= 500}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                Seguinte →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
