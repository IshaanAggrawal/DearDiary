'use client';

import { ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import BlurText from '@/components/ui/BlurText';

export default function HeroSection() {
  const primaryColor = 'indigo';

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
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 sm:pt-24 lg:pt-32 overflow-hidden bg-black mt-0">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-10 left-10 w-80 h-80 bg-${primaryColor}-500/20 rounded-full blur-[120px] animate-pulse`} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse delay-500" />
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:60px_60px]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center space-y-12 p-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
          <Lock className="w-4 h-4 text-white" />
          <span className={`text-sm font-medium text-white tracking-wider`}>
            Secured by Decentralized Technology
          </span>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl sm:text-4xl md:text-7xl lg:text-8xl font-normal text-white text-balance leading-none"
          >
            <div className="block w-full">
              <BlurText text="Your Immutable" className="w-full" />
            </div>
            <div className="block w-full mt-4">
              <BlurText text="Digital Ledger" className="w-full text-green-500" />
            </div>
          </motion.h1>
          <motion.p 
            variants={itemVariants} 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 text-balance max-w-4xl mx-auto leading-relaxed"
          >
            Capture thoughts, preserve memories, and reflect on your journey with absolute security. Your entries are cryptographically signed and stored forever.
          </motion.p>
        </div>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            className={`group relative w-full sm:w-auto px-10 py-4 bg-${primaryColor}-600 hover:bg-${primaryColor}-500 text-white font-semibold text-lg rounded-xl shadow-2xl shadow-${primaryColor}-500/40 transition-all duration-500 flex items-center justify-center gap-3 transform hover:scale-[1.05]`}
          >
            Start Writing Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-xl border border-white/20 hover:border-white/50 transition-all duration-300"
          >
            View Whitepaper
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}