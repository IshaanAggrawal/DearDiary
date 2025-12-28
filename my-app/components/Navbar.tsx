"use client"
import type React from "react"
import { Lock, LogOut, Menu, PlusCircle, BookOpen } from "lucide-react"
import useScrollPosition from "../hooks/useScrollPosition"
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from "react"

const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  const isScrolled = useScrollPosition(80)

  const baseClasses = `
    fixed top-0 left-1/2 transform -translate-x-1/2 z-50 
    transition-all duration-300 ease-in-out
    bg-black/40
    backdrop-blur-2xl backdrop-saturate-150
    border border-white/10
    shadow-2xl shadow-black/50
  `

  const scrollDependentClasses = isScrolled
    ? `w-[95%] md:w-[90%] lg:max-w-7xl h-16 mt-4 rounded-2xl`
    : `w-full h-20 mt-0 rounded-none`

  const buttonClasses = isScrolled ? "px-4 py-1.5 text-sm" : "px-6 py-2 text-base"

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav 
      className={`${baseClasses} ${scrollDependentClasses}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between h-full px-6 md:px-10">
        <Link href="/" className={`flex items-center gap-2 font-bold transition-all duration-300 ${isScrolled ? "text-xl" : "text-2xl"} text-white`}>
          <div className="w-8 h-8 text-gradient rounded-lg flex items-center justify-center">
            <span className="text-yellow-500 font-bold text-sm">
              <Lock />
            </span>
          </div>
          <span className="hidden sm:block">DearDiary</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/diarylist"
            className={`
              flex items-center gap-2
              bg-purple-600 hover:bg-purple-500
              text-white font-semibold rounded-lg
              shadow-lg shadow-purple-500/30 hover:shadow-purple-400/50
              transition-all duration-300 
              ${buttonClasses}
            `}
          >
            <BookOpen className="w-4 h-4" />
            My Diaries
          </Link>
          
          <Link 
            href="/upload-diary"
            className={`
              flex items-center gap-2
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold rounded-lg
              shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50
              transition-all duration-300 
              ${buttonClasses}
            `}
          >
            <PlusCircle className="w-4 h-4" />
            Upload Entry
          </Link>
          
          {mounted && isConnected ? (
           <button
           onClick={() => disconnect()}
           className={`
             group flex items-center gap-2
             bg-gray-800 hover:bg-red-500/90
             text-gray-200 hover:text-white font-mono font-semibold rounded-lg
             border border-white/10 hover:border-red-500/50
             shadow-lg shadow-black/20 hover:shadow-red-500/20
             transition-all duration-300 
             ${buttonClasses}
           `}
         >
           {/* Show Address by default, show "Disconnect" on hover */}
           <span className="block group-hover:hidden">
              {formatAddress(address)}
           </span>
           <span className="hidden group-hover:flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Disconnect
           </span>
         </button>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            className={`
              bg-emerald-500 hover:bg-emerald-400
              text-white font-semibold rounded-lg
              shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50
              transition-all duration-300 
              ${buttonClasses}
            `}
          >
            Connect Wallet
          </button>
        )}
        </div>
        
        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/60 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                href="/diarylist"
                className={`
                  flex items-center justify-center gap-2
                  bg-purple-600 hover:bg-purple-500
                  text-white font-semibold rounded-lg
                  shadow-lg shadow-purple-500/30 hover:shadow-purple-400/50
                  transition-all duration-300 
                  px-6 py-3
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                My Diaries
              </Link>
              
              <Link 
                href="/upload-diary"
                className={`
                  flex items-center justify-center gap-2
                  bg-indigo-600 hover:bg-indigo-500
                  text-white font-semibold rounded-lg
                  shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50
                  transition-all duration-300 
                  px-6 py-3
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusCircle className="w-4 h-4" />
                Upload Entry
              </Link>
              
              {mounted && isConnected ? (
               <button
               onClick={() => {
                 disconnect();
                 setIsMobileMenuOpen(false);
               }}
               className={`
                 group flex items-center justify-center gap-2
                 bg-gray-800 hover:bg-red-500/90
                 text-gray-200 hover:text-white font-mono font-semibold rounded-lg
                 border border-white/10 hover:border-red-500/50
                 shadow-lg shadow-black/20 hover:shadow-red-500/20
                 transition-all duration-300 
                 px-6 py-3
               `}
             >
               <LogOut className="w-4 h-4" />
               Disconnect ({formatAddress(address)})
             </button>
            ) : (
              <button
                onClick={() => {
                  connect({ connector: injected() });
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  bg-emerald-500 hover:bg-emerald-400
                  text-white font-semibold rounded-lg
                  shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50
                  transition-all duration-300 
                  px-6 py-3
                `}
              >
                Connect Wallet
              </button>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar;