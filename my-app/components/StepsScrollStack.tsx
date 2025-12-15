'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const StepsScrollStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const steps = [
    {
      id: 1,
      title: "Write Your Entry",
      description: "Capture your thoughts, feelings, and experiences in our secure editor with military-grade encryption.",
      features: [
        "Real-time encryption as you type",
        "Rich text formatting support",
        "Media attachment capabilities"
      ],
      color: "indigo"
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
      color: "emerald"
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
      color: "purple"
    }
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the power of decentralized journaling with our simple 3-step process
          </p>
        </div>
        
        {/* Timeline line */}
        <div className="relative md:ml-32 pl-8 md:pl-0">
          <motion.div 
            className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-emerald-500 to-purple-500"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          <div className="space-y-20">
            {steps.map((step, index) => {
              // Create scroll-based animations for each step
              const start = index / steps.length;
              const end = (index + 1) / steps.length;
              
              const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
              const circleScale = useTransform(progress, [0, 0.2, 0.4], [0.8, 1.2, 1]);
              const circleOpacity = useTransform(progress, [0, 0.2, 0.4], [0.5, 1, 1]);
              const contentY = useTransform(progress, [0, 0.3], [50, 0]);
              const contentOpacity = useTransform(progress, [0, 0.2, 0.4], [0, 0.5, 1]);
              
              return (
                <motion.div 
                  key={step.id}
                  className="relative flex flex-col md:flex-row items-start"
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`relative flex-shrink-0 w-16 h-16 rounded-full bg-${step.color}-500/20 border-2 border-${step.color}-500 flex items-center justify-center z-10`}
                    style={{
                      scale: circleScale,
                      opacity: circleOpacity
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full bg-${step.color}-500 flex items-center justify-center text-white font-bold`}>
                      {step.id}
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <motion.div
                    className="mt-4 md:mt-0 md:ml-8 w-full"
                    style={{
                      y: contentY,
                      opacity: contentOpacity
                    }}
                  >
                    <div className={`bg-gradient-to-br from-${step.color}-900/30 to-black border border-${step.color}-500/30 rounded-3xl p-8 transition-all duration-500`}>
                      <h3 className={`text-2xl md:text-3xl font-bold text-${step.color}-400 mb-4`}>
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-300 mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-2 text-gray-400">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <span className={`w-2 h-2 bg-${step.color}-500 rounded-full mr-3`}></span>
                            {feature}
                          </li>
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