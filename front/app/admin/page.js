// pages/ChamadosAdm.jsx
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { verificaPermissao } from "../../utils/auth";

export default function ChamadosAdm() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details");
  const [currentChamado, setCurrentChamado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [chamadoToDelete, setChamadoToDelete] = useState(null);
  const [isReadyToDelete, setIsReadyToDelete] = useState(false);

  const MAX_ASSUNTO_LENGTH = 50;

  // 🔹 Buscar chamados do backend
  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/chamados", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao carregar chamados");
        const data = await response.json();
        setChamados(data);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
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

  const handleOpenModal = (mode, chamado = null) => {
    setModalMode(mode);
    setCurrentChamado(
      chamado || { assunto: "", categoria: "", status: "Aberto", descricao: "" }
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
      await fetch(`http://localhost:3001/chamados//DeletarChamados/${id}`, {
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
      c.protocolo?.toLowerCase().includes(term) ||
      c.assunto?.toLowerCase().includes(term) ||
      c.categoria?.toLowerCase().includes(term) ||
      c.status?.toLowerCase().includes(term)
    );
  });

  const stats = {
    total: chamados.length,
    abertos: chamados.filter((c) => c.status === "Aberto").length,
    emAndamento: chamados.filter((c) => c.status === "Em Andamento").length,
    concluidos: chamados.filter((c) => c.status === "Concluído").length,
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
    localStorage.removeItem("user"); // remove usuário do localStorage
    setUser(null);
    router.push("/login"); // redireciona para página de login
  };

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
            onClick={() => handleOpenModal("create")}
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
            placeholder="🔎 Buscar por protocolo, assunto, status..."
            className="w-full lg:flex-1 p-2 bg-[#282c34] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm sm:text-base placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => handleOpenModal("create")}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm sm:text-base shadow-md w-full lg:w-auto"
          >
            Novo Chamado
          </button>
        </div>

        {/* Lista de chamados */}
        {loading ? (
          <div className="bg-[#1e2128] p-6 sm:p-8 rounded-lg shadow-xl text-center border border-black/30">
            <p className="text-gray-300 font-semibold text-sm sm:text-base">
              Carregando chamados...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#1e2128] p-4 rounded-lg shadow-xl border border-black/30">
            <table className="w-full text-left border-collapse">
              <thead className="text-gray-400 text-sm">
                <tr>
                  <th className="pb-3">Protocolo</th>
                  <th className="pb-3">Assunto</th>
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm sm:text-base">
                {filteredChamados.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-gray-700 hover:bg-[#2f333d] transition"
                  >
                    <td className="py-2">{c.protocolo}</td>
                    <td className="py-2">
                      {c.assunto?.length > MAX_ASSUNTO_LENGTH ? (
                        <>
                          {c.assunto.substring(0, MAX_ASSUNTO_LENGTH)}...
                          <button
                            className="text-blue-400 hover:underline ml-1"
                            onClick={() => handleOpenModal("details", c)}
                          >
                            Ver mais
                          </button>
                        </>
                      ) : (
                        c.assunto
                      )}
                    </td>
                    <td className="py-2">{c.data}</td>
                    <td className="py-2">
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
                    <td className="py-2 flex gap-2 justify-end">
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
          </div>
        )}
      </main>
    </div>
  </div>
  );
}
