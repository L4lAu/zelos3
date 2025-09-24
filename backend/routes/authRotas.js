import express from 'express';
import passport from '../config/ldap.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { loginController } from "../controllers/AuthController.js"

const router = express.Router();


router.post('/local', loginController);

router.post('/', async (req, res, next) => {
  passport.authenticate('ldapauth', { session: false }, async (err, user, info) => {
    if (err) {
      res.status(500).json({ error: 'Erro interno no servidor' });
    } 
    if (!user) {
      console.log('Falha no LDAP:', info); // log do motivo de falha
      return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
    }

    // 🔹 Log do usuário do LDAP e RA enviado
    console.log('Usuário LDAP recebido:', user);
    console.log('RA enviado pelo front:', req.body.username);

    try {
      const numero_ra = req.body.username;
      const nomeCompleto = user.displayName || 'Usuário';


      const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE numero_ra = ?',
        [numero_ra]
      );

      let funcao = 'usuario';
      let usuarioId;

      if (rows.length === 0) {
        const tempSenha = await bcrypt.hash('senha_temporaria', 10);

        const [result] = await pool.query(
          `INSERT INTO usuarios (nome, senha, numero_ra, funcao, status) 
           VALUES (?, ?, ?, ?, ?)`,
          [nomeCompleto, tempSenha, numero_ra, funcao, 'ativo']
        );

        console.log('Usuário criado no banco, ID:', result.insertId); // log do insert
        usuarioId = result.insertId;
      } else {
        console.log('Usuário já existe no banco, ID:', rows[0].id);
        usuarioId = rows[0].id;
        funcao = rows[0].funcao;
      }

      const payload = { id: usuarioId, numero_ra, displayName: nomeCompleto, role: funcao };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

      return res.json({ message: 'Autenticado com sucesso', token, user: payload });

    } catch (dbError) {
      console.error('Erro ao consultar/inserir no banco:', {
        sqlMessage: dbError.sqlMessage,
        sql: dbError.sql
      });
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
  })(req, res, next);
});


export default router