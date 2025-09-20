import { create, readAll, read, update, deleteRecord } from '../../config/database.js';

const listarUsuarios = async () => {
  try {
    return await readAll('usuarios');
  } catch (error) {
    console.error('Erro ao listar os usuários:', error);
    throw error;
  }
};


const obterUsuarioPorId = async (id) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    const where = `id = ?`; // Define a condição
    const result = await read('usuarios', where, [id]); // Passa a tabela, a condição e os parâmetros
    return result;
  } catch (error) {
    console.error('Erro ao obter o usuário por ID:', error);
    throw error;
  }
};

const criarUsuario = async (UsuarioData) => {
  try {
    // Substitui undefined por null
    const safeData = {};
    Object.keys(UsuarioData).forEach(key => {
      safeData[key] = UsuarioData[key] ?? null;
    });

    await create('usuarios', safeData);
    console.log("Usuário criado:", safeData);
    return "O usuário foi criado com sucesso!";
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
    throw error;
  }
};


const atualizarUsuario = async (id, UsuarioData) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }

    // Validação do número RA
    if (!UsuarioData.numero_ra || isNaN(Number(UsuarioData.numero_ra))) {
      throw new Error('O número RA é obrigatório e deve ser um número.');
    }

    // Converte numero_ra para número
    UsuarioData.numero_ra = Number(UsuarioData.numero_ra);

    // Remove campos undefined ou nulos para não quebrar a query
    const safeData = {};
    Object.keys(UsuarioData).forEach(key => {
      if (UsuarioData[key] !== undefined && UsuarioData[key] !== null) {
        safeData[key] = UsuarioData[key];
      }
    });

    if (Object.keys(safeData).length === 0) {
      throw new Error('Nenhum dado válido para atualizar.');
    }

    // Atualiza o usuário
    const affectedRows = await update('usuarios', safeData, `id = ${id}`);
    return affectedRows;

  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    throw error;
  }
};







const excluirUsuario = async (id) => {
  try {
  return await deleteRecord('usuarios', `id = ${id}`)
  } catch (error) {
    console.error('Erro ao excluir o o usuário', error)
  }
};

export { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, excluirUsuario };