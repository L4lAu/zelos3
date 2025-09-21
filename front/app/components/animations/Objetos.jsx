import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente de background animado com formas geométricas e linhas.
 * Ele é posicionado de forma absoluta para preencher a tela e deve ser
 * colocado como um irmão do conteúdo principal da página, com um z-index menor.
 *
 * @param {object} props - As propriedades do componente.
 * @param {number} [props.numberOfPoints=15] - O número de pontos flutuantes na animação.
 */
const AnimatedBackground = ({ numberOfPoints = 15 }) => {
  return (
    // Container principal da animação
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
  
  {/* Container relativo para posicionar os elementos internos */}
  <div className="relative w-full h-full">
    
    {/* Forma 1: Aro vermelho brilhante e lento */}
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 35,
        repeat: Infinity,
        ease: 'linear',
      }}
      // Aro com borda vermelha, baixa opacidade e efeito de blur para brilho
      className="absolute border border-red-500/20 rounded-full w-48 h-48 left-[5%] top-[10%] blur-sm" 
    />
    
    {/* Forma 2: Aro cinza pulsante */}
    <motion.div
      animate={{
        x: [0, -40, 0],
        y: [0, 60, 0],
        scale: [1, 1.1, 1], // Efeito de pulsar
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
       // Aro com borda mais espessa, cor secundária e sem blur para contraste
      className="absolute border-2 border-red-700/30 blur-lg rounded-full w-32 h-32 left-[70%] top-[30%]"
    />
    
    {/* Forma 3: Grande aro vermelho muito sutil e desfocado */}
    <motion.div
      animate={{
        x: [0, -80, 0],
        y: [0, 100, 0],
      }}
      transition={{
        duration: 45,
        repeat: Infinity,
        ease: 'linear',
      }}
      // Aro bem grande, com borda muito sutil e mais blur, para dar profundidade
      className="absolute border border-red-500/10 rounded-full w-96 h-96 left-[20%] top-[60%] blur-md"
    />

    {/* Pontos flutuantes (Partículas de poeira digital) aprimorados */}
    {[...Array(numberOfPoints)].map((_, i) => {
      // Gera valores aleatórios para cada partícula para um efeito mais natural
      const duration = 5 + Math.random() * 10; // Duração entre 5s e 15s
      const delay = Math.random() * 5; // Atraso de até 5s
      
      return (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0], // Movimento suave para cima e para baixo
            opacity: [0, 0.7, 0], // Pisca suavemente
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          // Alterna entre partículas vermelhas e cinzas para variedade
          className={`absolute rounded-full ${i % 4 === 0 ? 'bg-slate-600' : 'bg-red-500/70'}`}
          style={{
            // Posicionamento e tamanho aleatórios para um efeito de "campo de estrelas"
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`, // Tamanho entre 1px e 3px
            height: `${Math.random() * 2 + 1}px`,
          }}
        />
      );
    })}
  </div>
</div>
  );
};

export default AnimatedBackground;