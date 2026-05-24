"use client";

import Link from "next/link";
import Image from "next/image";

export interface Movie {
  id: number | string;
  title: string;
  poster_path: string;
  release_date: string;
  user_id?: number;
  origin?: "community" | "tmdb";
}

interface MovieCardProps {
  movie: Movie;
  // isLogged, currentUserId e onDeleted não são mais necessários para exclusão
  isLogged?: boolean;
}

export default function MovieCard({ movie, isLogged = false }: MovieCardProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  const imageUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=Sem+Foto";

  const isLocalMovie = !!movie.user_id;

  return (
    <Link
      href={
        isLocalMovie ? `/movie/cadastrados/${movie.id}` : `/movie/${movie.id}`
      }
      className="group relative flex flex-col bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <Image
          src={imageUrl}
          alt={`Pôster do filme ${movie.title}`}
          loading="lazy"
          fill
          unoptimized={movie.poster_path?.startsWith("http")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col grow justify-between gap-2">
        <h3 className="font-semibold text-base line-clamp-2 text-foreground group-hover:text-blue-500 transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          {releaseYear}
        </p>
      </div>
    </Link>
  );
}
