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
  const [user, setUser] = useState({})  ;
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNovoChamado, setShowNovoChamado] = useState(false);
  const [erroPatrimonio, setErroPatrimonio] = useState("");

  // Instância do axios
  const api = axios.create({
    baseURL: "http://localhost:3001", // ajuste conforme seu backend
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

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

  // Filtrar chamados
  useEffect(() => {
    let resultado = chamados;
    if (filtroStatus !== "todos") {
      resultado = resultado.filter((c) => c.status === filtroStatus);
    }
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.id.toString().includes(termo) ||
          (c.patrimonio && c.patrimonio.toLowerCase().includes(termo)) ||
          (c.descricaoProblema &&
            c.descricaoProblema.toLowerCase().includes(termo))
      );
    }
    setChamadosFiltrados(resultado);
  }, [chamados, filtroStatus, searchTerm]);

  // Criar chamado
  const handleCriarChamado = async (novoChamado) => {
    if (!novoChamado.patrimonio && !novoChamado.descricaoProblema) {
      setErroPatrimonio("Informe o número de patrimônio ou uma descrição do item");
      return false;
    }

    try {
      const response = await api.post("/pool", novoChamado);
      setChamados([...chamados, response.data]);
      setShowNovoChamado(false);
      setErroPatrimonio("");
      return true;
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      alert("Erro ao criar chamado.");
      return false;
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

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header fixo */}
      <Header
        user={user}
        onLogout={handleLogout}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activePage="meus-chamados"
          userType="usuario"
          onNavigate={() => setSidebarOpen(false)}
        />

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {/* Título */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">
                Meus Chamados
              </h1>
              <p className="text-gray-700 text-sm sm:text-base">
                Acompanhe os chamados que você criou
              </p>
            </div>
            <button
              onClick={() => setShowNovoChamado(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base"
            >
              Novo Chamado
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white border border-red-500 p-4 rounded-lg shadow mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <input
              type="text"
              placeholder="Buscar por ID, patrimônio ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:flex-1 p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base w-full sm:w-auto"
              >
                <option value="todos">Todos os status</option>
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
              <button
                onClick={carregarChamados}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base w-full sm:w-auto"
              >
                Atualizar
              </button>
            </div>
          </div>

          {/* Modal Novo Chamado */}
          <ModalNovoChamado
            isOpen={showNovoChamado}
            onClose={handleFecharModal}
            onCreate={handleCriarChamado}
            error={erroPatrimonio}
          />

          {/* Chamados */}
          {loading ? (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center border border-red-300">
              <p className="text-red-600 font-semibold text-sm sm:text-base">
                Carregando chamados...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
