'use client';

import { Footer } from "@/components/Footer"
import HeroSection from "@/components/Herosection"
import Navbar from "@/components/Navbar"
import FeaturesSection from "@/components/FeaturesSection"
import InfiniteFeatures from "@/components/InfiniteFeatures"
import SampleDiarySection from "@/components/SampleDiarySection"
import StepsScrollStack from "@/components/StepsScrollStack"
import { motion } from 'framer-motion'

export default function Home() {
  const features = [
    { id: 1, title: "Secure Journaling", description: "Military-grade encryption keeps your thoughts private and secure" },
    { id: 2, title: "Forever Storage", description: "Immutable records ensure your entries last forever" },
    { id: 3, title: "Cross-Platform", description: "Access your diary from any device, anywhere" }
  ];

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
    <div className="min-h-screen bg-black">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <HeroSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <InfiniteFeatures />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StepsScrollStack />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SampleDiarySection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
            <FeaturesSection />
          </div>
        </motion.div>
      </motion.div>

      <Footer/>
    </div>
  )
}