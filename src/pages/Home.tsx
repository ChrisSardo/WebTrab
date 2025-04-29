// src/pages/Home.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Gerenciador de Tarefas</h1>
        <p className="text-gray-600 mb-8">Organize suas atividades de maneira fácil e prática!</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="border border-blue-600 text-blue-600 py-3 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
