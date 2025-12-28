'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useReadContract, useConnect, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Calendar, Tag, Lock, BookOpen, Wallet, ShieldCheck, Unlock, Loader2 } from 'lucide-react';
import BlurText from '@/components/ui/BlurText';
import { generateKey, decryptData } from '@/utils/encryption';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DIARY_CONTRACT as `0x${string}`;

// --- FIX: UPDATED ABI TO MATCH CONTRACT ("getMyDiaries") ---
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getMyDiaries", // <--- CHANGED FROM getMyEntries to getMyDiaries
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct DiaryRegistry.DiaryEntry[]",
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
  isEncrypted: boolean;
  isLocked?: boolean;
}

export default function DiaryEntriesPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { signMessageAsync } = useSignMessage();
  
  const [hydratedEntries, setHydratedEntries] = useState<DiaryEntry[]>([]);
  const [isDecrypted, setIsDecrypted] = useState(false); 
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { data: rawEntries, isLoading: isContractLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMyDiaries', // <--- UPDATED FUNCTION NAME HERE TOO
    account: address,
    query: {
        enabled: !!address,
    }
  });

  // 1. Ask user to sign to generate the decryption key
  const handleUnlock = async () => {
    try {
      const signature = await signMessageAsync({ 
        message: "Sign this message to generate your secure encryption key for DearDiary." 
      });
      const key = generateKey(signature);
      setDecryptionKey(key);
      setIsDecrypted(true);
    } catch (err) {
      console.error("User declined signature", err);
    }
  };

  // 2. Fetch & Decrypt logic
  useEffect(() => {
    if (rawEntries && (rawEntries as any[]).length > 0 && isDecrypted && decryptionKey) {
      const fetchIPFSContent = async () => {
        setLoading(true);
        setStatus("Decrypting Timeline...");
        try {
          // Create a copy to reverse (newest first)
          const reversedRaw = [...(rawEntries as any[])].reverse();
          
          const results = await Promise.all(
            reversedRaw.map(async (entry) => {
              try {
                const response = await fetch(`https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`);
                
                if (!response.ok) throw new Error("IPFS Fetch Failed");
                
                const meta = await response.json();
                
                let finalData = { title: "", content: "", tags: "", timestamp: "" };
                let isEncrypted = false;
                let isLocked = false;

                // CHECK: Is this a new Encrypted entry?
                if (meta.encrypted && meta.ciphertext) {
                  isEncrypted = true;
                  const decrypted = decryptData(meta.ciphertext, decryptionKey);
                  
                  if (decrypted) {
                    finalData = decrypted;
                  } else {
                    isLocked = true;
                    finalData = { 
                      title: "Encrypted Entry", 
                      content: "Unable to decrypt. Did you use a different wallet?", 
                      tags: "locked", 
                      timestamp: new Date().toISOString() 
                    };
                  }
                } else {
                  // OLD ENTRY (Legacy Support)
                  finalData = {
                    title: meta.title || "Untitled",
                    content: meta.text || meta.content || "No Content",
                    tags: meta.tags || "",
                    timestamp: meta.timestamp || new Date().toISOString()
                  };
                }

                return {
                  hash: entry.ipfsHash,
                  blockTime: Number(entry.timestamp),
                  title: finalData.title,
                  content: finalData.content,
                  tags: finalData.tags,
                  date: finalData.timestamp,
                  isEncrypted,
                  isLocked
                };
              } catch (err) {
                console.error("Failed to fetch/parse IPFS:", err);
                return null; 
              }
            })
          );
          setHydratedEntries(results.filter(e => e !== null) as DiaryEntry[]);
        } catch (error) {
          console.error("Error fetching diary data:", error);
        } finally {
          setLoading(false);
          setStatus("");
        }
      };
      fetchIPFSContent();
    }
  }, [rawEntries, isDecrypted, decryptionKey]); 

  // -- RENDER STATES --

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/50"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Timeline Locked</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            Your personal history is encrypted on the blockchain. Connect your wallet to access.
          </p>

          <button
            onClick={() => connect({ connector: injected() })}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  // 2. Connected, But Locked (Needs Signature)
  if (isConnected && !isDecrypted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-xl"
        >
            <BlurText text="Encrypted Vault" className="text-3xl font-bold text-white"/>
            <p className="text-gray-400">
                Your entries are encrypted. We need your signature to generate the decryption key.
            </p>
            <button
                onClick={handleUnlock}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
                <Unlock className="w-5 h-5" />
                Unlock Memories
            </button>
        </motion.div>
      </div>
    );
  }

  // 3. Unlocked & Viewing Diaries
  return (
    <div className="min-h-screen bg-black py-12 sm:py-24 px-4 sm:px-6 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <BlurText text="Your Timeline" />
          </h1>
          <p className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {hydratedEntries.length} Entries secured on Sepolia Network
          </p>
        </div>

        {(isContractLoading || loading) && (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-indigo-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-base sm:text-lg font-medium animate-pulse">
                {status || "Loading from Blockchain..."}
            </p>
          </div>
        )}

        {!loading && hydratedEntries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center max-w-2xl mx-auto backdrop-blur-sm"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-white/5">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Memories Found</h3>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Your decentralized timeline is empty. Create your first immutable memory on the blockchain today.
            </p>
            <a href="/upload-diary" className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-sm sm:text-base">
                Write First Entry
            </a>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      className={`group relative bg-white/5 hover:bg-white/10 border ${entry.isLocked ? 'border-red-500/20' : 'border-white/10'} rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
          <Calendar className="w-3 h-3" />
          {dateObj.toLocaleDateString()}
        </div>
        
        {entry.isEncrypted ? (
           <div title="End-to-End Encrypted" className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
        ) : (
           <div title="Public IPFS Entry" className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 line-clamp-1 group-hover:text-indigo-300 transition-colors">
        {entry.title}
      </h3>

      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-4 flex-grow">
        {entry.content}
      </p>

      <div className="pt-3 sm:pt-4 border-t border-white/5 mt-auto">
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
          {entry.tags.split(',').map((tag, i) => (
            tag.trim() && (
              <span key={i} className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                <Tag className="w-3 h-3" /> {tag.trim()}
              </span>
            )
          ))}
        </div>
        
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-gray-600 font-mono">
            <span>CID: {entry.hash.slice(0, 8)}...</span>
            {entry.isEncrypted && <Lock className="w-3 h-3 text-indigo-400" />}
        </div>
      </div>
    </motion.div>
  );
}