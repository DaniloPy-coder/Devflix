"use client";

import { useState, useMemo } from "react";
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
    staleTime: 1000 * 60 * 5,
  });

  const filteredTmdb = useMemo(() => {
    return (tmdbMovies || []).filter((m) =>
      m.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [tmdbMovies, debouncedSearch]);

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
          <>
            <div className="min-h-125 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredTmdb.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 bg-neutral-800 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-white py-2">Página {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-neutral-800 text-white rounded"
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
