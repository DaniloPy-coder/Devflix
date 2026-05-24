"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SearchBar from "./SearchBar";
import MovieCard, { Movie } from "./MovieCard";
import LoadingSpinner from "./LoadingSpinner";
import { fetchPopularMovies } from "../services/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import { api } from "../services/api";
interface MovieCatalogProps {
  initialData: Movie[];
}

export default function MovieCatalog({ initialData }: MovieCatalogProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("devflix_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUserId(Number(user.id));
      setIsLogged(true);
    }
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const debouncedSearch = useDebounce(search, 300);

  const { data: tmdbMovies, isLoading: isLoadingTmdb } = useQuery<Movie[]>({
    queryKey: ["movies", "popular", page],
    queryFn: () => fetchPopularMovies(page),
    placeholderData: page === 1 ? initialData : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const { data: localMovies, isLoading: isLoadingLocal } = useQuery<Movie[]>({
    queryKey: ["movies", "all_local"],
    queryFn: async () => {
      const res = await api.get(`/api/movies`);
      console.log("DADOS DO LARAVEL:", res.data);
      return res.data;
    },
    enabled: isMounted,
  });

  const handleMovieDeleted = (deletedId: number | string) => {
    queryClient.setQueryData(
      ["movies", "all_local"],
      (oldData: Movie[] | undefined) =>
        oldData?.filter((m) => m.id !== deletedId) || [],
    );
  };

  if (!isMounted) return <LoadingSpinner />;

  const myMovies = (localMovies || []).filter(
    (m) => m.user_id === currentUserId,
  );
  const communityMovies = (localMovies || []).filter(
    (m) => m.user_id !== currentUserId,
  );

  const filteredMyMovies = myMovies.filter((m) =>
    m.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const filteredCommunity = communityMovies.filter((m) =>
    m.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const filteredTmdb = (tmdbMovies || []).filter((m) =>
    m.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />

      {isLogged && filteredMyMovies.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Meus Filmes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMyMovies.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                isLogged={isLogged}
                currentUserId={currentUserId}
                onDeleted={() => handleMovieDeleted(m.id)}
              />
            ))}
          </div>
        </section>
      )}

      {filteredCommunity.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Filmes da Comunidade
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredCommunity.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                isLogged={isLogged}
                currentUserId={currentUserId}
                onDeleted={() => handleMovieDeleted(m.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          Filmes Recomendados
        </h2>
        {isLoadingTmdb || isLoadingLocal ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredTmdb.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                isLogged={isLogged}
                currentUserId={currentUserId}
                onDeleted={() => {}}
              />
            ))}
          </div>
        )}

        {search === "" && (
          <div className="flex items-center justify-center gap-6 mt-12 mb-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoadingTmdb}
              className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-white font-medium">Página {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoadingTmdb}
              className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </>
  );
}
