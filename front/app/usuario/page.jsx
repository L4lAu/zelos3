// pages/UsuarioPage.jsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosUsuarioTable from "../components/usuario/ChamadosUsuarioTable";
import ModalNovoChamado from "../components/usuario/ModalNovoChamados";
import { verificaPermissao } from "../../utils/auth";

export default function UsuarioPage() {
  const [user, setUser] = useState({});
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNovoChamado, setShowNovoChamado] = useState(false);
  const [erroPatrimonio, setErroPatrimonio] = useState("");


  // Instância do axios

  // Buscar usuário do localStorage e validar permissão
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!verificaPermissao(userData, ["usuario"])) {
      window.location.href = `/${userData.role}`;
      return;
    }
    setUser(userData);
  }, []);

  // Buscar chamados do usuário
  const carregarChamados = async () => {
    setLoading(true);
    const api = axios.create({
      baseURL: "http://localhost:3001", // ajuste conforme seu backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    try {
      const response = await api.get("/pool"); // endpoint que retorna chamados do usuário
      setChamados(response.data);
    } catch (err) {
      console.error("Erro ao carregar chamados:", err);
      alert("Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarChamados();
  }, []);

  useEffect(() => {
    // Filtrar chamados
    let resultado = chamados;
    if (filtroStatus !== "todos") {
      resultado = resultado.filter((c) => c.status === filtroStatus);
    }
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.id.toString().includes(termo) ||
          (c.descricao ||
            c.descricao.toLowerCase().includes(termo))
      );
    }
    setChamadosFiltrados(resultado);
  }, [chamados, filtroStatus, searchTerm]);

  // Criar chamado
  const handleCriarChamado = async (novoChamado) => {
    console.log('Dados do novo chamado:', novoChamado);

    try {
      const token = localStorage.getItem("token")
      const storedUser = user;
      // Verifique se está enviando todos os campos obrigatórios
      const dadosCompletos = {
        descricao: novoChamado.descricao || '',
        tipo: novoChamado.tipo || 'Manutenção',
        // Adicione outros campos obrigatórios da tabela pool aqui
        status: 'Aberto', // exemplo
        created_by: storedUser.numero_ra
      };
      console.log(storedUser)

      const response = await fetch(`http://localhost:3001/pool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosCompletos)
      });

      // ... resto do código
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleVerDetalhes = (id) => {
    console.log("Ver detalhes do chamado:", id);
  };

  const handleFecharModal = () => {
    setShowNovoChamado(false);
    setErroPatrimonio("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <p>INSTITUIÇÃO </p>
        <div className="bg-white text-red-700 font-extrabold tracking-widest px-3 py-1 rounded-sm">
          SENAI
        </div>
      </div>
    );
  }

  // --- Caso usuário não exista ---
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Usuário não encontrado. Faça login novamente.</p>
      </div>
    );
  }


  return (
    <>
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
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">Chamados</h1>
                {/* Subtítulo com cor mais suave */}
                <p className="text-gray-400 text-sm sm:text-base">Acompanhe os chamados de assistencia</p>
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

    </>
  );
}
