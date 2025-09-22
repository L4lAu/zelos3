'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 @param {object} props 
 @param {number} [props.numberOfPoints=15]
 */
const AnimatedBackground = ({ numberOfPoints = 40 }) => {
 
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const generatedPoints = [...Array(numberOfPoints)].map((_, i) => {
      const duration = 5 + Math.random() * 100;
      const delay = Math.random() * 5;

      return {
        key: `point-${i}`,
        animate: {
          y: [0, -20, 0],
          opacity: [0, 0.7, 0],
        },
        transition: {
          duration,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        className: `absolute rounded-full ${i % 4 === 0 ? 'bg-slate-600' : 'bg-red-500'}`,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
        },
      };
    });
    setPoints(generatedPoints);
  }, [numberOfPoints]); 

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {/* Forma 1: Aro vermelho brilhante e lento (sem alterações) */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute border border-red-500/20 rounded-full w-48 h-48 left-[5%] top-[10%] blur-sm"
        />
        {/* Forma 2: Aro cinza pulsante (sem alterações) */}
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute border-2 border-red-700/30 blur-lg rounded-full w-32 h-32 left-[70%] top-[30%]"
        />
        {/* Forma 3: Grande aro vermelho muito sutil e desfocado (sem alterações) */}
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute border border-red-500/10 rounded-full w-96 h-96 left-[20%] top-[60%] blur-md"
        />

        {/* 4. Mapear os pontos a partir do estado, que inicialmente estará vazio no servidor */}
        {points.map((point) => (
          <motion.div
            key={point.key}
            animate={point.animate}
            transition={point.transition}
            className={point.className}
            style={point.style}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;