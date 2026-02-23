"use client";

import { useEffect, useState } from "react";
import { Database } from "lucide-react";

export function DatasetPreview() {
    const [data, setData] = useState<{ headers: string[], rows: string[][] } | null>(null);

    useEffect(() => {
        fetch("/data/lanka_crop_dataset.csv")
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split("\n");
                if (lines.length > 0) {
                    const headers = lines[0].split(",");
                    const rows = lines.slice(1, 11).map(line => line.split(","));
                    setData({ headers, rows });
                }
            })
            .catch(console.error);
    }, []);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-neon-200/50 dark:bg-neon-800/50 border border-neon-300 dark:border-neon-700 shadow-sm backdrop-blur-md">
                    <Database className="w-6 h-6 text-neon-900 dark:text-neon-200" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neon-950 dark:text-neon-50">
                        Dataset Overview
                    </h2>
                    <p className="text-neon-700 dark:text-neon-400 mt-1">
                        A quick preview of the dataset that was used to train the model.
                    </p>
                </div>
            </div>

            <div className="relative rounded-2xl border border-neon-300 dark:border-neon-800 bg-white/40 dark:bg-neon-950/40 backdrop-blur-xl shadow-xl overflow-hidden group">
                <div className="overflow-x-auto relative z-10 custom-scrollbar">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs uppercase bg-neon-100/90 dark:bg-neon-900/90 text-neon-900 dark:text-neon-200 border-b border-neon-300 dark:border-neon-800 backdrop-blur-md sticky top-0">
                            <tr>
                                {data ? data.headers.map((header, i) => (
                                    <th key={i} scope="col" className="px-6 py-5 font-semibold tracking-wider">
                                        {header.replace(/_/g, ' ')}
                                    </th>
                                )) : (
                                    <th className="px-6 py-5">Loading dataset...</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neon-200 dark:divide-neon-800/50">
                            {data && data.rows.map((row, i) => (
                                <tr key={i} className="hover:bg-neon-50/80 dark:hover:bg-neon-800/50 transition-colors duration-200">
                                    {row.map((cell, j) => {
                                        let displayCell = cell;
                                        if (!isNaN(Number(cell)) && cell.trim() !== '') {
                                            if (cell.includes('.') && cell.split('.')[1].length > 4) {
                                                displayCell = parseFloat(cell).toFixed(3);
                                            }
                                        }

                                        // Highlight Target Crop differently
                                        if (data.headers[j] === "Target_Crop") {
                                            return (
                                                <td key={j} className="px-6 py-4 font-medium">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neon-200/50 dark:bg-neon-800 text-neon-900 dark:text-neon-100 border border-neon-300 dark:border-neon-700">
                                                        {displayCell}
                                                    </span>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td key={j} className="px-6 py-4 text-neon-800 dark:text-neon-300 tabular-nums">
                                                {displayCell}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data && (
                    <div className="relative z-10 border-t border-neon-300 dark:border-neon-800 bg-neon-50/80 dark:bg-neon-900/80 p-4 text-center text-sm text-neon-700 dark:text-neon-300 font-medium backdrop-blur-md transition-colors">
                        Showing 10 of 5,000+ records
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-neon-400/5 to-neon-600/5 dark:from-neon-400/5 dark:to-neon-600/5 pointer-events-none rounded-2xl" />
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.5);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(156, 163, 175, 0.8);
                }
            `}</style>
        </section>
    );
}
