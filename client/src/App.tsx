import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Scale, BookOpen, Users, Shield, Loader2 } from 'lucide-react';
import './App.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickActions = [
  { icon: Scale, text: "Bill of Rights", topic: "Tell me about the Bill of Rights in Kenya's Constitution" },
  { icon: Users, text: "Citizenship", topic: "What are the requirements for Kenyan citizenship?" },
  { icon: Shield, text: "Government Structure", topic: "Explain Kenya's government structure" },
  { icon: BookOpen, text: "Constitutional History", topic: "What is the history of Kenya's Constitution?" }
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Jambo! I'm your AI assistant for Kenya's Constitution. I'm here to help you understand your rights, government structure, and constitutional provisions. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Simple response logic for demo purposes
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bill of rights') || lowerMessage.includes('rights')) {
      return "The Bill of Rights is enshrined in Chapter Four of Kenya's Constitution (2010). It includes fundamental rights such as the right to life, human dignity, freedom of expression, association, and assembly. It also guarantees economic and social rights like healthcare, education, and housing. These rights apply to all persons in Kenya and bind the State and all persons.";
    }
    
    if (lowerMessage.includes('citizenship')) {
      return "Kenyan citizenship is acquired by birth (if born in Kenya and at least one parent is Kenyan), by descent (if born outside Kenya to Kenyan parents), or by registration. The Constitution prohibits dual citizenship for adults, but allows it for children under 21. Chapter Three (Articles 10-19) details citizenship provisions.";
    }
    
    if (lowerMessage.includes('government') || lowerMessage.includes('structure')) {
      return "Kenya operates under a devolved system with two levels of government: National and County. The National Government has three arms: Executive (President, Deputy President, Cabinet), Legislature (Parliament - National Assembly and Senate), and Judiciary (Courts). There are 47 County Governments led by Governors.";
    }
    
    if (lowerMessage.includes('history') || lowerMessage.includes('2010')) {
      return "Kenya's current Constitution was promulgated in 2010, replacing the 1969 Constitution. It was approved by 67% of voters in a referendum on August 4, 2010. The new Constitution introduced devolution, strengthened the Bill of Rights, created new institutions like the Senate, and established principles of good governance and integrity.";
    }
    
    return "Thank you for your question about Kenya's Constitution. While I strive to provide accurate information, I recommend consulting official sources like the Kenya Law website or legal professionals for specific legal advice. Could you please rephrase your question or ask about specific constitutional topics like rights, government structure, or citizenship?";
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await simulateAIResponse(textToSend);
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="d-flex align-items-center">
            <motion.div 
              className="header-icon me-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Scale size={32} />
            </motion.div>
            <div>
              <h1 className="header-title mb-0">Kenya Constitution AI</h1>
              <p className="header-subtitle mb-0">Your Constitutional Rights Assistant</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Chat Container */}
      <div className="container-fluid flex-grow-1 d-flex flex-column">
        <div className="row h-100">
          <div className="col-12">
            <div className="chat-container">
              
              {/* Quick Actions */}
              <motion.div 
                className="quick-actions mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="row g-2">
                  {quickActions.map((action, index) => (
                    <div key={index} className="col-6 col-md-3">
                      <motion.button
                        className="quick-action-btn"
                        onClick={() => handleSendMessage(action.topic)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <action.icon size={20} className="me-2" />
                        {action.text}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Messages */}
              <div className="messages-container">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`message-wrapper ${message.isUser ? 'user' : 'ai'}`}
                    >
                      <div className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                        {!message.isUser && (
                          <div className="message-avatar">
                            <MessageCircle size={16} />
                          </div>
                        )}
                        <div className="message-content">
                          <p className="message-text mb-1">{message.text}</p>
                          <small className="message-time">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="message-wrapper ai"
                    >
                      <div className="message ai-message">
                        <div className="message-avatar">
                          <MessageCircle size={16} />
                        </div>
                        <div className="message-content">
                          <div className="typing-indicator">
                            <Loader2 className="spinner" size={16} />
                            <span className="ms-2">Assistant is typing...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <motion.div 
                className="input-container"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="input-group">
                  <textarea
                    className="form-control message-input"
                    placeholder="Ask me about Kenya's Constitution..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                    rows={1}
                  />
                  <motion.button
                    className="btn send-btn"
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;