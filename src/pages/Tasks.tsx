import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import TaskModal from '../components/TaskModal';

interface Atividade {
  nome: string;
  concluida: boolean;
}

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: 'todo' | 'doing' | 'done';
  atividades: Atividade[];
}

const Tasks: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    buscarTarefas();
  }, []);

  const buscarTarefas = async () => {
    if (!auth.currentUser) return;
    const tarefasRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
    const snapshot = await getDocs(tarefasRef);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Tarefa));
    setTarefas(lista);
  };

  const criarTarefa = async (titulo: string, descricao: string, atividades: Atividade[]) => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'tasks'), {
      titulo,
      descricao,
      status: 'todo',
      atividades,
    });
    buscarTarefas();
  };

  const atualizarStatus = async (id: string, novoStatus: 'todo' | 'doing' | 'done') => {
    if (!auth.currentUser) return;
    const tarefaRef = doc(db, 'users', auth.currentUser.uid, 'tasks', id);
    await updateDoc(tarefaRef, { status: novoStatus });
    buscarTarefas();
  };

  const toggleAtividade = async (tarefaId: string, index: number) => {
    if (!auth.currentUser) return;
    const tarefa = tarefas.find((t) => t.id === tarefaId);
    if (!tarefa) return;
    const novasAtividades = [...tarefa.atividades];
    novasAtividades[index].concluida = !novasAtividades[index].concluida;
    const tarefaRef = doc(db, 'users', auth.currentUser.uid, 'tasks', tarefaId);
    await updateDoc(tarefaRef, { atividades: novasAtividades });
    buscarTarefas();
  };

  const excluirTarefa = async (id: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id));
    buscarTarefas();
  };

  const calcularProgresso = (atividades: Atividade[]) => {
    if (atividades.length === 0) return 0;
    const concluidas = atividades.filter((a) => a.concluida).length;
    return Math.round((concluidas / atividades.length) * 100);
  };

  const colunas: { [key: string]: string } = {
    todo: 'A Fazer',
    doing: 'Em Execução',
    done: 'Concluídas',
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quadro Kanban</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(colunas).map(([status, titulo]) => (
          <div key={status} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
            {tarefas
              .filter((t) => t.status === status)
              .map((tarefa) => (
                <div key={tarefa.id} className="bg-gray-100 p-3 rounded mb-3">
                  <h3 className="font-bold">{tarefa.titulo}</h3>
                  <p className="text-sm mb-2">{tarefa.descricao}</p>
                  <p className="text-sm mb-2">
                    Progresso: {calcularProgresso(tarefa.atividades)}%
                  </p>
                  <ul className="mb-2">
                    {tarefa.atividades.map((atividade, index) => (
                      <li key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={atividade.concluida}
                          onChange={() => toggleAtividade(tarefa.id, index)}
                          className="mr-2"
                        />
                        <span className={atividade.concluida ? 'line-through text-gray-400' : ''}>
                          {atividade.nome}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
                    <div className="flex gap-2">
                      {status !== 'todo' && (
                        <button
                          onClick={() => atualizarStatus(tarefa.id, 'todo')}
                          className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
                        >
                          A Fazer
                        </button>
                      )}
                      {status !== 'doing' && (
                        <button
                          onClick={() => atualizarStatus(tarefa.id, 'doing')}
                          className="px-2 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
                        >
                          Em Execução
                        </button>
                      )}
                      {status !== 'done' && (
                        <button
                          onClick={() => atualizarStatus(tarefa.id, 'done')}
                          className="px-2 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
                        >
                          Concluída
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => excluirTarefa(tarefa.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={criarTarefa}
      />
    </div>
  );
};

export default Tasks;
