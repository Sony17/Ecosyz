'use client';

import React, { useState } from 'react';
import { Menu, X, Sidebar, MessageSquare, Settings, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '../../../src/lib/ui';

interface MobileNavigationProps {
  onOpenSidebar: () => void;
  onOpenChat: () => void;
  activeView: 'sidebar' | 'chat' | null;
}

export default function MobileNavigation({
  onOpenSidebar,
  onOpenChat,
  activeView
}: MobileNavigationProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-40">
      <div className="flex justify-around items-center h-14">
        <button 
          className={cn(
            "flex flex-col items-center justify-center w-16 h-full",
            activeView === 'sidebar' ? "text-emerald-400" : "text-zinc-400"
          )}
          onClick={onOpenSidebar}
          aria-label="Open workspace sidebar"
        >
          <Sidebar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Workspaces</span>
        </button>
        
        <button 
          className={cn(
            "flex flex-col items-center justify-center w-16 h-full", 
            activeView === 'chat' ? "text-emerald-400" : "text-zinc-400"
          )}
          onClick={onOpenChat}
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1">Chat</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center w-16 h-full text-zinc-400 relative"
          onClick={() => setShowUserMenu(!showUserMenu)}
          aria-label="User menu"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Account</span>
          
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-1 min-w-[160px]"
              >
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-zinc-700 rounded-md w-full text-left">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-zinc-700 rounded-md w-full text-left">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </Link>
                <hr className="my-1 border-zinc-700" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}