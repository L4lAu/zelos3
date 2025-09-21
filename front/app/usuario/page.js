// pages/UsuarioPage.jsx
"use client";
import { useState, useEffect } from "react";

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosUsuarioTable from "../components/usuario/ChamadosUsuarioTable";
import ModalNovoChamado from "../components/usuario/ModalNovoChamados";

// Dados mock
const mockChamados = [
  { id: 1, patrimonio: "PAT-001", descricaoProblema: "Computador não liga", tipo: "Manutenção", status: "aberto", dataCriacao: "2024-01-15T10:30:00" },
  { id: 2, patrimonio: "PAT-002", descricaoProblema: "Projetor com imagem tremida", tipo: "Apoio Técnico", status: "em_andamento", dataCriacao: "2024-01-14T14:20:00" },
  { id: 3, patrimonio: "PAT-003", descricaoProblema: "Cadeira com rodinha quebrada", tipo: "Manutenção", status: "concluido", dataCriacao: "2024-01-13T09:15:00" },
];

export default function UsuarioPage() {
  const [user] = useState({ id: 1, nome: "Maria Santos", email: "maria@email.com", tipo: "usuario" });
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNovoChamado, setShowNovoChamado] = useState(false);
  const [erroPatrimonio, setErroPatrimonio] = useState("");

  // Carregar chamados (async dentro do useEffect)
  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 1000));
        setChamados(mockChamados);
      } catch (err) {
        console.error("Erro ao carregar chamados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChamados();
  }, []);

  // Filtrar chamados
  useEffect(() => {
    let resultado = chamados;
    if (filtroStatus !== "todos") resultado = resultado.filter(c => c.status === filtroStatus);
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        c.id.toString().includes(termo) ||
        c.patrimonio.toLowerCase().includes(termo) ||
        c.descricaoProblema.toLowerCase().includes(termo)
      );
    }
    setChamadosFiltrados(resultado);
  }, [chamados, filtroStatus, searchTerm]);

  // Handlers
  const carregarChamados = async () => {
    setLoading(true);
    try { 
      await new Promise(res => setTimeout(res, 1000)); 
      setChamados(mockChamados); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const handleLogout = () => console.log("Usuário deslogado");
  const handleVerDetalhes = id => console.log("Ver detalhes do chamado:", id);
  
  const handleCriarChamado = (novoChamado) => {
    // Validação básica
    if (!novoChamado.patrimonio && !novoChamado.descricaoProblema) {
      setErroPatrimonio("Informe o número de patrimônio ou uma descrição do item");
      return false;
    }
    
    // Verificar se já existe chamado aberto para o mesmo patrimônio e tipo
    const chamadoExistente = chamados.find(c => 
      c.patrimonio === novoChamado.patrimonio && 
      c.tipo === novoChamado.tipo && 
      (c.status === "aberto" || c.status === "em_andamento")
    );
    
    if (chamadoExistente) {
      setErroPatrimonio(`Já existe um chamado ${novoChamado.tipo} aberto para este patrimônio`);
      return false;
    }
    
    // Criar novo chamado
    const novoId = Math.max(...chamados.map(c => c.id), 0) + 1;
    const novoChamadoCompleto = {
      id: novoId,
      patrimonio: novoChamado.patrimonio,
      descricaoProblema: novoChamado.descricaoProblema,
      tipo: novoChamado.tipo,
      status: "aberto",
      dataCriacao: new Date().toISOString()
    };
    
    setChamados([...chamados, novoChamadoCompleto]);
    setShowNovoChamado(false);
    setErroPatrimonio("");
    return true;
  };

  const handleFecharModal = () => {
    setShowNovoChamado(false);
    setErroPatrimonio("");
  };

  return (
   <div className="min-h-screen bg-[#282c34] text-gray-300 flex flex-col">
  {/* Header fixo (já estilizado) */}
  <Header user={user} onLogout={handleLogout} />

  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar (já estilizada) */}
    <Sidebar activePage="meus-chamados" userType="usuario" />

    {/* Conteúdo Principal */}
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Título */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          {/* Título principal com cor clara para destaque */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">Meus Chamados</h1>
          {/* Subtítulo com cor mais suave */}
          <p className="text-gray-400 text-sm sm:text-base">Acompanhe os chamados que você criou</p>
        </div>
        <button
          onClick={() => setShowNovoChamado(true)}
          // Botão com fundo escuro e hover sutil
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base shadow-md"
        >
          Novo Chamado
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow-xl mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <input
          type="text"
          placeholder="Buscar por ID, patrimônio ou descrição..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          // Inputs com fundo, borda e foco adaptados para o tema escuro
          className="w-full lg:flex-1 p-2 bg-[#282c34] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm sm:text-base placeholder-gray-400"
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            // Select com o mesmo estilo do input
            className="p-2 bg-[#282c34] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="todos">Todos os status</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
          <button
            onClick={carregarChamados}
            // Botão com o mesmo estilo do "Novo Chamado"
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base shadow-md w-full sm:w-auto"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Modal de Novo Chamado (LEMBRE-SE DE ESTILIZAR ESTE COMPONENTE INTERNAMENTE) */}
      <ModalNovoChamado
        isOpen={showNovoChamado}
        onClose={handleFecharModal}
        onCreate={handleCriarChamado}
        error={erroPatrimonio}
      />

      {/* Chamados */}
      {loading ? (
        // Estilo de carregamento para o tema escuro
        <div className="bg-[#1e2128] p-6 sm:p-8 rounded-lg shadow-xl text-center border border-black/30">
          <p className="text-gray-300 font-semibold text-sm sm:text-base">Carregando chamados...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#1e2128] p-4 rounded-lg shadow-xl border border-black/30">
          {/* Tabela (LEMBRE-SE DE ESTILIZAR ESTE COMPONENTE INTERNAMENTE) */}
          <ChamadosUsuarioTable
            chamados={chamadosFiltrados}
            onVerDetalhes={handleVerDetalhes}
          />
        </div>
      )}
    </main>
  </div>
</div>
  );
}