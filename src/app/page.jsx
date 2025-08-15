"use client";

import MovieCard from "../components/MovieCard";
import Header from "../components/Header";
import { api } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "context/SearchContext";
import { useState } from "react";

export default function Home() {
  const { search, setSearch } = useSearch();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["filmes", search, page],
    queryFn: async () => {
      if (search) {
        const response = await api.get("/search/movie", {
          params: { query: search, page },
        });
        return response.data;
      } else {
        const response = await api.get("/movie/popular", { params: { page } });
        return response.data;
      }
    },
    keepPreviousData: true,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const movies = data?.results || [];
  const totalPagesToShow = Math.min(data?.total_pages || 1, 5);

  return (
    <main className="p-4 max-w-7xl mx-auto pt-16">
      <Header search={search} setSearch={setSearch} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {movies.length === 0 && (
        <p className="text-center mt-6 text-gray-400">
          Nenhum filme encontrado
        </p>
      )}

      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isFetching}
          className="py-2 px-4 bg-gray-700 rounded text-white hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
        >
          Anterior
        </button>

        {Array.from({ length: totalPagesToShow }, (_, i) => i + 1).map(
          (num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              disabled={isFetching || num === page}
              className={`px-4 py-2 rounded cursor-pointer ${
                num === page
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, data?.total_pages))
          }
          disabled={page === data?.total_pages || isFetching}
          className="px-4 py-2 bg-gray-700 text-white cursor-pointer rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </main>
  );
}
