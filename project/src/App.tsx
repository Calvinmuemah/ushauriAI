import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleTopicProcessed = () => {
    setSelectedTopic('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-20 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="space-y-1">
              <div className="w-4 h-0.5 bg-gray-600"></div>
              <div className="w-4 h-0.5 bg-gray-600"></div>
              <div className="w-4 h-0.5 bg-gray-600"></div>
            </div>
          </motion.button>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: isSidebarOpen ? 0 : -320,
            opacity: isSidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:block absolute lg:relative z-40 h-full`}
        >
          <Sidebar onTopicSelect={handleTopicSelect} />
        </motion.div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface 
            selectedTopic={selectedTopic} 
            onTopicProcessed={handleTopicProcessed}
          />
        </div>
      </div>
    </div>
  );
}

export default App;