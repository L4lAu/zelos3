"use client";
import { useEffect, useState } from "react";

export default function HistoricoChamados({ chamados, tecnicoId, onVerDetalhes }) {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const filtrados = chamados
      .filter(c => c.tecnicoId === tecnicoId && c.status === "concluido")
      .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
    setHistorico(filtrados);
  }, [chamados, tecnicoId]);


  if (historico.length === 0) {
    return (

      <div className="bg-[#22242a] p-6 rounded-lg shadow-xl text-center border border-black/30">
        <p className="text-gray-500 font-medium">Nenhum chamado concluído encontrado.</p>
      </div>
    );
  }

  // --- Se houver histórico para exibir ---
  return (
    <div className="bg-[#1e2128] p-6 rounded-lg shadow-xl border border-black/30">
      {/* Título principal alinhado com o resto da UI */}
      <h2 className="text-xl font-bold mb-4 text-gray-100">Histórico de Chamados</h2>

      {/* Lista com divisores escuros */}
      <ul className="divide-y divide-gray-700">
        {historico.map((chamado) => (
          <li key={chamado.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 gap-3">
            <div>
              <p className="text-gray-200 font-semibold">{chamado.tipo}</p>
              <p className="text-sm text-gray-400">
                Finalizado em: {new Date(chamado.dataCriacao).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Botão de ação primária estilizado */}
            <button
              onClick={() => onVerDetalhes(chamado.id)}
              className="px-4 py-2 text-sm bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors duration-200 self-start sm:self-center"
            >
              Ver Detalhes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
