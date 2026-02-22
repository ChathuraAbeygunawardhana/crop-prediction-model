"use client";

import { useState } from "react";

interface InfoTooltipProps {
    content: string;
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
    const [show, setShow] = useState(false);

    return (
        <div
            className="relative inline-flex items-center ml-1.5 align-middle group"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onClick={() => setShow(!show)}
        >
            <svg
                className="w-3.5 h-3.5 text-neon-950 hover:text-neon-950 dark:hover:text-neon-400 cursor-help transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-zinc-900 shadow-xl rounded-md z-[200] pointer-events-none animate-fade-in-up origin-bottom">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                </div>
            )}
        </div>
    );
}
