'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
  features: string[];
  color: 'indigo' | 'emerald' | 'purple';
  icon: string;
}

const StepsScrollStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const steps: Step[] = [
    {
      id: 1,
      title: "Write Your Entry",
      description: "Capture your thoughts, feelings, and experiences in our secure editor with military-grade encryption.",
      features: [
        "Real-time encryption as you type",
        "Rich text formatting support",
        "Media attachment capabilities"
      ],
      color: "indigo",
      icon: "✍️"
    },
    {
      id: 2,
      title: "Sign & Store Forever",
      description: "Cryptographically sign your entry and store it permanently on the decentralized network.",
      features: [
        "Digital signature with your private key",
        "Immutable storage on blockchain",
        "Zero-knowledge proof validation"
      ],
      color: "emerald",
      icon: "🔒"
    },
    {
      id: 3,
      title: "Access Anywhere",
      description: "Retrieve your entries securely from any device with your cryptographic keys.",
      features: [
        "Cross-platform synchronization",
        "End-to-end encrypted retrieval",
        "Offline access capability"
      ],
      color: "purple",
      icon: "🌐"
    }
  ];

  // Color-specific gradients
  const gradientMap = {
    indigo: "from-indigo-900/40 to-indigo-950/20 border-indigo-500/40",
    emerald: "from-emerald-900/40 to-emerald-950/20 border-emerald-500/40",
    purple: "from-purple-900/40 to-purple-950/20 border-purple-500/40"
  };
  
  const borderMap = {
    indigo: "border-indigo-500/30",
    emerald: "border-emerald-500/30",
    purple: "border-purple-500/30"
  };
  
  const textMap = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400"
  };
  
  const bgMap = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500"
  };

  return (
    <section ref={ref} className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Experience the power of decentralized journaling with our simple 3-step process
          </motion.p>
        </div>
        
        {/* Timeline line */}
        <div className="relative md:ml-32 pl-8 md:pl-0">
          <motion.div 
            className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-emerald-500 to-purple-500"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          <div className="space-y-20">
            {steps.map((step, index) => {
              // Create scroll-based animations for each step
              const start = index / steps.length;
              const end = (index + 1) / steps.length;
              
              const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
              const circleScale = useTransform(progress, [0, 0.2, 0.4, 0.8, 1], [0.8, 1.2, 1, 1.1, 1]);
              const circleOpacity = useTransform(progress, [0, 0.2, 0.4, 1], [0.5, 1, 1, 1]);
              const contentY = useTransform(progress, [0, 0.3, 1], [50, 0, 0]);
              const contentOpacity = useTransform(progress, [0, 0.2, 0.4, 1], [0, 0.5, 1, 1]);
              const contentScale = useTransform(progress, [0, 0.2, 1], [0.9, 1, 1]);
              
              return (
                <motion.div 
                  key={step.id}
                  className="relative flex flex-col md:flex-row items-start"
                  style={{
                    scale: contentScale
                  }}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`relative flex-shrink-0 w-16 h-16 rounded-full ${bgMap[step.color]}/20 border-2 ${borderMap[step.color]} flex items-center justify-center z-10`}
                    style={{
                      scale: circleScale,
                      opacity: circleOpacity
                    }}
                  >
                    <motion.div 
                      className={`w-8 h-8 rounded-full ${bgMap[step.color]} flex items-center justify-center text-white font-bold text-lg`}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 300 }}
                    >
                      {step.icon}
                    </motion.div>
                    <motion.div 
                      className={`absolute inset-0 rounded-full ${bgMap[step.color]}/30`}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: [0, 1.5, 0] } : { scale: 0 }}
                      transition={{ delay: 1 + index * 0.2, duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Content */}
                  <motion.div
                    className="mt-4 md:mt-0 md:ml-8 w-full"
                    style={{
                      y: contentY,
                      opacity: contentOpacity
                    }}
                  >
                    <div className={`bg-gradient-to-br ${gradientMap[step.color]} rounded-3xl p-8 transition-all duration-500 border backdrop-blur-sm`}>
                      <motion.h3 
                        className={`text-2xl md:text-3xl font-bold ${textMap[step.color]} mb-4`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p 
                        className="text-lg text-gray-300 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                      >
                        {step.description}
                      </motion.p>
                      <ul className="space-y-2 text-gray-400">
                        {step.features.map((feature, featureIndex) => (
                          <motion.li 
                            key={featureIndex} 
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: 0.7 + index * 0.2 + featureIndex * 0.1, duration: 0.5 }}
                          >
                            <motion.span 
                              className={`w-2 h-2 ${bgMap[step.color]} rounded-full mr-3`}
                              whileHover={{ scale: 1.5 }}
                            ></motion.span>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsScrollStack;