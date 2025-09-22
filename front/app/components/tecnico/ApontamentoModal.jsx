import { useState } from 'react';

export default function ApontamentoModal({ chamado, tecnicoId, onClose, onSave }) {
  const [descricao, setDescricao] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fim) < new Date(inicio)) {
      setError('A data de término não pode ser anterior à data de início.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      setTimeout(() => {
        onSave();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar apontamento:', error);
      setLoading(false);
    }
  };

  return (
    // Fundo overlay mais escuro e imersivo
    <div className="fixed inset-0 bg-black bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
      {/* Painel do modal com o tema escuro */}
      <div className="bg-[#1e2128] rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        <div className="p-4 sm:p-6">
          {/* Título com cor clara e destaque no ID do chamado */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">
            Novo Apontamento - <span className="text-gray-400">#{chamado.id}</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {/* Labels com cor suave para não sobrecarregar a UI */}
              <label className="block text-gray-400 text-xs sm:text-sm font-bold mb-2" htmlFor="descricao">
                Descrição do Serviço
              </label>
              <textarea
                id="descricao"
                rows="4"
                // Estilo dos inputs para o modo escuro
                className="w-full p-2 bg-[#282c34] border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-xs sm:text-sm placeholder-gray-500"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-bold mb-2" htmlFor="inicio">
                  Início
                </label>
                <input
                  type="datetime-local"
                  id="inicio"
                  className="w-full p-2 bg-[#282c34] border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-xs sm:text-sm"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-bold mb-2" htmlFor="fim">
                  Fim
                </label>
                <input
                  type="datetime-local"
                  id="fim"
                  className="w-full p-2 bg-[#282c34] border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-xs sm:text-sm"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              // A cor de erro pode ser mantida, mas um tom mais vivo se destaca melhor no escuro
              <p className="text-red-500 text-xs sm:text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-end space-x-2 sm:space-x-3 pt-4 border-t border-gray-700">
              {/* Botão de Cancelar (ação secundária) com estilo sutil */}
              <button
                type="button"
                className="px-3 sm:px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors duration-200 text-xs sm:text-sm"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>

              {/* Botão de Salvar (ação primária) com mais destaque */}
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 disabled:opacity-50 transition-colors duration-200 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
