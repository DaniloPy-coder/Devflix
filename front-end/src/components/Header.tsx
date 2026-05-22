"use client";

import { useState } from "react";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginView) {
          setMessage({
            type: "success",
            text: `Bem-vindo de volta, ${data.user.name}! 🎉`,
          });

          console.log("Usuário conectado:", data.user);

          setTimeout(() => {
            setIsModalOpen(false);
          }, 1500);
        } else {
          setMessage({
            type: "success",
            text: "Conta criada com sucesso! Mude para a tela de login.",
          });
          setFormData({ name: "", email: "", password: "" });
          setIsLoginView(true);
        }
      } else {
        setMessage({ type: "error", text: data.message || "Ocorreu um erro." });
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      setMessage({
        type: "error",
        text: "Não foi possível conectar ao servidor Laravel.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-neutral-900 border-b border-neutral-800 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="text-3xl font-black tracking-tighter cursor-pointer">
          <span className="text-red-600">Dev</span>
          <span className="text-white">flix</span>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsLoginView(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Entrar
        </button>
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
                className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {message.text}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLoginView && (
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                    placeholder="Seu nome"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors mt-4 disabled:opacity-50"
              >
                {loading
                  ? "Processando..."
                  : isLoginView
                    ? "Acessar Catálogo"
                    : "Registrar Agora"}
              </button>
            </form>

            <p className="mt-6 text-center text-neutral-400 text-sm">
              {isLoginView ? "Novo por aqui?" : "Já tem uma conta?"}{" "}
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-white font-bold hover:underline"
              >
                {isLoginView ? "Criar Conta" : "Faça login."}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
