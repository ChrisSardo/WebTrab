// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Copie essas infos do seu Console Firebase (Configurações do Projeto → SDK Web)
const firebaseConfig = {
    apiKey: "AIzaSyCeL2vCsV2UwiwzcVa8VmDWZ74xxxaL-Ac",
    authDomain: "gerenciador-de-tarefas-4de9a.firebaseapp.com",
    projectId: "gerenciador-de-tarefas-4de9a",
    storageBucket: "gerenciador-de-tarefas-4de9a.firebasestorage.app",
    messagingSenderId: "404823323362",
    appId: "1:404823323362:web:9abd04fc82c4212802a4bb"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

