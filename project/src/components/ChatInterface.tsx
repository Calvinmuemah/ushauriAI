import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Paperclip } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedTopic?: string;
  onTopicProcessed: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedTopic, onTopicProcessed }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for Kenya\'s Constitution. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedTopic) {
      handleSendMessage(selectedTopic);
      onTopicProcessed();
    }
  }, [selectedTopic]);

  // UPDATED: Replace this with your actual backend API call
  const callBackendAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('https://ushauri-ai.vercel.app/api/chat', { // <-- YOUR BACKEND ENDPOINT
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch AI response');
      }

      const data = await response.json();
      return data.response; // Assuming your backend sends { response: "AI's generated text" }
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw error; // Re-throw to be caught by handleSendMessage
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await callBackendAPI(text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 border-t border-gray-200 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Kenya's Constitution..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-red-600 to-green-600 text-white p-3 rounded-2xl hover:from-red-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;