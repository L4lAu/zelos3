// models/Pool.js
import { create, readAll, read, update, deleteRecord } from '../../config/database.js';

// Função para sanitizar dados (converter undefined para null)
const sanitizeData = (data) => {
  const sanitized = { ...data };
  for (const key in sanitized) {
    if (sanitized[key] === undefined) {
      sanitized[key] = null;
    }
  }
  return sanitized;
};

const listarPool = async () => {
  try {
    return await readAll('pool');
  } catch (error) {
    console.error('Erro ao listar os pools:', error);
    throw error;
  }
};

const obterPoolPorId = async (id) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    const where = `id = ?`;
    const result = await read('pool', where, [id]);
    return result;
  } catch (error) {
    console.error('Erro ao obter o pool por ID:', error);
    throw error;
  }
};

const criarPool = async (poolData) => {
  try {
    // Sanitiza os dados antes de criar
    const sanitizedData = sanitizeData(poolData);
    await create('pool', sanitizedData);
    return "Pool criado com sucesso!";
  } catch (error) {
    console.error('Erro ao criar pool:', error);
    throw error;
  }
};

const atualizarPool = async (id, poolData) => {
  try {
    if (isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número positivo.');
    }
    
    // Sanitiza os dados antes de atualizar
    const sanitizedData = sanitizeData(poolData);
    
    const fields = Object.keys(sanitizedData).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(sanitizedData);
    const query = `UPDATE pool SET ${fields} WHERE id = ?`;
    const result = await update(query, [...values, id]);
    return result.affectedRows;
  } catch (error) {
    console.error('Erro ao atualizar o pool:', error);
    throw error;
  }
};

const excluirPool = async (id) => {
  try {
    return await deleteRecord('pool', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir o pool', error);
    throw error;
  }
};

export { listarPool, obterPoolPorId, criarPool, atualizarPool, excluirPool };