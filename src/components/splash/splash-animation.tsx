'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashAnimationProps {
  onComplete: () => void;
}

const LETTERS = ['S', 'O', 'B', 'O', 'S'];
const QUOTE = 'Every great meal starts with great management.';
const INITIAL_DELAY = 300;
const LETTER_STAGGER = 120;
const QUOTE_DELAY = 400;
const HOLD_DURATION = 600;
const EXIT_DURATION = 400;

export function SplashAnimation({ onComplete }: SplashAnimationProps) {
  const [visibleLetters, setVisibleLetters] = useState<number>(0);
  const [showQuote, setShowQuote] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Initial pause before first letter
    const initialTimer = setTimeout(() => {
      setVisibleLetters(1);
    }, INITIAL_DELAY);

    // Stagger remaining letters
    const letterTimers = LETTERS.slice(1).map((_, index) => {
      return setTimeout(() => {
        setVisibleLetters((prev) => prev + 1);
      }, INITIAL_DELAY + (index + 1) * LETTER_STAGGER);
    });

    // Show quote after letters complete
    const quoteTimer = setTimeout(() => {
      setShowQuote(true);
    }, INITIAL_DELAY + LETTERS.length * LETTER_STAGGER + QUOTE_DELAY);

    // Hold then exit
    const holdTimer = setTimeout(() => {
      setIsExiting(true);
    }, INITIAL_DELAY + LETTERS.length * LETTER_STAGGER + QUOTE_DELAY + HOLD_DURATION);

    // Call onComplete after exit animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, INITIAL_DELAY + LETTERS.length * LETTER_STAGGER + QUOTE_DELAY + HOLD_DURATION + EXIT_DURATION);

    return () => {
      clearTimeout(initialTimer);
      letterTimers.forEach(clearTimeout);
      clearTimeout(quoteTimer);
      clearTimeout(holdTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION / 1000 }}
        />
      )}
      
      <motion.div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: EXIT_DURATION / 1000 }}
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex gap-1 mb-4">
          {LETTERS.map((letter, index) => (
            <motion.span
              key={index}
              className="text-7xl md:text-8xl font-black tracking-tight"
              style={{ color: '#0f172a' }}
              initial={{ opacity: 0, y: 20 }}
              animate={index < visibleLetters ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <AnimatePresence>
          {showQuote && (
            <motion.p
              className="text-sm md:text-base font-light text-center max-w-md px-4"
              style={{ color: '#64748b', fontWeight: 300 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {QUOTE}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
