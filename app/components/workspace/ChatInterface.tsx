'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Bot, Loader2, Paperclip, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

interface ChatInterfaceProps {
  projectId?: string;
  onSaveResource?: (resource: any) => void;
}

export default function ChatInterface({ projectId, onSaveResource }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<{
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
  }[]>([
    {
      id: 'welcome-msg',
      content: 'Hello! How can I assist you with your project today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: `user-msg-${Date.now()}`,
      content: input.trim(),
      role: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulate AI response with a delay
      setTimeout(() => {
        // Sample responses based on input
        let aiResponse = '';
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
          aiResponse = "Hello! How can I help you with your project today?";
        } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
          aiResponse = "I can help you with various tasks like:\n\n- Answering questions about your project\n- Helping you organize your resources\n- Providing suggestions for your work\n- Creating and editing content\n- Summarizing information\n\nJust let me know what you need!";
        } else if (lowerInput.includes('save') || lowerInput.includes('store')) {
          aiResponse = "I can help you save resources to your workspace. You can save:\n\n- Links to websites\n- Notes and ideas\n- Code snippets\n- Document references\n- And more\n\nWould you like me to save something for you now?";
        } else if (lowerInput.includes('code') || lowerInput.includes('javascript') || lowerInput.includes('react')) {
          aiResponse = "Here's a simple React component example:\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div className=\"counter\">\n      <h2>Count: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n      <button onClick={() => setCount(count - 1)}>Decrement</button>\n    </div>\n  );\n}\n\nexport default Counter;\n```\n\nYou can use this component in your React application. Would you like me to explain how it works?";
        } else if (lowerInput.includes('thank')) {
          aiResponse = "You're welcome! If you need any more help with your project, feel free to ask.";
        } else {
          aiResponse = "I understand you're interested in working on this project. Can you tell me more about what you're trying to accomplish? I'm here to help with any questions or tasks you might have.";
        }
        
        // Add AI response
        const assistantMessage = {
          id: `ai-msg-${Date.now()}`,
          content: aiResponse,
          role: 'assistant' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-msg-${Date.now()}`,
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        role: 'assistant' as const,
        timestamp: new Date()
      }]);
      
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Very simple AI settings (can be expanded)
  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    responseStyle: 'balanced'
  });

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onCopy={handleCopyMessage}
            onDelete={message.role === 'user' ? handleDeleteMessage : undefined}
            onFeedback={message.role === 'assistant' ? () => {} : undefined}
          />
        ))}
        
        {isLoading && (
          <div className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  <span className="text-sm text-zinc-400">Ecosyz AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {/* AI Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden bg-zinc-900 rounded-lg border border-zinc-800"
              >
                <div className="p-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">AI Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Model</label>
                      <select 
                        value={aiSettings.model}
                        onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md text-sm py-2 px-3 text-zinc-200"
                      >
                        <option value="gpt-4">GPT-4 (Most Capable)</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                        <option value="claude-2">Claude 2</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Temperature: {aiSettings.temperature}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={aiSettings.temperature}
                        onChange={(e) => setAiSettings({...aiSettings, temperature: parseFloat(e.target.value)})}
                        className="w-full accent-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Response Style</label>
                      <div className="flex gap-2">
                        {['concise', 'balanced', 'detailed'].map((style) => (
                          <button
                            key={style}
                            onClick={() => setAiSettings({...aiSettings, responseStyle: style})}
                            className={`flex-1 py-1.5 text-xs rounded-md ${
                              aiSettings.responseStyle === style
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="relative">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="absolute left-4 top-4 p-1 text-zinc-500 hover:text-zinc-300 rounded-md transition-colors"
              aria-label="AI Settings"
            >
              {showSettings ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <div className="pl-12 pr-14 py-3 bg-zinc-800 rounded-lg shadow-sm border border-zinc-700">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Ecosyz AI..."
                rows={1}
                className="w-full bg-transparent resize-none text-zinc-200 focus:outline-none placeholder-zinc-500 max-h-60"
              />
            </div>
            
            <button
              type="button"
              className="absolute right-14 top-3 p-2 text-zinc-500 hover:text-zinc-300 rounded-md transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-3 p-2 text-emerald-500 hover:text-emerald-400 disabled:text-zinc-600 disabled:hover:text-zinc-600 rounded-md transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <div className="flex justify-center mt-3">
            <div className="text-xs text-zinc-500">
              Ecosyz AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}