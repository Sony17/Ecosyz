import React from "react";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-screen-xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
