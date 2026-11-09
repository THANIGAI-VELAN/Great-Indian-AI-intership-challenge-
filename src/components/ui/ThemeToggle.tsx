"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Check initial dark mode from DOM or localStorage
    const savedTheme = localStorage.getItem("solli-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("solli-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("solli-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-full border border-rule/70 dark:border-rule-dark/80 bg-card/80 dark:bg-card-dark/80 backdrop-blur-md text-ink dark:text-ink-dark hover:scale-105 active:scale-95 transition-all shadow-paper cursor-pointer",
        className
      )}
      title={isDark ? "Switch to warm paper light mode" : "Switch to study dark mode"}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <Sun
          className={cn(
            "w-4 h-4 text-vermilion transition-all duration-300 absolute inset-0",
            isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          )}
        />
        <Moon
          className={cn(
            "w-4 h-4 text-info transition-all duration-300 absolute inset-0",
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          )}
        />
      </div>
    </button>
  );
}

