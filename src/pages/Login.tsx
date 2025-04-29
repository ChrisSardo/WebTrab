import React, { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/tasks"); // Redireciona para tarefas
    } catch (error) {
      setErro("Email ou senha inválidos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        {erro && <p className="text-red-500 mb-2">{erro}</p>}
        <input type="email" placeholder="Email" className="p-2 border w-full mb-3" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="p-2 border w-full mb-3" onChange={(e) => setSenha(e.target.value)} required />
        <button className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700">Entrar</button>
      </form>
    </div>
  );
}
