"use client";

import { useState } from "react";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {!isLoginView && (
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
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
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                  placeholder="••••••••"
                />
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                {isLoginView ? "Acessar Catálogo" : "Registrar Agora"}
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
