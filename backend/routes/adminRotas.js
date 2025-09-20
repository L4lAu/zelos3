import { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, excluirUsuario } from '../models/admin/ModUser.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import express from 'express'

const router = express.Router()

// Rota inicial do admin
router.get('/', authMiddleware, async (req, res) => {
  res.status(200).send('Bem-vindo à página inicial do Adm!')
})

// Rota para listar todos os usuários
router.get('/usuarios', authMiddleware, async (req, res) => {
  try {
    const usuarios = await listarUsuarios()
    res.json(usuarios)
    console.log('Usuarios:', usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar os usuários!" })
  }
})

// Rota para ver usuário específico a partir do ID
router.get('/usuarios/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const usuario = await obterUsuarioPorId(id)
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado!")
    }
    res.json(usuario)
  } catch (error) {
    console.error(`Não foi possível listar o usuário ${id}`, error)
    res.status(500).send('Erro ao buscar usuário!')
  }
})

// Rota para criar usuário
router.post('/usuarios', authMiddleware, async (req, res) => {
  try {
    const { nome, numero_ra, funcao, senha } = req.body

    const novoUsuario = await criarUsuario({
      nome,
      senha,
      numero_ra,
      funcao
    })

    res.status(201).json(novoUsuario) // já vem no formato { id?, nome, ra, cargo }
  } catch (error) {
    console.error('Não foi possível criar um novo usuário', error)
    res.status(500).send('Erro ao criar usuário!')
  }
})

// Rota para modificar o usuário
router.put('/usuarios/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) {
    return res.status(400).send(`ID inválido!`)
  }

  try {
    const { nome, ra, cargo } = req.body
    const usuarioAtualizado = await atualizarUsuario(id, {
      nome,
      numero_ra: ra,
      funcao: cargo
    })

    if (!usuarioAtualizado) {
      return res.status(404).send(`Usuário com ID ${id} não encontrado!`)
    }
    res.status(200).json(usuarioAtualizado)
  } catch (error) {
    console.error('Não foi possível atualizar o usuário: ', error)
    res.status(500).send('Erro ao atualizar o usuário!')
  }
})

// Rota para excluir o usuário
router.delete('/usuarios/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) {
    return res.status(400).send('ID inválido!')
  }

  try {
    const resultado = await excluirUsuario(id)

    if (!resultado) {
      return res.status(404).send(`Usuário com ID ${id} não encontrado.`)
    }
    return res.status(200).send('Usuário excluído com sucesso!')
  } catch (error) {
    console.error('Não foi possível excluir o usuário', error)
    res.status(500).send('Erro ao excluir o usuário!')
  }
})

export default router
