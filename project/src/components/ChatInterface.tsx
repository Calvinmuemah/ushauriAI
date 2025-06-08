import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Paperclip } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date; // Store as string if using JSON.stringify for cleaner parsing later
}

interface ChatInterfaceProps {
  selectedTopic?: string;
  onTopicProcessed: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedTopic, onTopicProcessed }) => {
  // Define a key for local storage
  const LOCAL_STORAGE_KEY = 'kenyaConstitutionChatHistory';

  const [messages, setMessages] = useState<Message[]>(() => {
    // 1. Initialize messages from localStorage when the component mounts
    try {
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMessages) {
        // Parse stored JSON, and ensure timestamps are Date objects again
        const parsedMessages: Message[] = JSON.parse(storedMessages);
        return parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // Convert timestamp string back to Date object
        }));
      }
    } catch (error) {
      console.error("Failed to load chat history from local storage:", error);
      // Fallback to initial message if loading fails
    }
    // Default initial message if no history found or error occurred
    return [
      {
        id: '1',
        text: 'Hello! I\'m your AI assistant for Kenya\'s Constitution. I can help you understand constitutional rights, government structure, legal procedures, and more. What would you like to know?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ];
  });

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

  // 2. Save messages to localStorage whenever the messages state changes
  useEffect(() => {
    try {
      // Convert Date objects to ISO strings before stringifying to JSON
      const serializableMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableMessages));
    } catch (error) {
      console.error("Failed to save chat history to local storage:", error);
    }
  }, [messages]);


  const callBackendAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw error;
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