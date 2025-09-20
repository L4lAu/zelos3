'use client'

import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    if (!username || !password) {
      setErro('Todos os campos devem ser preenchidos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        switch (data.user.role) {
          case 'admin':
            window.location.href = '/admin';
            break;
          case 'tecnico':
            window.location.href = '/tecnico';
            break;
          case 'usuario':
          default:
            window.location.href = '/usuario';
            break;
        }
      } else {
        setErro(data.message || 'Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao conectar com o servidor');
    }
  };

  return (
    <div>
      <header>
        <div>
          <strong>SENAI</strong> | CHAMADOS ONLINE
        </div>
      </header>

      <main>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <p>Bem-vindo(a) ao Portal Online SENAI-SP!</p>

          {erro && <p>{erro}</p>}

          <div>
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Insira seu RA"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              maxLength={25}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit">Avançar</button>
        </form>
      </main>

      <footer>
        © SENAI-SP - 2025
      </footer>
    </div>
  );
};

export default LoginPage;
