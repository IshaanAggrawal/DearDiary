'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ElectricBorder from '@/components/ui/ElectricBorder';

export default function InfiniteFeatures() {
  const features = [
    { id: 1, title: "Immutable Entries", description: "Cryptographically secured entries stored permanently on the blockchain" },
    { id: 2, title: "Zero-Knowledge Privacy", description: "Military-grade encryption ensures only you can access your diary" },
    { id: 3, title: "Decentralized Storage", description: "Distributed across multiple nodes for maximum security and uptime" },
    { id: 4, title: "Verifiable Timestamps", description: "Blockchain timestamps prove when each entry was created" },
    { id: 5, title: "Tamper-Evident", description: "Any modification attempt is immediately detectable" },
    { id: 6, title: "Cross-Platform Sync", description: "Access your immutable diary from any device, anywhere" }
  ];

  const [clones, setClones] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      // Calculate how many clones we need to fill the container
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const clonesNeeded = Math.ceil(containerWidth / contentWidth) + 1;
      
      setClones(clonesNeeded);
    }
  }, []);

  return (
    <motion.div 
      className="relative z-10 max-w-7xl mx-auto px-6 py-24 overflow-hidden bg-black/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">Immutable Features</h2>
        <p className="text-xl text-gray-400 text-balance max-w-2xl mx-auto">
          Blockchain-powered diary with cryptographic guarantees
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden"
      >
        <div 
          className="flex"
          style={{ 
            animation: 'infinite-scroll-horizontal 30s linear infinite',
            width: 'fit-content'
          }}
        >
          <div ref={contentRef} className="flex">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="flex-shrink-0 mx-4 w-[300px] md:w-[350px]"
              >
                <ElectricBorder
                  color="#7df9ff"
                  speed={1}
                  chaos={1}
                  thickness={3}
                  style={{ borderRadius: 16 }}
                >
                  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 h-full transform hover:scale-105 flex flex-col">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
                      <div className="w-5 h-5 bg-green-500 rounded-lg" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400 flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </ElectricBorder>
              </div>
            ))}
            
            {/* Cloned elements for seamless looping */}
            {Array.from({ length: clones }).map((_, cloneIndex) => (
              features.map((feature) => (
                <div 
                  key={`${feature.id}-${cloneIndex}`}
                  className="flex-shrink-0 mx-4 w-[300px] md:w-[350px]"
                >
                  <ElectricBorder
                    color="#7df9ff"
                    speed={1}
                    chaos={0.5}
                    thickness={2}
                    style={{ borderRadius: 16 }}
                  >
                    <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 h-full transform hover:scale-105 flex flex-col">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-3">
                        <div className="w-5 h-5 bg-indigo-500 rounded-lg" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-xs md:text-sm text-gray-400 flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </ElectricBorder>
                </div>
              ))
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.div>
  );
}