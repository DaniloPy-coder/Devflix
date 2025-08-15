"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../services/api";

export default function MoviePage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await api.get(`/movie/${id}`);
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error ao carregar filme
      </div>
    );

  return (
    <main className="p-6 max-w-5xl mx-auto pt-16 text-white">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data.title}
          loading="lazy"
          className="w-full max-w-sm rounded-xl shadow-lg shadow-black/50"
        />
        <div>
          <h1 className="text-4xl font-bold mb-3 text-white">{data.title}</h1>
          <p className="text-gray-400 mb-6 text-sm">
            {new Date(data.release_date).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-lg leading-relaxed mb-6">{data.overview}</p>

          {data.vote_average && (
            <p className="bg-gray-800 inline-block px-4 py-2 rounded-full text-sm">
              ⭐ Avaliação: {data.vote_average.toFixed(1)}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
