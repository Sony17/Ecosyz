'use client';

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);


  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");


  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 bg-transparent">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/eco.png" alt="Open Idea Logo" width={36} height={36} />
        <span className="text-xl font-bold gradient-text ml-2">Open Idea</span>
      </Link>

      <nav className="space-x-6 text-sm font-medium flex items-center gap-4">
        <Link href="/openresources" className="hover:text-green-400 transition">Resources</Link>
        <Link href="/projects" className="hover:text-green-400 transition">Projects</Link>
        <Link href="/community" className="hover:text-green-400 transition">Community</Link>
        <Link href="/whitepaper" className="hover:text-green-400 transition">Whitepaper</Link>
        <Link href="/feedback" className="hover:text-green-400 transition">Feedback</Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {mounted && theme === "dark" ? (
            <i className="fas fa-sun" />
          ) : (
            <i className="fas fa-moon" />
          )}
        </button>

      </nav>
    </header>
  );
}
