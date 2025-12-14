'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Upload, FileText, Calendar, Tag } from 'lucide-react';
import BlurText from '@/components/ui/BlurText';

export default function UploadDiaryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setTitle('');
      setContent('');
      setTags('');
      setIsSuccess(false);
    }, 3000);
  };

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

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            <BlurText text="Upload Your Diary Entry" />
          </h1>
          <p className="text-xl text-gray-400 text-balance max-w-2xl mx-auto">
            Securely store your thoughts on the blockchain with cryptographic guarantees
          </p>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Entry Secured!</h2>
              <p className="text-gray-400 mb-6">
                Your diary entry has been cryptographically secured and stored on the blockchain.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Upload Another Entry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <motion.div variants={itemVariants}>
                  <label htmlFor="title" className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Entry Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's this entry about?"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="date" className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="tags" className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                    <Tag className="w-5 h-5 text-indigo-400" />
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="work, personal, reflection"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="content" className="flex items-center gap-2 text-lg font-medium text-white mb-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Your Entry
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="Share your thoughts, reflections, or experiences..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-400 text-sm">
                      Your entry will be cryptographically secured and stored permanently on the blockchain
                    </span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      isSubmitting 
                        ? 'bg-indigo-700 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Securing Entry...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Secure on Blockchain
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>
          )}
        </motion.div>

        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Immutable Storage</h3>
            <p className="text-gray-400">
              Once recorded, your entry cannot be altered or deleted, ensuring permanent preservation.
            </p>
          </div>
          
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero-Knowledge Privacy</h3>
            <p className="text-gray-400">
              Your entries are encrypted with military-grade security. Only you hold the decryption keys.
            </p>
          </div>
          
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Verifiable Timestamps</h3>
            <p className="text-gray-400">
              Blockchain timestamps provide cryptographic proof of when each entry was created.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}