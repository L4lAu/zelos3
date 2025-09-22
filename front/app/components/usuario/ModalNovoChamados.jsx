// components/ModalNovoChamado.jsx
import { useState } from 'react';

export default function ModalNovoChamado({ isOpen, onClose, onCreate, error }) {
  const [novoChamado, setNovoChamado] = useState({
    numero_patrimonio: "",
    descricao: "",
    tipo: "Manutenção"
  });

  const handleSubmit = () => {
    onCreate(novoChamado);
    setNovoChamado({ numero_patrimonio: "", descricao: "", tipo: "Manutenção" });
  };

  const handleClose = () => {
    onClose();
    setNovoChamado({ numero_patrimonio: "", descricao: "", tipo: "Manutenção" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.79)] flex items-center justify-center z-50 p-4">
      <div className="bg-[linear-gradient(10deg,#1e2128,#282c34)] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Novo Chamado</h2>
        
        {/* Número de Patrimônio */}
        <div className="mb-4 text-white">
          <label className="block text-white mb-2">Número de Patrimônio</label>
          <input
            type="text"
            placeholder="Digite o número de patrimônio"
            value={novoChamado.numero_patrimonio}
            onChange={e => setNovoChamado({...novoChamado, numero_patrimonio: e.target.value})}
            className="w-full p-2 border border-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        {/* Tipo de Chamado */}
        <div className="mb-4 text-white">
          <label className="block text-white mb-2">Tipo de Chamado</label>
          <select
            value={novoChamado.tipo}
            onChange={e => setNovoChamado({...novoChamado, tipo: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Manutenção" className=' bg-[rgba(31,31,31,0.79)] ' >Manutenção</option>
            <option value="Apoio Técnico" className=' bg-[rgba(53,53,53,0.79)] '>Apoio Técnico</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="mb-4 text-white">
          <label className="block text-white mb-2">Descrição do Problema *</label>
          <textarea
            placeholder="Descreva o problema em detalhes"
            value={novoChamado.descricao}
            onChange={e => setNovoChamado({...novoChamado, descricao: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 h-24"
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Criar Chamado
          </button>
        </div>
      </div>
    </div>
  );
}
