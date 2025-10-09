'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Sparkles,
  Code,
  FileText,
  Image,
  Link,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Zap
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../../../src/lib/ui';

// Enhanced Chat Types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'text' | 'code' | 'suggestion' | 'action';
    language?: string;
    confidence?: number;
    sources?: string[];
    actions?: ChatAction[];
  };
  reactions?: {
    thumbsUp?: boolean;
    thumbsDown?: boolean;
  };
}

interface ChatAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'command';
  action: () => void;
  primary?: boolean;
}

interface EnhancedWorkspaceChatProps {
  workspaceId?: string;
  context?: {
    currentPage: string;
    selectedText?: string;
    recentActions?: string[];
  };
  className?: string;
}

export default function EnhancedWorkspaceChat({
  workspaceId,
  context,
  className
}: EnhancedWorkspaceChatProps) {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI assistant for this workspace. I can help you with:

• **Code generation** and debugging
• **Project planning** and task management
• **Resource recommendations**
• **Team collaboration** suggestions
• **Documentation** and explanations

What would you like to work on today?`,
      timestamp: new Date(),
      metadata: {
        type: 'text',
        actions: [
          {
            id: 'help-code',
            label: 'Help with Code',
            type: 'button',
            action: () => handleQuickAction('I need help with coding'),
            primary: false
          },
          {
            id: 'help-project',
            label: 'Project Planning',
            type: 'button',
            action: () => handleQuickAction('Help me plan a project'),
            primary: false
          },
          {
            id: 'help-resources',
            label: 'Find Resources',
            type: 'button',
            action: () => handleQuickAction('Find useful resources'),
            primary: false
          }
        ]
      }
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle quick actions
  const handleQuickAction = (message: string) => {
    setInputValue(message);
    handleSendMessage(message);
  };

  // Send message
  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      generateAIResponse(content.trim());
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  // Generate AI response based on input
  const generateAIResponse = (userInput: string) => {
    const responseId = `assistant-${Date.now()}`;
    let response: ChatMessage;

    // Context-aware responses
    if (userInput.toLowerCase().includes('code') || userInput.toLowerCase().includes('function')) {
      response = {
        id: responseId,
        role: 'assistant',
        content: `Here's a well-structured code example for your request:

\`\`\`${selectedLanguage}
function processUserData(data) {
  // Validate input
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided');
  }

  // Process the data
  const processed = {
    id: data.id,
    name: data.name?.trim(),
    email: data.email?.toLowerCase(),
    createdAt: new Date(data.createdAt),
    isActive: data.status === 'active'
  };

  // Apply business logic
  if (processed.isActive) {
    processed.lastActivity = new Date();
  }

  return processed;
}

// Usage example
const userData = {
  id: 123,
  name: '  John Doe  ',
  email: 'JOHN.DOE@EXAMPLE.COM',
  createdAt: '2024-01-15',
  status: 'active'
};

const result = processUserData(userData);
console.log(result);
\`\`\`

This function includes input validation, data transformation, and business logic. Would you like me to explain any part of it or modify it for your specific needs?`,
        timestamp: new Date(),
        metadata: {
          type: 'code',
          language: selectedLanguage,
          confidence: 92,
          actions: [
            {
              id: 'copy-code',
              label: 'Copy Code',
              type: 'button',
              action: () => navigator.clipboard.writeText('code here'),
              primary: false
            },
            {
              id: 'modify-code',
              label: 'Modify Code',
              type: 'button',
              action: () => handleQuickAction('Please modify this code to...'),
              primary: false
            }
          ]
        }
      };
    } else if (userInput.toLowerCase().includes('project') || userInput.toLowerCase().includes('plan')) {
      response = {
        id: responseId,
        role: 'assistant',
        content: `Great! Let's create a comprehensive project plan. Based on your workspace context, here's a structured approach:

## 📋 Project Planning Framework

### Phase 1: Discovery & Planning (Week 1-2)
- **Requirements Gathering**: Define project scope and objectives
- **Stakeholder Analysis**: Identify key team members and their roles
- **Risk Assessment**: Identify potential challenges and mitigation strategies
- **Timeline Creation**: Set realistic milestones and deadlines

### Phase 2: Development & Execution (Week 3-8)
- **Sprint Planning**: Break down work into manageable 2-week cycles
- **Daily Standups**: Keep team aligned and address blockers quickly
- **Code Reviews**: Maintain quality and knowledge sharing
- **Testing**: Implement comprehensive testing strategies

### Phase 3: Review & Deployment (Week 9-10)
- **Quality Assurance**: Final testing and bug fixes
- **Documentation**: Create user guides and technical documentation
- **Deployment**: Roll out to production with monitoring
- **Post-Mortem**: Review what worked and what to improve

### Key Success Factors:
✅ **Clear Communication**: Regular updates and transparent progress tracking
✅ **Agile Methodology**: Adapt to changes while maintaining structure
✅ **Quality Focus**: Automated testing and code review processes
✅ **Team Collaboration**: Use tools that enhance rather than hinder teamwork

Would you like me to create a specific project plan for your current initiative, or would you prefer to dive deeper into any of these phases?`,
        timestamp: new Date(),
        metadata: {
          type: 'text',
          confidence: 88,
          actions: [
            {
              id: 'create-project',
              label: 'Create Project',
              type: 'link',
              action: () => window.location.href = '/projects/new',
              primary: true
            },
            {
              id: 'view-templates',
              label: 'View Templates',
              type: 'button',
              action: () => console.log('Show project templates'),
              primary: false
            }
          ]
        }
      };
    } else if (userInput.toLowerCase().includes('resource') || userInput.toLowerCase().includes('find')) {
      response = {
        id: responseId,
        role: 'assistant',
        content: `Perfect! I can help you discover valuable resources. Here are some highly-rated recommendations based on your workspace activity:

## 🎯 Recommended Resources

### 📚 **Learning Platforms**
- **MDN Web Docs**: Comprehensive web development documentation
- **freeCodeCamp**: Interactive coding tutorials and certifications
- **Coursera**: University-level courses from top institutions

### 🛠️ **Development Tools**
- **VS Code Extensions**: 
  - ESLint for code quality
  - Prettier for code formatting
  - GitLens for version control
- **Postman**: API testing and documentation
- **Figma**: UI/UX design collaboration

### 📖 **Best Practices**
- **Clean Code by Robert C. Martin**: Essential programming principles
- **The Pragmatic Programmer**: Practical software development advice
- **Refactoring by Martin Fowler**: Code improvement techniques

### 🌐 **Communities**
- **Stack Overflow**: Technical Q&A community
- **Dev.to**: Developer blogging and discussion
- **GitHub**: Open source collaboration

Would you like me to:
- Search for specific resources in your field?
- Recommend tools for your current project?
- Find tutorials for a particular technology?`,
        timestamp: new Date(),
        metadata: {
          type: 'suggestion',
          confidence: 85,
          sources: ['workspace analytics', 'community trends', 'expert recommendations'],
          actions: [
            {
              id: 'browse-resources',
              label: 'Browse Resources',
              type: 'link',
              action: () => window.location.href = '/resources',
              primary: true
            },
            {
              id: 'search-specific',
              label: 'Search Specific',
              type: 'button',
              action: () => handleQuickAction('Find resources about...'),
              primary: false
            }
          ]
        }
      };
    } else {
      // General response
      response = {
        id: responseId,
        role: 'assistant',
        content: `I understand you're looking for help with "${userInput}". Let me provide some tailored assistance.

Based on your current context (${context?.currentPage || 'workspace'}), here are some relevant suggestions:

• **For immediate help**: Check our documentation or community forums
• **For code-related questions**: I can generate examples or explain concepts
• **For project guidance**: I can help with planning, best practices, or methodology
• **For resource discovery**: I can recommend tools, tutorials, or learning materials

Could you provide more details about what you're trying to accomplish? For example:
- What specific problem are you solving?
- What technologies are you working with?
- What's your current goal or deadline?

This will help me give you more targeted and useful assistance!`,
        timestamp: new Date(),
        metadata: {
          type: 'text',
          confidence: 75,
          actions: [
            {
              id: 'provide-details',
              label: 'Provide More Details',
              type: 'button',
              action: () => handleQuickAction('I need help with...'),
              primary: true
            },
            {
              id: 'view-docs',
              label: 'View Documentation',
              type: 'link',
              action: () => window.location.href = '/docs',
              primary: false
            }
          ]
        }
      };
    }

    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  // Handle message reactions
  const handleReaction = (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              [reaction]: !msg.reactions?.[reaction]
            }
          }
        : msg
    ));
  };

  // Copy message content
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add toast notification here
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // In a real app, implement speech recognition
      setTimeout(() => {
        setIsListening(false);
        setInputValue("How can I improve my code quality?");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  // Handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Render message content
  const renderMessageContent = (message: ChatMessage) => {
    if (message.metadata?.type === 'code' && message.content.includes('```')) {
      const parts = message.content.split('```');
      return (
        <div className="space-y-3">
          {parts.map((part, index) => {
            if (index % 2 === 0) {
              // Regular text
              return part.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="text-sm text-zinc-300 leading-relaxed">
                  {line}
                </p>
              ));
            } else {
              // Code block
              const code = part.trim();
              const language = message.metadata?.language || 'javascript';
              return (
                <div key={index} className="relative">
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    className="rounded-lg !bg-zinc-900 !p-4 !text-sm"
                    showLineNumbers={code.split('\n').length > 5}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => copyMessage(code)}
                    className="absolute top-2 right-2 w-6 h-6 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              );
            }
          })}
        </div>
      );
    }

    return (
      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">AI Assistant</h3>
              <p className="text-xs text-zinc-400">
                {isTyping ? 'Typing...' : 'Ready to help'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTextToSpeech('AI assistant is ready to help')}
              className={cn(
                "w-6 h-6 rounded text-zinc-400 hover:text-zinc-300 transition-colors",
                isSpeaking && "text-emerald-400"
              )}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button className="w-6 h-6 text-zinc-400 hover:text-zinc-300 rounded">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex space-x-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={cn(
                "max-w-[80%] rounded-lg px-4 py-3",
                message.role === 'user'
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 border border-zinc-700"
              )}>
                {renderMessageContent(message)}

                {/* Message Actions */}
                {message.metadata?.actions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.metadata.actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className={cn(
                          "px-3 py-1 text-xs rounded-md transition-colors",
                          action.primary
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Footer */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-700/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-zinc-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {message.metadata?.confidence && (
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-zinc-500" />
                        <span className="text-xs text-zinc-500">
                          {message.metadata.confidence}%
                        </span>
                      </div>
                    )}
                  </div>

                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleReaction(message.id, 'thumbsUp')}
                        className={cn(
                          "w-6 h-6 rounded text-zinc-500 hover:text-zinc-400 transition-colors",
                          message.reactions?.thumbsUp && "text-emerald-400"
                        )}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleReaction(message.id, 'thumbsDown')}
                        className={cn(
                          "w-6 h-6 rounded text-zinc-500 hover:text-zinc-400 transition-colors",
                          message.reactions?.thumbsDown && "text-red-400"
                        )}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="w-6 h-6 rounded text-zinc-500 hover:text-zinc-400 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-3"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-zinc-500 ml-2">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask me anything about your workspace..."
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none min-h-[44px] max-h-32"
              rows={1}
            />
          </div>

          <button
            onClick={handleVoiceInput}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isListening
                ? "bg-red-600 text-white"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Context Info */}
        {context?.selectedText && (
          <div className="mt-2 flex items-center space-x-2 text-xs text-zinc-500">
            <Sparkles className="w-3 h-3" />
            <span>Context: Selected text available</span>
          </div>
        )}
      </div>
    </div>
  );
}