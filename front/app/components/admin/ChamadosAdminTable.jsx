// pages/ChamadosAdm.jsx
import { useState, useEffect } from "react";
import ChamadosAdminTable from "../components/ChamadosAdminTable";

export default function ChamadosAdm() {
  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [user, setUser] = useState({});


  useEffect(() => {
    // Recupera usuário do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Aqui você vai buscar os chamados e técnicos
    const fetchChamados = async () => {
      const res = await fetch("http://localhost:3000/api/chamados");
      const data = await res.json();
      setChamados(data);
    };

    const fetchTecnicos = async () => {
      const res = await fetch("http://localhost:3000/api/tecnicos");
      const data = await res.json();
      setTecnicos(data);
    };

    fetchChamados();
    fetchTecnicos();
  }, []);

  const handleAtribuirTecnico = (chamadoId, tecnicoId) => {
    console.log("Atribuir técnico:", chamadoId, tecnicoId);
    // chamada para API
  };

  const handleEditarChamado = (chamadoId, dados) => {
    console.log("Editar chamado:", chamadoId, dados);
    // chamada para API
  };

  const handleFecharChamado = (chamadoId, resolucao) => {
    console.log("Fechar chamado:", chamadoId, resolucao);
    // chamada para API
  };

  const handleVerDetalhes = (chamadoId) => {
    console.log("Ver detalhes chamado:", chamadoId);
    // redirecionar ou abrir modal
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gerenciamento de Chamados</h1>

      {user ? (
        <ChamadosAdminTable
          chamados={chamados}
          tecnicos={tecnicos}
          onAtribuirTecnico={handleAtribuirTecnico}
          onEditarChamado={handleEditarChamado}
          onFecharChamado={handleFecharChamado}
          onVerDetalhes={handleVerDetalhes}
          user={user}
        />
      ) : (
        <p className="text-gray-500">Carregando usuário...</p>
      )}
    </div>
  );
}
