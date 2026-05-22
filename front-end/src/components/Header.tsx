"use client";

import { useState, useEffect } from "react";

interface UserProps {
  id: number;
  name: string;
  email: string;
}

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [user, setUser] = useState<UserProps | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [movieData, setMovieData] = useState({
    title: "",
    overview: "",
    poster_path: "",
    release_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const handleInitUser = () => {
      const savedUser = localStorage.getItem("devflix_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Erro ao ler dados do localStorage", error);
        }
      }
    };
    handleInitUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMovieChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("devflix_user");
    setUser(null);
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    const endpoint = isLoginView ? "login" : "register";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginView) {
          localStorage.setItem("devflix_user", JSON.stringify(data.user));
          setUser(data.user);
          setIsModalOpen(false);
          window.location.reload();
        } else {
          setMessage({ type: "success", text: "Conta criada! Faça login." });
          setIsLoginView(true);
        }
      } else {
        setMessage({
          type: "error",
          text: data.message || "Erro na operação.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao conectar com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("Você precisa estar logado para cadastrar um filme.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...movieData,
          user_id: user.id,
        }),
      });

      if (response.ok) {
        alert("Filme cadastrado com sucesso!");
        setMovieData({
          title: "",
          overview: "",
          poster_path: "",
          release_date: "",
        });
        setIsMovieFormOpen(false);
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
    <>
      <header className="bg-neutral-900 border-b border-neutral-800 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div
          className="text-3xl font-black tracking-tighter cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <span className="text-red-600">Dev</span>
          <span className="text-white">flix</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white font-medium hidden md:inline">
                Olá, {user.name}
              </span>
              <button
                onClick={() => setIsMovieFormOpen(true)}
                className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Cadastrar Filme
              </button>
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-white text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsLoginView(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
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
                {loading
                  ? "Processando..."
                  : isLoginView
                    ? "Acessar"
                    : "Cadastrar"}
              </button>
            </form>
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="w-full mt-4 text-neutral-400 text-sm hover:underline"
            >
              {isLoginView
                ? "Novo por aqui? Assine agora."
                : "Já tem conta? Faça login."}
            </button>
          </div>
        </div>
      )}

      {isMovieFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-8 relative shadow-2xl">
            <button
              onClick={() => setIsMovieFormOpen(false)}
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
              >
                {loading ? "Salvando..." : "Salvar Filme no Catálogo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
