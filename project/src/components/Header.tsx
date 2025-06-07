import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Flag } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-600 via-black to-green-700 text-white p-4 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Scale className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Constitution AI</h1>
            <p className="text-sm opacity-90">Your Guide to Kenya's Constitution</p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
        >
          <Flag className="h-5 w-5" />
          <span className="text-sm font-medium">Kenya</span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;