"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
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
  const queryClient = useQueryClient();
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
      await api.post("/api/movies", { ...movieData, user_id: userId });

      queryClient.invalidateQueries({ queryKey: ["movies", "all_local"] });

      alert("Filme cadastrado com sucesso!");
      onClose();
    } catch (error: unknown) {
      import("axios").then((axios) => {
        if (axios.isAxiosError(error)) {
          const errorMsg =
            error.response?.data?.message || "Erro ao cadastrar filme.";
          alert(errorMsg);
        } else {
          alert("Erro inesperado ao conectar ao servidor.");
        }
      });
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
