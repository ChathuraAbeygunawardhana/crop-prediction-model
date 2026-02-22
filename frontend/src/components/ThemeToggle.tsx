"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";

        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        document.startViewTransition(() => {
            setTheme(nextTheme);
        });
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2.5 rounded-full bg-neon-200 dark:bg-neon-900/50 text-neon-900 dark:text-neon-200 hover:bg-neon-300 dark:hover:bg-neon-800 transition-colors z-50 shadow-md backdrop-blur-md border border-neon-300 dark:border-neon-800 focus:outline-none focus:ring-2 focus:ring-neon-500"
            aria-label="Toggle dark mode"
        >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
        </button>
    );
}
