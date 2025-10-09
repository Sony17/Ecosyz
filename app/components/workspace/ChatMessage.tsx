'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Copy, 
  CheckCheck,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
  };
  onCopy?: (content: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFeedback?: (id: string, type: 'like' | 'dislike') => void;
}

export default function ChatMessage({ 
  message,
  onCopy,
  onEdit,
  onDelete,
  onFeedback
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className={`py-6 ${message.role === 'assistant' ? 'bg-zinc-900/30' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!showMenu) {
          setShowActions(false);
        }
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-4">
        <div className="flex-shrink-0">
          {message.role === 'user' ? (
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200">
              U
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {message.role === 'user' ? 'You' : 'Ecosyz AI'}
            </div>
            <div className="text-xs text-zinc-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  // Check if this is a code block (has language) vs inline code
                  const isCodeBlock = match && className?.includes('language-');
                  return isCodeBlock ? (
                    <div className="relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                          }}
                          className="p-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
                          title="Copy code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={match[1]}
                        customStyle={{
                          borderRadius: '0.375rem',
                          padding: '1rem',
                          backgroundColor: '#18181b',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-4 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 mb-4">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 mb-4">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold mb-4 mt-6">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-bold mb-3 mt-5">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-md font-bold mb-2 mt-4">{children}</h3>;
                },
                blockquote({ children }) {
                  return <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 italic text-zinc-400">{children}</blockquote>;
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto mb-4">
                      <table className="border-collapse border border-zinc-700 w-full">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-zinc-800">{children}</thead>;
                },
                tbody({ children }) {
                  return <tbody>{children}</tbody>;
                },
                tr({ children }) {
                  return <tr className="border-b border-zinc-700">{children}</tr>;
                },
                th({ children }) {
                  return <th className="border border-zinc-700 px-4 py-2 text-left">{children}</th>;
                },
                td({ children }) {
                  return <td className="border border-zinc-700 px-4 py-2">{children}</td>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Actions */}
        {message.role === 'assistant' && (
          <div className="flex-shrink-0 relative">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: showActions ? 1 : 0 }}
              className="flex items-center gap-2 transition-opacity"
            >
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
                title="Copy message"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-500" />}
              </button>
              
              {onFeedback && (
                <>
                  <button
                    onClick={() => onFeedback(message.id, 'like')}
                    className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
                    title="Good response"
                  >
                    <ThumbsUp className="w-4 h-4 text-zinc-500 hover:text-emerald-500" />
                  </button>
                  
                  <button
                    onClick={() => onFeedback(message.id, 'dislike')}
                    className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
                    title="Bad response"
                  >
                    <ThumbsDown className="w-4 h-4 text-zinc-500 hover:text-red-500" />
                  </button>
                </>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                </button>
                
                {showMenu && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 top-8 bg-zinc-800 rounded-md shadow-lg py-1 z-10 w-36"
                  >
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(message.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 w-full text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                    
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(message.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 w-full text-left text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}