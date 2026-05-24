"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";

interface UserProps {
  id: number;
  name: string;
  email: string;
}

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserProps | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("devflix_user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (error) {
          console.error("Erro ao ler dados do localStorage", error);
        }
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem("devflix_user");
    setUser(null);
    window.location.reload();
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
                onClick={handleLogout}
                className="text-neutral-400 hover:text-white text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={setUser}
      />
    </>
  );
}
