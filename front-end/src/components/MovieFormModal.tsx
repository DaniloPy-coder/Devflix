"use client";

import { useState } from "react";

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function MovieFormModal({
  isOpen,
  onClose,
  userId,
}: MovieFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState({
    title: "",
    overview: "",
    poster_path: "",
    release_date: "",
    genre_name: "",
  });

  if (!isOpen) return null;

  const handleMovieChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:9000"}/api/movies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ...movieData, user_id: userId }),
        },
      );

      if (response.ok) {
        alert("Filme cadastrado com sucesso!");
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao cadastrar filme.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">
          Cadastrar Novo Filme
        </h2>
        <form className="space-y-4" onSubmit={handleMovieSubmit}>
          <input
            type="text"
            name="title"
            value={movieData.title}
            onChange={handleMovieChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
            placeholder="Título do Filme"
          />
          <textarea
            name="overview"
            value={movieData.overview}
            onChange={handleMovieChange}
            required
            className="resize-none w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white h-32"
            placeholder="Sinopse"
          ></textarea>
          <input
            type="text"
            name="poster_path"
            value={movieData.poster_path}
            onChange={handleMovieChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
            placeholder="URL do Pôster (Ex: /imagem.jpg)"
          />
          <input
            type="date"
            name="release_date"
            value={movieData.release_date}
            onChange={handleMovieChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-400">
              Gênero do Filme
            </label>
            <input
              type="text"
              name="genre_name"
              value={movieData.genre_name}
              onChange={handleMovieChange}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
              placeholder="Ex: Ficção Científica, Suspense"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Filme no Catálogo"}
          </button>
        </form>
      </div>
    </div>
  );
}
