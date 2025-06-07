import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex items-start space-x-3 mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center"
        >
          <Bot className="h-5 w-5 text-white" />
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
          isBot
            ? 'bg-white border border-gray-200 text-gray-800'
            : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p className={`text-xs mt-2 ${isBot ? 'text-gray-500' : 'text-red-100'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </motion.div>

      {!isBot && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center"
        >
          <User className="h-5 w-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageBubble;