import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
}

export default function Tasks() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    buscarTarefas();
  }, []);

  const buscarTarefas = async () => {
    if (!auth.currentUser) return;
    const tarefasRef = collection(db, "users", auth.currentUser.uid, "tasks");
    const snapshot = await getDocs(tarefasRef);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tarefa));
    setTarefas(lista);
  };

  const handleAddTask = () => {
    setShowAddModal(true);
  };

  const confirmAddTask = async () => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, "users", auth.currentUser.uid, "tasks"), { titulo, descricao });
    setTitulo("");
    setDescricao("");
    buscarTarefas();
    setShowAddModal(false);
  };

  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!auth.currentUser || !taskToDelete) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "tasks", taskToDelete));
    buscarTarefas();
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Sair</button>
      </div>

      {/* Formulário para adicionar tarefa */}
      <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }} className="bg-white p-6 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="p-3 border rounded w-full mb-4"
          required
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-3 border rounded w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700">
          Adicionar Tarefa
        </button>
      </form>

      {/* Lista de tarefas */}
      <div className="space-y-4">
        {tarefas.map((tarefa) => (
          <div key={tarefa.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-bold">{tarefa.titulo}</h2>
              <p className="text-sm text-gray-500">{tarefa.descricao}</p>
            </div>
            <button onClick={() => handleDeleteTask(tarefa.id)} className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500">
              Excluir
            </button>
          </div>
        ))}
      </div>

      {/* Modal de adicionar tarefa */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Deseja adicionar esta tarefa?</h2>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                Cancelar
              </button>
              <button onClick={confirmAddTask} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de excluir tarefa */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Tem certeza que deseja excluir esta tarefa?</h2>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                Cancelar
              </button>
              <button onClick={confirmDeleteTask} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
