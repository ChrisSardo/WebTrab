// components/TaskModal.tsx
import React, { useState } from 'react';

interface Atividade {
  nome: string;
  concluida: boolean;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (titulo: string, descricao: string, atividades: Atividade[]) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [atividadeTemp, setAtividadeTemp] = useState('');
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  const adicionarAtividade = () => {
    if (atividadeTemp.trim() === '') return;
    setAtividades([...atividades, { nome: atividadeTemp.trim(), concluida: false }]);
    setAtividadeTemp('');
  };

  const handleSave = () => {
    if (!titulo || !descricao) return;
    onSave(titulo, descricao, atividades);
    setTitulo('');
    setDescricao('');
    setAtividades([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Nova Atividade"
            value={atividadeTemp}
            onChange={(e) => setAtividadeTemp(e.target.value)}
            className="p-2 border rounded w-full mr-2"
          />
          <button
            onClick={adicionarAtividade}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            +
          </button>
        </div>
        <ul className="mb-2">
          {atividades.map((atividade, index) => (
            <li key={index} className="text-sm">
              - {atividade.nome}
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
