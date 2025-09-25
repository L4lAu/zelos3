import jwt from 'jsonwebtoken';
import { read, compare } from '../config/database.js';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar se o usuário existe no banco de dados
    const usuario = await read('usuarios', `numero_ra = '${username}'`);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Verificar se a senha está correta (comparar a senha enviada com o hash armazenado)
    const senhaCorreta = await compare(password, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Gerar o token JWT
    const payload = { id: usuario.id, ra: usuario.numero_ra, displayName: usuario.nome, role: usuario.funcao };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // Adicione o objeto user ao retorno
    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      user: {
        id: usuario.id,
        numero_ra: usuario.numero_ra,
        email: usuario.email,
        role: usuario.funcao,
        displayName: usuario.nome,
      }
    });  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
};

export { loginController };