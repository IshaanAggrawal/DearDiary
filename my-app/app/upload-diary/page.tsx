'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Upload, FileText, Calendar, Tag, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import BlurText from '@/components/ui/BlurText';
import { useAccount, useWriteContract } from 'wagmi';
import { uploadToIPFS } from '@/utils/pinata';
import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DIARY_CONTRACT as `0x${string}`;
const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_ipfsHash", "type": "string" }],
    "name": "addEntry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function UploadDiaryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { writeContractAsync } = useWriteContract();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState("");

const handleSubmit = async (e: React.FormEvent) => {    //heart of this page
    e.preventDefault();
    if (!content) return alert("Diary entry cannot be empty!");
    
    setIsSubmitting(true);
    setStatus("1/3: Encrypting & Uploading to IPFS...");
    
    try {
      const ipfsHash = await uploadToIPFS({
        title, 
        text: content,
        tags,  
        timestamp: new Date().toISOString()
      });
      
      setStatus("2/3: Waiting for Wallet Signature...");
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addEntry',
        args: [ipfsHash],
      });
      setStatus("3/3: Success! Verifying...");
      console.log("Tx Hash:", txHash);
      setContent("");
      
      setIsSuccess(true);
      setTimeout(() => {
        setTitle('');
        setTags('');
        setIsSuccess(false);
        setStatus("");
      }, 3000);

    } catch (error: any) {
      console.error("Submission Error:", error);
      if (error.code === 4001 || error.message.includes("User rejected") || error.message.includes("denied account access")) {
        setStatus("Transaction cancelled by user.");
      } else {
        setStatus("Error: " + (error.message || "Transaction failed"));
      }
      

    } finally {
      setIsSubmitting(false); 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl shadow-black/50"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
            <Lock className="w-10 h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">Access Restricted</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your diary is encrypted and stored on the decentralized web. Please connect your wallet to verify your identity and access the writer.
          </p>

          <button
            onClick={() => connect({ connector: injected() })}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  // --- MAIN UPLOAD UI ---
  return (
    <div className="min-h-screen bg-black py-24 relative">
       {/* Subtle Background Glow */}
       <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <BlurText text="New Diary Entry" />
          </h1>
          <p className="text-gray-400">Securely store your thoughts on the blockchain</p>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isSuccess ? (
            <div className="text-center py-16">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Entry Secured!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Your entry has been hashed, uploaded to IPFS, and permanently linked to your address on the blockchain.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Write Another Entry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Title & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">Entry Title</label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title of your memory..."
                      className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                   <label className="block text-sm font-medium text-indigo-300 mb-2">Date</label>
                   <div className="relative group">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Row 2: Tags */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-indigo-300 mb-2">Tags</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. #personal, #learning, #web3"
                    className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </motion.div>

              {/* Row 3: Content */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-indigo-300 mb-2">Your Story</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="What's on your mind today?"
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
                  required
                />
              </motion.div>

              {/* Footer: Status & Button */}
              <motion.div variants={itemVariants} className="pt-2">
                
                {/* Status Indicator */}
                {status && (
                  <div className="mb-4 flex items-center justify-center gap-2 text-sm font-mono text-indigo-300 bg-indigo-500/10 py-2 rounded-lg border border-indigo-500/20">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {status}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg 
                    ${isSubmitting 
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-white/5' 
                      : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 text-white border border-indigo-400/20'
                    }`}
                >
                  {isSubmitting ? 'Processing Entry...' : (
                    <>
                      <Upload className="w-5 h-5" />
                      Cryptographically Secure Entry
                    </>
                  )}
                </button>
                
                <p className="text-center mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Entries are immutable and stored permanently on Sepolia
                </p>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}