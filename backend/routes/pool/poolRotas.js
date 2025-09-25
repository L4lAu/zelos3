import express from 'express';
import { 
    obterPoolPorId, 
    excluirPool, 
    criarPool, 
    listarPool,
    atualizarPool
} from '../../models/pool/Pool.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
//eae
// opa
const router = express.Router();

// GET /pool - Lista todos os pools (protegido)
router.get("/pool", authMiddleware, async (req, res) => {
    try {
        const pool = await listarPool();
        res.json(pool);
    } catch (error) {
        console.error('Erro na rota GET /pool:', error);
        res.status(500).json({ error: "Erro ao buscar o pool" });
    }
});

// GET /pool/:id - Busca pool por ID (protegido)
router.get('/pool/:id', authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido. Deve ser um número positivo.' });
        }

        const pool = await obterPoolPorId(id);
        if (!pool) {
            return res.status(404).json({ erro: 'Pool não encontrado' });
        }

        res.json(pool);
    } catch (error) {
        console.error('Erro na rota GET /pool/:id:', error);
        res.status(500).json({ erro: error.message || 'Erro interno no servidor' });
    }
});

// DELETE /pool/:id - Exclui pool por ID (protegido)
router.delete('/pool/:id', authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido. Deve ser um número positivo.' });
        }

        const result = await excluirPool(id);
        if (result === 0) {
            return res.status(404).json({ erro: 'Pool não encontrado' });
        }

        res.status(200).json({ message: 'Pool excluído com sucesso', id });
    } catch (error) {
        console.error('Erro na rota DELETE /pool/:id:', error);
        res.status(500).json({ erro: error.message || 'Erro interno no servidor' });
    }
});

// POST /pool - Cria novo pool (protegido)
router.post('/Pool', authMiddleware, async (req, res) => {
    try { // vem do token JWT
        const poolData = req.body;

        if (!poolData || Object.keys(poolData).length === 0) {
            return res.status(400).json({ erro: 'Dados do pool são obrigatórios.' });
        }

        // Adiciona o campo created_by
        const novoPool = await criarPool({ ...poolData,});

        res.status(201).json(novoPool);
    } catch (error) {
        console.error('Erro na rota POST /pool:', error);
        res.status(400).json({ erro: error.message || 'Erro ao criar o pool' });
    }
});

//PUT
router.put('/pool/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID inválido. Deve ser um número positivo.' });
      }
  
      const poolData = req.body;
      if (!poolData || Object.keys(poolData).length === 0) {
        return res.status(400).json({ erro: 'Dados para atualização são obrigatórios.' });
      }
      const affectedRows = await atualizarPool(id, poolData);
      if (affectedRows === 0) {
        return res.status(404).json({ erro: 'Pool não encontrado' });
      }
      res.status(200).json({ message: 'Pool atualizado com sucesso!' });
  
    } catch (error) {
      console.error('Erro na rota PUT /pool/:id:', error);
      res.status(500).json({ erro: error.message || 'Erro ao atualizar o pool' });
    }
  });
export default router;
