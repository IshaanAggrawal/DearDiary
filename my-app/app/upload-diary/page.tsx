'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Upload, FileText, Calendar, Tag, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import BlurText from '@/components/ui/BlurText';
import { useAccount, useWriteContract, useConnect, useSignMessage } from 'wagmi';
import { uploadToIPFS } from '@/utils/pinata';
import { injected } from 'wagmi/connectors';
import { generateKey, encryptData } from '@/utils/encryption';

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
  const { signMessageAsync } = useSignMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return alert("Diary entry cannot be empty!");
    
    setIsSubmitting(true);
    setStatus("1/4: Requesting Encryption Signature...");
    
    try {
      const signature = await signMessageAsync({ 
        message: "Sign this message to generate your secure encryption key for DearDiary." 
      });
      
      setStatus("2/4: Encrypting & Uploading...");
      const secretKey = generateKey(signature);
      const diaryPayload = {
        title,
        content,
        tags,
        timestamp: new Date().toISOString()
      };
      
      const encryptedContent = encryptData(diaryPayload, secretKey);
      const ipfsHash = await uploadToIPFS({
        encrypted: true, 
        ciphertext: encryptedContent 
      });
      
      setStatus("3/4: Saving to Blockchain...");

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addEntry',
        args: [ipfsHash],
      });

      setStatus("4/4: Success! Entry Secured.");
      console.log("Tx Hash:", txHash);
      
      setIsSuccess(true);
      setTimeout(() => {
        setTitle('');
        setTags('');
        setContent('');
        setIsSuccess(false);
        setStatus("");
      }, 3000);

    } catch (error: any) {
      console.error("Submission Error:", error);
      setStatus("Error: " + (error.message || "Transaction failed"));
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/50"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/10 shadow-inner">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Access Restricted</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
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

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 relative">
       <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full lg:w-4/5 mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <BlurText text="New Diary Entry" />
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Securely store your thoughts on the blockchain</p>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isSuccess ? (
            <div className="text-center py-12 sm:py-16 w-full px-4">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Entry Secured!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base w-full">
                Your entry has been hashed, uploaded to IPFS, and permanently linked to your address on the blockchain.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-sm sm:text-base w-full max-w-xs mx-auto"
              >
                Write Another Entry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full">
                <motion.div variants={itemVariants} className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-indigo-300 mb-2">Entry Title</label>
                  <div className="relative group w-full">
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

                <motion.div variants={itemVariants} className="w-full">
                   <label className="block text-xs sm:text-sm font-medium text-indigo-300 mb-2">Date</label>
                   <div className="relative group w-full">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="w-full">
                <label className="block text-xs sm:text-sm font-medium text-indigo-300 mb-2">Tags</label>
                <div className="relative group w-full">
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

              <motion.div variants={itemVariants} className="w-full">
                <label className="block text-xs sm:text-sm font-medium text-indigo-300 mb-2">Your Story</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="What's on your mind today?"
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2 w-full">
                
                {status && (
                  <div className="mb-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-indigo-300 bg-indigo-500/10 py-2 rounded-lg border border-indigo-500/20 w-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {status}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg 
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
                
                <p className="text-center mt-4 text-xs text-gray-500 flex items-center justify-center gap-1 w-full">
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