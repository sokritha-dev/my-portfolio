"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Load the saved theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }

    // Set the greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning! 🌅 Turn off the light?");
    } else if (hours < 18) {
      setGreeting("Good afternoon! ☀️ Want to dim the lights?");
    } else {
      setGreeting("Good evening! 🌙 Turn on the light?");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative flex flex-col items-center gap-4 mt-4">
      {/* Animated Background */}
      <motion.div
        className={cn(
          "absolute inset-0 -z-10 transition-all duration-700 ease-in-out",
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-black animate-stars"
            : "bg-gradient-to-b from-blue-100 to-white"
        )}
      />

      {/* Greeting Message with Smooth Animation */}
      <motion.p
        key={greeting}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-lg font-medium text-muted-foreground"
      >
        {greeting}
      </motion.p>

      {/* Animated Toggle Button */}
      <motion.div
        whileTap={{ scale: 0.9 }} // Button squishes slightly on click
        whileHover={{ scale: 1.1, rotate: 5 }} // Subtle hover effect
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={toggleTheme}
          variant="outline"
          className="relative flex items-center gap-2 p-2 transition-colors duration-300 hover:bg-primary hover:text-white"
        >
          {isDarkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-blue-400" />}
          <span className="text-sm">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </motion.div>
    </div>
  );
}
