'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [startCounting, setStartCounting] = useState(false);
  const { isIntersecting, setElement } = useIntersectionObserver({ 
    root: null, 
    rootMargin: '0px', 
    threshold: 0.1 
  });

  useEffect(() => {
    if (isIntersecting && !startCounting) {
      setStartCounting(true);
    } else if (!isIntersecting && startCounting) {
      setStartCounting(false);
      setCount(0); 
    }
  }, [isIntersecting, startCounting]);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * end));
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animateCount);
      }
    };

    if (startCounting) {
      animationFrame = requestAnimationFrame(animateCount);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [startCounting, end, duration]);

  return <span ref={setElement}>{count.toLocaleString()}+</span>;
};

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-6  border-t border-white/10 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={itemVariants} className="space-y-1 text-center sm:text-left">
        <p className="text-3xl sm:text-4xl font-bold text-white">
          <CountUp end={10000} />
        </p>
        <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Verified Users</p>
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-1 text-center">
        <p className="text-3xl sm:text-4xl font-bold text-white">
          <CountUp end={1000000} />
        </p>
        <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Immutable Entries</p>
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-1 text-center sm:text-right">
        <p className="text-3xl sm:text-4xl font-bold text-white">
          <CountUp end={100} />
        </p>
        <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Data Integrity</p>
      </motion.div>
    </motion.div>
  );
}