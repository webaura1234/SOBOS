'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashAnimationProps {
  onComplete: () => void;
}

const LETTERS = ['S', 'O', 'B', 'O', 'S'];
const QUOTE = 'Every great meal starts with great management.';

export function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const [phase, setPhase] = useState<'idle' | 'letters' | 'quote' | 'hold' | 'exit'>('idle');

  useEffect(() => {
    const timeline = async () => {
      // Initial pause
      await new Promise(r => setTimeout(r, 200));
      
      // Letters phase
      setPhase('letters');
      await new Promise(r => setTimeout(r, 1200));
      
      // Quote phase
      setPhase('quote');
      await new Promise(r => setTimeout(r, 800));
      
      // Hold phase
      setPhase('hold');
      await new Promise(r => setTimeout(r, 600));
      
      // Exit phase
      setPhase('exit');
      await new Promise(r => setTimeout(r, 600));
      
      onComplete();
    };
    
    timeline();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Subtle animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-gray-100"
            style={{ width: i * 200, height: i * 200 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: phase === 'exit' ? 1.5 : 1.2,
              opacity: phase === 'exit' ? 0 : 0.3,
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.3,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* SOBOS letters */}
        <div className="flex gap-2 md:gap-3 mb-6">
          {LETTERS.map((letter, index) => (
            <motion.span
              key={index}
              className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight relative"
              style={{ color: '#0f172a' }}
              initial={{ 
                opacity: 0, 
                y: 80,
                rotateX: -90,
                scale: 0.5,
              }}
              animate={phase !== 'exit' ? { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                scale: 1,
              } : {
                opacity: 0,
                y: -30,
                scale: 1.2,
              }}
              transition={{
                duration: 0.7,
                delay: phase === 'exit' ? index * 0.05 : 0.3 + index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
              {/* Subtle shine effect on first reveal */}
              {phase === 'letters' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.12 }}
                  style={{ mixBlendMode: 'overlay' }}
                />
              )}
            </motion.span>
          ))}
        </div>
        
        {/* Quote */}
        <AnimatePresence>
          {(phase === 'quote' || phase === 'hold') && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Decorative line */}
              <motion.div
                className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              
              <p
                className="text-sm sm:text-base font-light text-center max-w-md px-4 tracking-wide"
                style={{ color: '#64748b', fontWeight: 300 }}
              >
                {QUOTE}
              </p>
              
              {/* Decorative line */}
              <motion.div
                className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit overlay */}
      <AnimatePresence>
        {phase === 'exit' && (
          <motion.div
            className="absolute inset-0 bg-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
