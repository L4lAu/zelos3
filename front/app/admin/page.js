// pages/ChamadosAdm.jsx
"use client";
import React, { useState, useEffect } from "react";
import "./admin.css";
import Sidebar from "../components/layout/sidebar_admin/Sidebar";
import Footer from "../components/layout/footer/Footer";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { verificaPermissao } from "../../utils/auth";

export default function ChamadosAdm() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("details");
  const [currentChamado, setCurrentChamado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="admin-layout-container">
      <Sidebar />
      <main className="main-content-area">
        <motion.div className="page-wrapper" onMouseMove={handleMouseMove}>
          <div className="content-wrapper">
            <div className="admin-container">
              <div className="admin-header">
                <h1>Painel Administrativo</h1>
              </div>

              {loading ? (
                <p>Carregando chamados...</p>
              ) : (
                <>
                  <div className="stats-container">
                    <div className="stat-card total">
                      <h4>Total de Chamados</h4>
                      <p>{stats.total}</p>
                    </div>
                    <div className="stat-card aberto">
                      <h4>Abertos</h4>
                      <p>{stats.abertos}</p>
                    </div>
                    <div className="stat-card em-andamento">
                      <h4>Em Andamento</h4>
                      <p>{stats.emAndamento}</p>
                    </div>
                    <div className="stat-card concluido">
                      <h4>Concluídos</h4>
                      <p>{stats.concluidos}</p>
                    </div>
                  </div>

                  <div className="controls-container">
                    <input
                      type="search"
                      placeholder="🔎 Buscar por protocolo, assunto, status..."
                      className="search-bar"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      className="btn-create"
                      onClick={() => handleOpenModal("create")}
                    >
                      Criar Novo Chamado
                    </button>
                  </div>

                  <div className="chamados-list-container">
                    <div className="chamados-list-header">
                      <div className="col-protocolo">Protocolo</div>
                      <div className="col-assunto">Assunto</div>
                      <div className="col-data">Data</div>
                      <div className="col-status">Status</div>
                      <div className="col-acoes">Ações</div>
                    </div>

                    {filteredChamados.map((c) => (
                      <div key={c.id} className="chamado-list-item">
                        <div className="col-protocolo">{c.protocolo}</div>
                        <div className="col-assunto">
                          {c.assunto?.length > MAX_ASSUNTO_LENGTH ? (
                            <span>
                              {`${c.assunto.substring(
                                0,
                                MAX_ASSUNTO_LENGTH
                              )}...`}
                              <span
                                className="ver-mais-text"
                                onClick={() => handleOpenModal("details", c)}
                              >
                                Ver mais...
                              </span>
                            </span>
                          ) : (
                            c.assunto
                          )}
                        </div>
                        <div className="col-data">{c.data}</div>
                        <div className="col-status">
                          <span
                            className={`status-badge ${getStatusClass(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <div className="col-acoes">
                          <button
                            className="btn-action details"
                            onClick={() => handleOpenModal("details", c)}
                          >
                            Ver
                          </button>
                          <button
                            className="btn-action edit"
                            onClick={() => handleOpenModal("edit", c)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => openDeleteConfirm(c)}
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
        <Footer />
      </main>
    </div>
  );
}
