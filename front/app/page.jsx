'use client'

import React, { useState } from "react";
import AnimatedBackground from "./components/animations/Objetos";

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
      // Substitua pela URL do seu backend
      const response = await fetch('http://localhost:3001/auth', {
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

        // Redirecionamento baseado na role
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
        const response2 = await fetch('http://localhost:3001/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data2 = await response2.json();

      if (response2.ok) {
        localStorage.setItem('token', data2.token);
        localStorage.setItem('user', JSON.stringify(data2.user));

        // Redirecionamento baseado na role
        switch (data2.user.role) {
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
      }
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao conectar com o servidor');
    }
  };

  return (

    <div
      className="flex flex-col min-h-screen text-white bg-fixed"
    >

      <AnimatedBackground numberOfPoints={40} />

      {/* Header */}
      <header>
        <div className="container mx-auto px-8 py-6 text-left text-2xl tracking-wide">
          <strong
            className="text-red-500 font-bold shadow-[rbg(239,68,68, 0.7)]"
          >
            SENAI
          </strong> | CHAMADOS ONLINE
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex items-center justify-center p-6">

        {/* Formulário (Card) */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[rgba(0,0,0,0.4)] p-12 rounded-xl shadow-2xl border border-[rgb(17,17,27)] backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-red-500">Login</h2>
          <p className="text-center text-slate-400 mb-14">Bem-vindo(a) ao Portal Online SENAI-SP!</p>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 text-sm text-center p-3 rounded-md mb-6">
              {erro}
            </div>
          )}

          {/* Campo Usuário */}
          <div className="mb-5">
            <label htmlFor="username" className="block text-slate-300 text-sm font-medium mb-2">
              Usuário (RA)
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Insira seu RA"
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              maxLength={25}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-4 focus:ring-red-500/50 transition duration-300 transform hover:-translate-y-1"
          >
            Avançar
          </button>
        </form>
      </main>

      {/* Footer: Fundo transparente */}
      <footer className="py-4 text-center text-slate-500 text-sm">
        © SENAI-SP - {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default LoginPage;