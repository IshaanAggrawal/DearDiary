'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function InfiniteScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [clones, setClones] = useState<number[]>([]);

  const features = [
    { id: 1, title: "Decentralized Storage", description: "Your data is distributed across multiple nodes for maximum security" },
    { id: 2, title: "End-to-End Encryption", description: "Military-grade encryption protects your private entries" },
    { id: 3, title: "Immutable Records", description: "Once written, your entries can never be altered or deleted" },
    { id: 4, title: "Zero-Knowledge Architecture", description: "We never have access to your personal data" },
    { id: 5, title: "Cross-Platform Sync", description: "Access your diary from any device, anywhere" },
    { id: 6, title: "AI-Powered Insights", description: "Gain valuable insights from your journaling patterns" },
  ];

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      // Calculate how many clones we need to fill the container
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const clonesNeeded = Math.ceil(containerWidth / contentWidth) + 1;
      
      setClones(Array.from({ length: clonesNeeded }, (_, i) => i));
    }
  }, []);

  return (
    <div className="py-16 overflow-hidden bg-black/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">Endless Innovation</h2>
          <p className="text-xl text-gray-400 text-balance max-w-2xl mx-auto">
            Our platform continuously evolves with cutting-edge features
          </p>
        </div>
        
        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden"
        >
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['-100%', '0%'] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <div ref={contentRef} className="flex">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex-shrink-0 mx-4 w-[300px]"
                >
                  <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-indigo-500 rounded-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Cloned elements for seamless looping */}
              {clones.map((cloneIndex) => (
                features.map((feature) => (
                  <div 
                    key={`${feature.id}-${cloneIndex}`}
                    className="flex-shrink-0 mx-4 w-[300px]"
                  >
                    <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                        <div className="w-6 h-6 bg-indigo-500 rounded-lg" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}