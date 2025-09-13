'use client';

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/openresources", label: "Resources" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
  { href: "/whitepaper", label: "Whitepaper" },
  { href: "/feedback", label: "Feedback" },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  // Trap focus in mobile nav
  useEffect(() => {
    if (!mobileOpen) return;
    const panel = mobileNavRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll('a,button');
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length-1] as HTMLElement;
    function trap(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
    panel.addEventListener('keydown', trap);
    first?.focus();
    return () => panel.removeEventListener('keydown', trap);
  }, [mobileOpen]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10 h-14">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between relative">
          {/* Brand left */}
          <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
            <Image src="/eco.png" alt="Open Idea Logo" width={36} height={36} />
            <span className="text-xl font-bold gradient-text ml-2">Open Idea</span>
          </Link>
          {/* Desktop nav center */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2" aria-label="Main">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="focus:outline-none focus:ring-2 focus:ring-emerald-400/60 px-1 py-1 rounded transition hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Utilities right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mounted && theme === "dark" ? (
                <i className="fas fa-sun" />
              ) : (
                <i className="fas fa-moon" />
              )}
            </button>
            <Link href="/feedback" className="focus:outline-none focus:ring-2 focus:ring-emerald-400/60 px-2 py-1 rounded transition hover:text-emerald-400 font-medium">
              Feedback
            </Link>
          </div>
          {/* Hamburger for mobile */}
          <button
            type="button"
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ml-auto"
            aria-label="Open menu"
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <span className="sr-only">Open menu</span>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        ref={mobileNavRef}
        className={`md:hidden grid gap-2 p-4 bg-black/80 border-t border-white/10 transition-all duration-200 ${mobileOpen ? 'block' : 'hidden'}`}
        tabIndex={mobileOpen ? 0 : -1}
        aria-label="Main"
      >
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="block w-full text-lg px-3 py-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:bg-emerald-900/20 text-white"
            onClick={() => setMobileOpen(false)}
            tabIndex={mobileOpen ? 0 : -1}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="w-full flex items-center justify-center gap-2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:bg-emerald-900/20 text-white"
          tabIndex={mobileOpen ? 0 : -1}
        >
          {mounted && theme === "dark" ? <i className="fas fa-sun" /> : <i className="fas fa-moon" />}
          <span>Toggle Theme</span>
        </button>
        <Link
          href="/feedback"
          className="w-full flex items-center justify-center gap-2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:bg-emerald-900/20 text-white font-medium"
          onClick={() => setMobileOpen(false)}
          tabIndex={mobileOpen ? 0 : -1}
        >
          Feedback
        </Link>
      </div>
    </header>
  );
}
