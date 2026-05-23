"use client";

import { useState } from "react";
import { api } from "../services/api";

interface UserProps {
  id: number;
  name: string;
  email: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProps) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    const endpoint = isLoginView ? "/api/login" : "/api/register";

    try {
      const response = await api.post(endpoint, formData);

      const { user, message: successMessage } = response.data;

      if (isLoginView) {
        localStorage.setItem("devflix_user", JSON.stringify(user));
        onAuthSuccess(user);
        onClose();
        window.location.reload();
      } else {
        setMessage({
          type: "success",
          text: successMessage || "Conta criada! Faça login.",
        });
        setIsLoginView(true);
      }
    } catch (error) {
      const err = error as any;
      const errorText =
        err.response?.data?.message || "Erro ao conectar com o servidor.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isLoginView ? "Entrar" : "Criar Conta"}
        </h2>

        {message.text && (
          <div
            className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLoginView && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
              placeholder="Seu nome"
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
            placeholder="Senha"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processando..." : isLoginView ? "Acessar" : "Cadastrar"}
          </button>
        </form>
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="w-full mt-4 text-neutral-400 text-sm hover:underline"
        >
          {isLoginView
            ? "Novo por aqui? Cadastre-se."
            : "Já tem conta? Faça login."}
        </button>
      </div>
    </div>
  );
}
