'use client';

import { motion } from 'framer-motion';
import BlurText from '@/components/ui/BlurText';

export default function SampleDiarySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const diaryEntries = [
    {
      id: 1,
      date: "May 15, 2023",
      title: "A New Beginning",
      excerpt: "Today I decided to start my journey with Dear Diary. The security and immutability of blockchain gives me peace of mind.",
      tags: ["Reflection", "New Beginnings"]
    },
    {
      id: 2,
      date: "June 2, 2023",
      title: "Overcoming Challenges",
      excerpt: "Work has been tough lately, but writing here helps me process my thoughts and find clarity in difficult situations.",
      tags: ["Work", "Growth"]
    },
    {
      id: 3,
      date: "July 18, 2023",
      title: "Family Reunion",
      excerpt: "Spent the weekend with family. It's amazing how blockchain ensures these precious memories stay secure forever.",
      tags: ["Family", "Memories"]
    },
    {
      id: 4,
      date: "August 5, 2023",
      title: "Learning New Skills",
      excerpt: "Started learning blockchain development. The decentralized nature of this diary mirrors the tech I'm studying.",
      tags: ["Learning", "Technology"]
    },
    {
      id: 5,
      date: "September 12, 2023",
      title: "Nature Retreat",
      excerpt: "Took a break from screens and spent time in nature. These moments of reflection are invaluable to me.",
      tags: ["Nature", "Mindfulness"]
    },
    {
      id: 6,
      date: "October 30, 2023",
      title: "Achieving Goals",
      excerpt: "Finally reached my fitness goals! This immutable record of my journey motivates me to keep pushing forward.",
      tags: ["Fitness", "Achievement"]
    }
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
          <BlurText text="Sample Entries" />
        </h2>
        <p className="text-xl text-gray-400 text-balance max-w-2xl mx-auto">
          Experience the power of immutable, blockchain-secured diary entries
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {diaryEntries.map((entry) => (
          <motion.div
            key={entry.id}
            variants={itemVariants}
            className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-indigo-400 font-medium">{entry.date}</span>
              <div className="flex space-x-2">
                {entry.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">{entry.title}</h3>
            <p className="text-gray-400 flex-grow">{entry.excerpt}</p>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Entry #{entry.id.toString().padStart(3, '0')}</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-500">Immutable</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}