'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useReadContract, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Calendar, Tag, Lock, Loader2, BookOpen, Wallet, ShieldCheck } from 'lucide-react';
import BlurText from '@/components/ui/BlurText';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DIARY_CONTRACT as `0x${string}`;
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getMyEntries",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct DiaryRegistry.Entry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface DiaryEntry {
  hash: string;
  blockTime: number;
  title: string;
  content: string;
  tags: string;
  date: string;
}

export default function DiaryEntriesPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [hydratedEntries, setHydratedEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: rawEntries, isLoading: isContractLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMyEntries',
    account: address,
    query: {
        enabled: !!address,
    }
  });

  useEffect(() => {
    if (rawEntries && (rawEntries as any[]).length > 0) {
      const fetchIPFSContent = async () => {
        setLoading(true);
        try {
          const reversedRaw = [...(rawEntries as any[])].reverse();
          const results = await Promise.all(
            reversedRaw.map(async (entry) => {
              try {
                const response = await fetch(`https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`);
                const meta = await response.json();
                return {
                  hash: entry.ipfsHash,
                  blockTime: Number(entry.timestamp),
                  title: meta.title || "Untitled Entry",
                  content: meta.text || "No content",
                  tags: meta.tags || "",
                  date: meta.timestamp || new Date().toISOString()
                };
              } catch (err) {
                return null; 
              }
            })
          );
          setHydratedEntries(results.filter(e => e !== null) as DiaryEntry[]);
        } catch (error) {
          console.error("Error fetching diary data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIPFSContent();
    }
  }, [rawEntries]); 

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* 1. Background Atmosphere */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

        {/* 2. Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl shadow-black/50"
        >
          {/* Icon Glow */}
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Lock className="w-10 h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">Timeline Locked</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your personal history is encrypted on the blockchain. We need your wallet signature to verify ownership and decrypt your entries.
          </p>

          <button
            onClick={() => connect({ connector: injected() })}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            Connect & Decrypt
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero-Knowledge Privacy • End-to-End Encryption</span>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black py-24 px-6 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <BlurText text="Your Timeline" />
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {hydratedEntries.length} Entries secured on Sepolia Network
          </p>
        </div>

        {/* LOADING STATE */}
        {(isContractLoading || loading) && (
          <div className="flex flex-col items-center justify-center py-32 text-indigo-400">
            <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Lock className="w-6 h-6 text-indigo-400" />
                </div>
            </div>
            <p className="text-lg font-medium animate-pulse">Decrypting from IPFS...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && hydratedEntries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center max-w-2xl mx-auto backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <BookOpen className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Memories Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Your decentralized timeline is empty. Create your first immutable memory on the blockchain today.
            </p>
            <a href="/upload-diary" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all">
                Write First Entry
            </a>
          </motion.div>
        )}

        {/* DIARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hydratedEntries.map((entry, index) => (
            <DiaryCard key={entry.hash} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DiaryCard({ entry, index }: { entry: DiaryEntry; index: number }) {
  const dateObj = new Date(entry.date);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
          <Calendar className="w-3 h-3" />
          {dateObj.toLocaleDateString()}
        </div>
        <div title="Immutable on IPFS" className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      </div>

      <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-300 transition-colors">
        {entry.title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4 flex-grow">
        {entry.content}
      </p>

      <div className="pt-4 border-t border-white/5 mt-auto">
        <div className="flex flex-wrap gap-2 mb-3">
          {entry.tags.split(',').map((tag, i) => (
            tag.trim() && (
              <span key={i} className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                <Tag className="w-3 h-3" /> {tag.trim()}
              </span>
            )
          ))}
        </div>
        
        <div className="text-[10px] text-gray-600 font-mono truncate hover:text-indigo-400 cursor-copy transition-colors flex items-center gap-1">
            <Lock className="w-3 h-3" />
            CID: {entry.hash.slice(0, 12)}...
        </div>
      </div>
    </motion.div>
  );
}