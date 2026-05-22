"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/src/components/LoadingSpinner";

interface MovieDetail {
  id: number | string;
  title: string;
  poster_path: string;
  release_date: string;
  overview?: string;
  description?: string;
  user_id?: number;
}

interface MovieDetailsClientProps {
  movieId: string;
  initialData: MovieDetail | null;
  isLocal: boolean;
}

export default function MovieDetailsClient({
  movieId,
  initialData,
  isLocal,
}: MovieDetailsClientProps) {
  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<MovieDetail, Error>({
    queryKey: ["movie", isLocal ? "local" : "tmdb", movieId],

    queryFn: async () => {
      if (isLocal) {
        const res = await fetch(`http://127.0.0.1:8000/api/movies/${movieId}`);
        if (!res.ok) throw new Error("Filme não encontrado no banco local");
        return res.json();
      }

      const { fetchMovieById } = await import("@/src/services/tmdb");
      const data = await fetchMovieById(movieId);

      if (!data) throw new Error("Filme não encontrado na API do TMDB");
      return data;
    },
    initialData: initialData ?? undefined,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">
          Erro ao carregar os detalhes do filme.
        </p>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Voltar para a Home
        </Link>
      </div>
    );
  }

  const imageUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=Sem+Foto";

  return (
    <div className="max-w-4xl mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
        <div className="relative w-full md:w-1/3 max-w-sm mx-auto aspect-2/3 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-md">
          <Image
            src={imageUrl}
            alt={`Pôster do filme ${movie.title}`}
            fill
            unoptimized={movie.poster_path?.startsWith("http")}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between gap-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-blue-500 dark:text-neutral-400 mb-6 transition-colors"
            >
              ← Voltar para a listagem
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {movie.title}
            </h1>

            {movie.release_date && (
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
                Lançamento:{" "}
                {movie.release_date.includes("-")
                  ? movie.release_date.split("-").reverse().join("/")
                  : new Date(movie.release_date).toLocaleDateString("pt-BR")}
              </p>
            )}

            <h2 className="text-lg font-semibold text-foreground mb-2">
              Sinopse
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-justify">
              {movie.overview ||
                movie.description ||
                "Nenhuma sinopse disponível."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
