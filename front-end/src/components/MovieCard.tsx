"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "../services/api";

export interface Movie {
  id: number | string;
  title: string;
  poster_path: string;
  release_date: string;
  user_id?: number;
}

interface MovieCardProps {
  movie: Movie;
  isLogged: boolean;
  currentUserId?: number | null;
  onDeleted: () => void;
}

export default function MovieCard({
  movie,
  isLogged,
  currentUserId,
  onDeleted,
}: MovieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  const imageUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=Sem+Foto";

  const isLocalMovie =
    typeof movie.id === "number" && movie.user_id !== undefined;
  const canDelete = isLogged && isLocalMovie && movie.user_id === currentUserId;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Deseja remover "${movie.title}" do catálogo local?`)) return;

    setIsDeleting(true);

    try {
      await api.delete(`/api/movies/${movie.id}`);

      alert("Filme removido com sucesso!");
      onDeleted();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao conectar com o backend. Verifique o Ngrok!");
    } finally {
      setIsDeleting(false);
    }
  };

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

        {canDelete && (
          <div
            onClick={handleDelete}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleDelete(e as unknown as React.MouseEvent);
              }
            }}
            role="button"
            tabIndex={0}
            className={`absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-20 scale-90 group-hover:scale-100 flex items-center justify-center cursor-pointer ${
              isDeleting ? "bg-neutral-600 pointer-events-none" : ""
            }`}
            title="Excluir filme"
          >
            {isDeleting ? "..." : "🗑️"}
          </div>
        )}
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
