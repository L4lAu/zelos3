// pages/ChamadosAdm.jsx
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { motion, useMotionValue, useTransform } from "framer-motion";

import ModalNovoChamado from "../components/usuario/ModalNovoChamados";
import { verificaPermissao } from "../../utils/auth";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function ChamadosAdm() {
  const [chamados, setChamados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details");
  const [currentChamado, setCurrentChamado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [chamadoToDelete, setChamadoToDelete] = useState(null);
  const [isReadyToDelete, setIsReadyToDelete] = useState(false);
  const [showNovoChamado, setShowNovoChamado] = useState(false);
  const MAX_descricao_LENGTH = 50;
  const [user, setUser] = useState({});
  const [erroPatrimonio, setErroPatrimonio] = useState("");
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!verificaPermissao(userData, ["admin"])) {
      window.location.href = `/${userData.role}`;
      return;
    }
    setUser(userData);
  }, []);



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

  // 🔹 Proteção de rota
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!verificaPermissao(user, ["admin"])) {
        window.location.href = `/${user.role}`;
      }
    }
  }, []);

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


  const handleOpenModal = (mode, chamado = null) => {
    setModalMode(mode);
    setCurrentChamado(
      chamado || { descricao: "", tipo: "", status: "Aberto", created_by: "", criado_em: "".string() }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentChamado(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentChamado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (modalMode === "create") {
        const response = await fetch("http://localhost:3001/chamados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentChamado),
        });
        const novoChamado = await response.json();
        setChamados((prev) => [novoChamado, ...prev]);
      } else if (modalMode === "edit") {
        const response = await fetch(
          `http://localhost:3001/chamados/${currentChamado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(currentChamado),
          }
        );
        const atualizado = await response.json();
        setChamados((prev) =>
          prev.map((c) => (c.id === atualizado.id ? atualizado : c))
        );
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar chamado:", err);
    }
  };

  const openDeleteConfirm = (chamado) => {
    setChamadoToDelete(chamado);
    setIsConfirmModalOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmModalOpen(false);
    setIsReadyToDelete(false);
    setChamadoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3001/chamados/DeletarChamados/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setChamados(chamados.filter((c) => c.id !== chamadoToDelete.id));
      closeDeleteConfirm();
    } catch (err) {
      console.error("Erro ao deletar chamado:", err);
    }
  };

  const filteredChamados = chamados.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.created_by?.toString().toLowerCase().includes(term) ||
      c.descricao?.toLowerCase().includes(term) ||
      c.tipo?.toLowerCase().includes(term) ||
      c.status?.toLowerCase().includes(term)
    );
  });

  const stats = {
    total: chamados.length,
    abertos: chamados.filter((c) => c.status === "aberto").length,
    emAndamento: chamados.filter((c) => c.status === "em Andamento").length,
    concluidos: chamados.filter((c) => c.status === "concluído").length,
  };

  // 🔹 Parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const parallaxX = useTransform(x, (latest) => latest * 0.05);
  const parallaxY = useTransform(y, (latest) => latest * 0.05);
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.width / 2);
    y.set(event.clientY - rect.height / 2);
  };

  const getStatusClass = (status) => {
    if (status === "Aberto") return "aberto";
    if (status === "Em Andamento") return "em-andamento";
    if (status === "Concluído") return "concluido";
    return "";
  };


  const handleLogout = () => {
    router.push("/"); // redireciona para página de login
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // remove usuário do localStorage
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
    <div className="min-h-screen bg-[#282c34] text-gray-300 flex flex-col">
      {/* Header fixo */}
      <Header user={user} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage="chamados-adm" userType="admin" />

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Título */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
                Painel Administrativo
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Gerencie todos os chamados do sistema
              </p>
            </div>
            <button
                onClick={() => setShowNovoChamado(true)}
                // Botão com fundo escuro e hover sutil
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base shadow-md"
              >
                Criar Novo Chamado
              </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow text-center">
              <h4 className="text-gray-400 text-sm">Total de Chamados</h4>
              <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
            </div>
            <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow text-center">
              <h4 className="text-gray-400 text-sm">Abertos</h4>
              <p className="text-2xl font-bold text-red-400">{stats.abertos}</p>
            </div>
            <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow text-center">
              <h4 className="text-gray-400 text-sm">Em Andamento</h4>
              <p className="text-2xl font-bold text-yellow-400">{stats.emAndamento}</p>
            </div>
            <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow text-center">
              <h4 className="text-gray-400 text-sm">Concluídos</h4>
              <p className="text-2xl font-bold text-green-400">{stats.concluidos}</p>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="bg-[#1e2128] border border-black/30 p-4 rounded-lg shadow mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <input
              type="text"
              placeholder="🔎 Buscar por created_by, descricao, status..."
              className="w-full lg:flex-1 p-2 bg-[#282c34] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm sm:text-base placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                  onClick={()=>carregarChamados(true)}
                  // Botão com o mesmo estilo do "Novo Chamado"
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base shadow-md w-full sm:w-auto"
                >
                  Atualizar
                </button>
          </div>
          <ModalNovoChamado
              isOpen={showNovoChamado}
              onClose={handleFecharModal}
              onCreate={handleCriarChamado}
              error={erroPatrimonio}
            />
          <div className="overflow-x-auto bg-[#1e2128] p-4 rounded-lg shadow-xl border border-black/30">
  {/* Tabela desktop */}
  <table className="hidden md:table w-full text-left border-collapse min-w-[600px]">
    <thead className="text-gray-400 text-xs sm:text-sm">
      <tr>
        <th className="pb-3 px-2 min-w-[60px]">RA</th>
        <th className="pb-3 px-2 min-w-[150px]">Descrição</th>
        <th className="pb-3 px-2 min-w-[100px]">Data criação</th>
        <th className="pb-3 px-2 min-w-[100px]">Status</th>
        <th className="pb-3 px-2 min-w-[120px] text-right">Ações</th>
      </tr>
    </thead>
    <tbody className="text-gray-300 text-xs sm:text-sm">
      {filteredChamados
        .filter((c) => c.status.toLowerCase() === "aberto")
        .map((c) => (
          <tr
            key={c.id}
            className="border-t border-gray-700 hover:bg-[#2f333d] transition"
          >
            <td className="py-2 px-2 whitespace-nowrap">{c.created_by}</td>
            <td className="py-2 px-2 max-w-xs break-words">
              {c.descricao?.length > MAX_descricao_LENGTH ? (
                <>
                  {c.descricao.substring(0, MAX_descricao_LENGTH)}...
                  <button
                    className="text-blue-400 hover:underline ml-1"
                    onClick={() => handleOpenModal("details", c)}
                  >
                    Ver mais
                  </button>
                </>
              ) : (
                c.descricao
              )}
            </td>
            <td className="py-2 px-2 whitespace-nowrap">
              {`${new Date(c.criado_em).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })} às ${new Date(c.criado_em).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            </td>
            <td className="py-2 px-2 whitespace-nowrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  c.status === "Aberto"
                    ? "bg-red-500/20 text-red-400"
                    : c.status === "Em Andamento"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : c.status === "Concluído"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {c.status}
              </span>
            </td>
            <td className="py-2 px-2 flex flex-wrap gap-2 justify-end min-w-[120px]">
              <button
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs"
                onClick={() => handleOpenModal("details", c)}
              >
                Ver
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs"
                onClick={() => handleOpenModal("edit", c)}
              >
                Editar
              </button>
              <button
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs"
                onClick={() => openDeleteConfirm(c)}
              >
                Deletar
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>

  {/* Cards mobile */}
  <div className="md:hidden flex flex-col gap-4">
    {filteredChamados
      .filter((c) => c.status.toLowerCase() === "aberto")
      .map((c) => (
        <div
          key={c.id}
          className="bg-[#2f333d] rounded-lg p-4 shadow-md border border-black/30"
        >
          <div className="mb-2">
            <span className="font-semibold text-gray-400 text-xs uppercase">
              RA:
            </span>{" "}
            <span className="text-gray-300">{c.created_by}</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold text-gray-400 text-xs uppercase">
              Descrição:
            </span>{" "}
            <span className="text-gray-300">
              {c.descricao?.length > MAX_descricao_LENGTH ? (
                <>
                  {c.descricao.substring(0, MAX_descricao_LENGTH)}...
                  <button
                    className="text-blue-400 hover:underline ml-1"
                    onClick={() => handleOpenModal("details", c)}
                  >
                    Ver mais
                  </button>
                </>
              ) : (
                c.descricao
              )}
            </span>
          </div>

          <div className="mb-2">
            <span className="font-semibold text-gray-400 text-xs uppercase">
              Data criação:
            </span>{" "}
            <span className="text-gray-300">{`${new Date(
              c.criado_em
            ).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })} às ${new Date(c.criado_em).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold text-gray-400 text-xs uppercase">
              Status:
            </span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                c.status === "Aberto"
                  ? "bg-red-500/20 text-red-400"
                  : c.status === "Em Andamento"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : c.status === "Concluído"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {c.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-end mt-2">
            <button
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs"
              onClick={() => handleOpenModal("details", c)}
            >
              Ver
            </button>
            <button
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs"
              onClick={() => handleOpenModal("edit", c)}
            >
              Editar
            </button>
            <button
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs"
              onClick={() => openDeleteConfirm(c)}
            >
              Deletar
            </button>
          </div>
        </div>
      ))}
  </div>
</div>

        </main>
      </div>
    </div>
  );
}
