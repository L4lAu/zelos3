import { useState } from 'react';
import StatusBadge from '../StatusBadge';

export default function ChamadosTable({
  chamados,
  onAceitarChamado,
  onIniciarChamado,
  onFinalizarChamado,
  onAbrirApontamento,
  onVerDetalhes,
  user
}) {
  const [sortField, setSortField] = useState('dataCriacao');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedChamados = [...chamados]
    .filter(chamado => {
      // Só exibe se não tem técnico ou se é do usuário logado
      return !chamado.tecnicoId || chamado.tecnicoId === user.id;
    })
    .sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (sortField.includes('data')) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    // Contêiner principal com fundo escuro e borda sutil
    <div className="bg-[#1e2128] rounded-lg shadow-xl overflow-hidden border border-black/30">
      <div className="hidden sm:block overflow-x-auto">
        {/* Versão tabela para telas médias/grandes */}
        <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm md:text-base">
          {/* Cabeçalho com fundo sutilmente diferente e texto claro */}
          <thead className="bg-black/30">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                ID {renderSortIcon('id')}
              </th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider">Patrimônio</th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider">Descrição</th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dataCriacao')}>
                Data {renderSortIcon('dataCriacao')}
              </th>
              <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedChamados.map((chamado) => (
              // Hover sutil e transição suave nas linhas
              <tr key={chamado.id} className="hover:bg-white/5 transition-colors duration-150">
                <td className="px-2 sm:px-4 py-3 text-gray-200 font-medium">#{chamado.id}</td>
                <td className="px-2 sm:px-4 py-3 text-gray-400">{chamado.patrimonio}</td>
                <td className="px-2 sm:px-4 py-3 text-gray-400 truncate max-w-[100px] sm:max-w-xs">{chamado.descricaoProblema}</td>
                <td className="px-2 sm:px-4 py-3 text-gray-400">{chamado.tipo}</td>
                <td className="px-2 sm:px-4 py-3"><StatusBadge status={chamado.status} /></td>
                <td className="px-2 sm:px-4 py-3 text-gray-400">{new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}</td>
                <td className="px-2 sm:px-4 py-3">
                  {/* Botões estilizados como pílulas para melhor visibilidade */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!chamado.tecnicoId && (
                      <>
                        <button onClick={() => onAceitarChamado(chamado.id)} className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-colors">Aceitar</button>
                        <button onClick={() => onVerDetalhes(chamado.id)} className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-500/20 rounded-full hover:bg-gray-500/30 transition-colors">Detalhes</button>
                      </>
                    )}
                    {chamado.tecnicoId === user.id && (
                      <>
                        {(chamado.status === 'aberto' || chamado.status === 'em_andamento') && (
                          <button onClick={() => onAbrirApontamento(chamado)} className="px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors">Apontamento</button>
                        )}
                        {chamado.status === 'aberto' && (
                          <button onClick={() => onIniciarChamado(chamado.id)} className="px-2 py-1 text-xs font-semibold text-amber-300 bg-amber-500/20 rounded-full hover:bg-amber-500/30 transition-colors">Iniciar</button>
                        )}
                        {chamado.status === 'em_andamento' && (
                          <button onClick={() => onFinalizarChamado(chamado.id)} className="px-2 py-1 text-xs font-semibold text-purple-300 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors">Finalizar</button>
                        )}
                        <button onClick={() => onVerDetalhes(chamado.id)} className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-500/20 rounded-full hover:bg-gray-500/30 transition-colors">Detalhes</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Versão responsiva para telas pequenas */}
      <div className="sm:hidden flex flex-col gap-3 p-3">
        {sortedChamados.map((chamado) => (
          <div key={chamado.id} className="border border-gray-700 rounded-lg p-3 bg-[#282c34] shadow-md text-xs">
            <div className="flex justify-between items-center font-bold text-gray-200">
              <span>ID: #{chamado.id}</span>
              <span className="font-medium text-gray-400">{new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="mt-2 text-gray-300"><strong className="font-medium text-gray-400">Patrimônio:</strong> {chamado.patrimonio}</div>
            <div className="mt-1 text-gray-300"><strong className="font-medium text-gray-400">Descrição:</strong> {chamado.descricaoProblema}</div>
            <div className="mt-1 text-gray-300"><strong className="font-medium text-gray-400">Tipo:</strong> {chamado.tipo}</div>
            <div className="mt-2"><StatusBadge status={chamado.status} /></div>
            <div className="mt-3 border-t border-gray-700 pt-3 flex flex-wrap gap-2">
              {/* Botões seguem o mesmo estilo da tabela */}
              {!chamado.tecnicoId && (
                <>
                  <button onClick={() => onAceitarChamado(chamado.id)} className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-colors">Aceitar</button>
                  <button onClick={() => onVerDetalhes(chamado.id)} className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-500/20 rounded-full hover:bg-gray-500/30 transition-colors">Detalhes</button>
                </>
              )}
              {chamado.tecnicoId === user.id && (
                <>
                  {(chamado.status === 'aberto' || chamado.status === 'em_andamento') && (
                    <button onClick={() => onAbrirApontamento(chamado)} className="px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors">Apontamento</button>
                  )}
                  {chamado.status === 'aberto' && (
                    <button onClick={() => onIniciarChamado(chamado.id)} className="px-2 py-1 text-xs font-semibold text-amber-300 bg-amber-500/20 rounded-full hover:bg-amber-500/30 transition-colors">Iniciar</button>
                  )}
                  {chamado.status === 'em_andamento' && (
                    <button onClick={() => onFinalizarChamado(chamado.id)} className="px-2 py-1 text-xs font-semibold text-purple-300 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors">Finalizar</button>
                  )}
                  <button onClick={() => onVerDetalhes(chamado.id)} className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-500/20 rounded-full hover:bg-gray-500/30 transition-colors">Detalhes</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem de estado vazio */}
      {sortedChamados.length === 0 && (
        <div className="p-6 text-center text-gray-500 text-sm">Nenhum chamado disponível.</div>
      )}
    </div>
  );
}
