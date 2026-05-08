'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashAnimationProps {
  onComplete: () => void;
}

const LETTERS = ['S', 'O', 'B', 'O', 'S'];
const QUOTE = 'Every great meal starts with great management.';

export function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeline = async () => {
      // Initial pause - let screen settle
      await new Promise(r => setTimeout(r, 400));
      
      // Reveal letters one by one (smooth stagger)
      for (let i = 0; i < LETTERS.length; i++) {
        setVisibleLetters(i + 1);
        await new Promise(r => setTimeout(r, 150));
      }
      
      // Hold after letters complete
      await new Promise(r => setTimeout(r, 500));
      
      // Fade in quote
      setShowQuote(true);
      
      // Hold with quote visible - 3 seconds
      await new Promise(r => setTimeout(r, 3000));
      
      // Exit animation
      setIsExiting(true);
      
      // Wait for exit to complete
      await new Promise(r => setTimeout(r, 800));
      
      onComplete();
    };
    
    timeline();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Smooth gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Subtle animated rings - very gentle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ 
              width: i * 280, 
              height: i * 280,
              border: `1px solid rgba(148, 163, 184, ${0.08 * i})`,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: isExiting ? 1.8 : 1,
              opacity: isExiting ? 0 : 0.08 * i,
            }}
            transition={{ 
              duration: 3,
              delay: i * 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* SOBOS letters container */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-8">
          {LETTERS.map((letter, index) => {
            const isVisible = index < visibleLetters;
            const isExit = isExiting;
            
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ 
                  opacity: 0,
                  y: 60,
                  rotateX: -45,
                  scale: 0.8,
                }}
                animate={isExit ? {
                  opacity: 0,
                  y: -40,
                  scale: 1.1,
                  filter: 'blur(8px)',
                } : isVisible ? {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: isExit ? index * 0.08 : 0,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {/* Letter */}
                <span
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight block"
                  style={{ color: '#0f172a' }}
                >
                  {letter}
                </span>
                
                {/* Subtle shine on reveal */}
                {isVisible && !isExit && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
                    initial={{ x: '-150%', skewX: '-12deg' }}
                    animate={{ x: '150%' }}
                    transition={{ 
                      duration: 0.7, 
                      delay: index * 0.15 + 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ mixBlendMode: 'overlay' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Quote with decorative elements */}
        <AnimatePresence>
          {showQuote && !isExiting && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ 
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Top decorative line */}
              <motion.div
                className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-5"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              
              {/* Quote text */}
              <p
                className="text-xs sm:text-sm md:text-base font-extralight text-center px-6 tracking-[0.08em] leading-relaxed max-w-sm"
                style={{ color: '#64748b', fontWeight: 200 }}
              >
                {QUOTE}
              </p>
              
              {/* Bottom decorative line */}
              <motion.div
                className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-5"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smooth white fade-out overlay for exit */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            className="absolute inset-0 bg-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
