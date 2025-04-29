import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      navigate("/tasks");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/weak-password") {
        setErro("Senha muito fraca. Use pelo menos 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        setErro("Email inválido. Corrija e tente novamente.");
      } else if (error.code === "auth/email-already-in-use") {
        setErro("Email já cadastrado. Faça login.");
      } else {
        setErro("Erro ao cadastrar. Verifique os dados.");
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center">Cadastro</h1>
        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="p-2 border rounded w-full mb-6"
          required
        />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
