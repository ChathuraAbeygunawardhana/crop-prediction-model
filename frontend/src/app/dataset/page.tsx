import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import { DatasetPreview } from "@/components/DatasetPreview";

export default function DatasetPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-neon-50 via-white to-neon-100 dark:from-neon-950 dark:via-neon-950 dark:to-neon-900 font-sans selection:bg-neon-300 selection:text-neon-950 dark:selection:bg-neon-700 dark:selection:text-neon-50">
            {/* Background accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[300px] bg-neon-300 dark:bg-neon-800 opacity-20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>

            {/* Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white/50 dark:bg-neon-900/50 border border-neon-300 dark:border-neon-700 text-neon-900 dark:text-neon-200 hover:bg-neon-100 hover:dark:bg-neon-800 transition-colors backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight text-neon-950 dark:text-neon-50 hidden sm:block">Aura</span>
                    <Sprout className="w-6 h-6 text-neon-600 dark:text-neon-400" />
                </div>
            </header>

            <main className="w-full flex-grow flex flex-col items-center pb-12">
                <DatasetPreview />
            </main>
        </div>
    );
}
