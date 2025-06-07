import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Gavel, Shield, Vote, FileText } from 'lucide-react';

interface SidebarProps {
  onTopicSelect: (topic: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTopicSelect }) => {
  const topics = [
    { icon: BookOpen, title: 'Bill of Rights', query: 'Tell me about the Bill of Rights in Kenya\'s Constitution' },
    { icon: Users, title: 'Citizenship', query: 'What are the requirements for Kenyan citizenship?' },
    { icon: Gavel, title: 'Judiciary', query: 'How does the judicial system work in Kenya?' },
    { icon: Shield, title: 'National Security', query: 'What does the Constitution say about national security?' },
    { icon: Vote, title: 'Elections', query: 'What are the constitutional requirements for elections?' },
    { icon: FileText, title: 'Constitutional Amendments', query: 'How can the Constitution be amended?' },
  ];

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-80 bg-white border-r border-gray-200 h-full flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Popular Topics</h2>
        <p className="text-sm text-gray-600">Click on any topic to get started</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {topics.map((topic, index) => (
          <motion.button
            key={topic.title}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTopicSelect(topic.query)}
            className="w-full p-4 text-left bg-gray-50 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <topic.icon className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              <span className="font-medium text-gray-800 group-hover:text-gray-900">{topic.title}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
          <div className="w-3 h-2 bg-black rounded-sm"></div>
          <div className="w-3 h-2 bg-red-600 rounded-sm"></div>
          <div className="w-3 h-2 bg-green-700 rounded-sm"></div>
          <span className="ml-2">Republic of Kenya</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;