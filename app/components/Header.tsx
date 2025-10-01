'use client';

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "./ui/Container";
import { toast } from "sonner";

// Central nav definition
const NAV_LINKS = [
  { href: "/openresources", label: "Resources" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/pricing", label: "Pricing" },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string; avatarUrl?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check auth status and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserData(data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    setMounted(true);
    checkAuth();
  }, []);
  
  // Close mobile nav on route change
  useEffect(() => { 
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('Signed out successfully');
        setIsAuthenticated(false);
        setUserData(null);
        setDropdownOpen(false);
        router.push('/');
      } else {
        toast.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Keyboard handler for user dropdown accessibility
  function onDropdownKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setDropdownOpen(o => !o);
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  }

  // Derive active route for highlighting
  const activeRoot = pathname === "/" ? "/" : `/${pathname.split('/')[1]}`;

  return (
    <header className="sticky top-0 z-[99] glass h-14 border-b glass-border">
      <Container>
        <div className="h-14 flex justify-between items-center gap-4 w-full">
          {/* Brand left */}
          <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
            <Image src="/eco.png" alt="Open Idea Logo" width={36} height={36} />
            <span className="text-xl font-bold gradient-text ml-2">Open Idea</span>
          </Link>

          {/* Desktop nav right */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {NAV_LINKS.map(link => {
              const isActive = activeRoot === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`focus:outline-none focus:ring-2 focus:ring-emerald-400/60 px-2 py-1 rounded transition hover:text-emerald-400/90 ${
                    isActive ? 'text-emerald-400 font-semibold' : 'text-gray-300 dark:text-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User avatar, feedback, theme toggle */}
          <div className="flex items-center gap-4">
            {isAuthenticated && userData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-emerald-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onKeyDown={onDropdownKey}
                >
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={userData.name || userData.email || 'User'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-300">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div
                    role="menu"
                    aria-label="User menu"
                    className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-2xl shadow-xl border border-gray-700/50 z-[9999]"
                  >
                    {/* Header section with avatar and user info */}
                    <div className="p-6 border-b border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          {userData.avatarUrl ? (
                            <img
                              src={userData.avatarUrl}
                              alt={userData.name || userData.email || 'User'}
                              className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-emerald-600 ring-2 ring-emerald-400 flex items-center justify-center text-3xl font-bold text-white">
                              {userData.name ? userData.name.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <button
                            className="absolute bottom-0 right-0 bg-gray-800 border border-gray-600 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Edit profile"
                            onClick={() => {/* open edit modal or profile page */}}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400">
                              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-white">{userData.name || 'User'}</span>
                          <span className="text-sm text-gray-400">{userData.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-2">
                      <div className="flex flex-col gap-1">
                        <button 
                          className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-gray-800/80 rounded-xl transition-colors text-left"
                          onClick={() => {/* manage account */}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            <path fillRule="evenodd" d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 01.804.98v1.36a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.295 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.295A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.295-1.473zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Manage Account
                        </button>
                        <Link
                          href="/dashboard"
                          role="menuitem"
                          className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-gray-800/80 rounded-xl transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM11 13.25A2.25 2.25 0 0113.25 11h2.5A2.25 2.25 0 0118 13.25v2.5A2.25 2.25 0 0115.75 18h-2.5A2.25 2.25 0 0111 15.75v-2.5z" />
                          </svg>
                          Workspace
                        </Link>
                        <Link
                          href="/projects"
                          role="menuitem"
                          className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-gray-800/80 rounded-xl transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
                            <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zM7 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Projects
                        </Link>
                        <Link 
                          href="/feedback"
                          role="menuitem" 
                          className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-gray-800/80 rounded-xl transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
                          </svg>
                          Feedback
                        </Link>
                        <button
                          role="menuitem"
                          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                          className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-gray-800/80 rounded-xl transition-colors text-left"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            {theme === "dark" ? (
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            ) : (
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            )}
                          </svg>
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>
                      </div>
                    </div>

                    {/* Sign out button */}
                    <div className="p-2 border-t border-gray-700/50">
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-gray-800/80 rounded-xl transition-colors text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                          <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle Theme"
                  className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {mounted && theme === "dark" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                <Link 
                  href="/feedback" 
                  className="focus:outline-none focus:ring-2 focus:ring-emerald-400/60 px-2 py-1 rounded transition hover:text-emerald-400 font-medium"
                >
                  Feedback
                </Link>
                <Link
                  href="/auth"
                  className="focus:outline-none focus:ring-2 focus:ring-emerald-400/60 px-4 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}