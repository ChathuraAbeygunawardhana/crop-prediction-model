"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    label: string;
    name: string;
    value: string;
    options: DropdownOption[];
    onChange: (e: { target: { name: string; value: string } }) => void;
    disabled?: boolean;
}

export default function CustomDropdown({
    label,
    name,
    value,
    options,
    onChange,
    disabled = false,
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="space-y-1.5 relative w-full" ref={dropdownRef}>
            <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {label}
            </label>
            <div
                className={`w-full h-11 px-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border flex flex-col justify-center cursor-pointer transition-all text-emerald-900 dark:text-emerald-100 ${disabled
                    ? "opacity-50 cursor-not-allowed border-emerald-200 dark:border-emerald-800"
                    : "border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500"
                    } ${isOpen ? "ring-2 ring-emerald-500 dark:ring-emerald-400 border-emerald-500 dark:border-emerald-400" : ""}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex justify-between items-center w-full">
                    <span className={`block truncate ${!value ? "text-emerald-600/60 dark:text-emerald-300/50" : "font-medium"}`}>
                        {selectedOption ? selectedOption.label : `Select...`}
                    </span>
                    <svg
                        className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Dropdown Menu - Animation */}
            <div
                className={`absolute z-[100] w-full mt-2 rounded-lg bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 shadow-xl overflow-hidden transition-all duration-300 transform origin-top
        ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
        `}
            >
                <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                ${value === option.value
                                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-medium"
                                    : "text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                }
              `}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
