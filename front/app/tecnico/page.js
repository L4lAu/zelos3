"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosTable from "../components/tecnico/ChamadosTable";
import HistoricoChamados from "../components/tecnico/HistoricoChamados";
import { verificaPermissao } from "../../utils/auth";

export default function TecnicoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("chamados");
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Verificação de login e permissão ---
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!verificaPermissao(userData, ["tecnico"])) {
        router.push(`/${userData.role}`);
      } else {
        setUser(userData);
      }
    }
  }, [router]);

  // --- Carregar chamados do backend ---
  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/chamados/listar", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao carregar chamados");
        const data = await response.json();
        setChamados(data);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchChamados();
  }, [user]);

  // --- Filtragem ---
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
          c.patrimonio?.toLowerCase().includes(termo) ||
          c.descricaoProblema?.toLowerCase().includes(termo)
      );
    }
    setChamadosFiltrados(resultado);
  }, [chamados, filtroStatus, searchTerm]);

  const handleVerDetalhes = (id) =>
    console.log("Ver detalhes do chamado:", id);

  // --- Tela de carregamento ---
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


  if (loading) {
    return (
      // Fundo escuro, texto claro e logo em destaque
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e2128] text-gray-300 font-sans gap-3">
        <p className="text-sm uppercase tracking-widest">Instituição</p>
        <div className="bg-white text-[#1e2128] font-extrabold tracking-widest px-4 py-2 rounded-md shadow-lg">
          SENAI
        </div>
      </div>
    );
  }

  // --- Caso usuário não exista ---
  if (!user) {
    return (
      // Fundo escuro e mensagem de erro clara
      <div className="flex items-center justify-center min-h-screen bg-[#1e2128]">
        <p className="text-gray-400 bg-gray-900 px-6 py-3 rounded-lg shadow-md">
          Usuário não encontrado. Faça login novamente.
        </p>
      </div>
    );
  }

  // --- Layout Principal da Aplicação ---
  return (
    // Fundo base escuro e cor de texto padrão clara para toda a aplicação
    <div className="min-h-screen bg-[#282c34] text-gray-300 flex flex-col">
      {/* O Header já foi estilizado anteriormente */}
      {user && (
        <Header
          user={user}
          onLogout={() => console.log("Logout")}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* A Sidebar já foi estilizada anteriormente */}
        <Sidebar
          activePage={activePage}
          userType={user.tipo}
          onNavigate={(pageId) => setActivePage(pageId)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Renderiza a view de Chamados */}
          {activePage === "chamados" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
                  Meus Chamados
                </h1>
                <p className="text-gray-400 text-sm sm:text-base mt-1">
                  Gerencie os chamados atribuídos a você
                </p>
              </div>

              {/* Filtros */}
              <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow-xl mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <input
                  type="text"
                  placeholder="Buscar por ID, patrimônio ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:flex-1 p-2 bg-[#282c34] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base placeholder-gray-400"
                />
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="p-2 bg-[#282c34] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="aguardando_aprovacao">
                      Aguardando Aprovação
                    </option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>

              {/* Tabela (Lembre-se de estilizar o componente ChamadosTable internamente) */}
              <ChamadosTable
                chamados={chamadosFiltrados}
                onAceitarChamado={(id) => console.log("Aceitar", id)}
                onIniciarChamado={(id) => console.log("Iniciar", id)}
                onFinalizarChamado={(id) => console.log("Finalizar", id)}
                onAbrirApontamento={() => console.log("Apontamento")}
                onVerDetalhes={handleVerDetalhes}
                user={user}
              />
            </>
          )}

          {/* Renderiza a view de Histórico */}
          {activePage === "historico" && (
            // Lembre-se de estilizar o componente HistoricoChamados internamente
            <HistoricoChamados
              chamados={chamados}
              tecnicoId={user.id}
              onVerDetalhes={handleVerDetalhes}
            />
          )}
        </main>
      </div>
    </div>
  );
}
