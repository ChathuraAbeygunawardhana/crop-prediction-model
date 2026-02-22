import Link from "next/link";
import { ArrowRight, Sprout, Linkedin, Globe } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-neon-50 via-white to-neon-100 dark:from-neon-950 dark:via-neon-950 dark:to-neon-900 font-sans selection:bg-neon-300 selection:text-neon-950 dark:selection:bg-neon-700 dark:selection:text-neon-50">

            {/* Background accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-neon-300 dark:bg-neon-800 opacity-20 md:opacity-30 blur-[100px] md:blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <main className="w-full max-w-5xl px-6 flex flex-col items-center justify-center flex-grow py-12 animate-fade-in-up text-center">

                {/* Logo/Icon */}
                <div className="mb-8 p-4 rounded-3xl bg-neon-200/50 dark:bg-neon-900/50 shadow-xl border border-neon-400/50 dark:border-neon-800/50 backdrop-blur-xl">
                    <Sprout className="w-16 h-16 text-neon-950 dark:text-neon-400" />
                </div>

                {/* Hero Text */}
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-semibold tracking-wide border rounded-full border-neon-400 dark:border-neon-800 bg-white/50 dark:bg-neon-900/50 backdrop-blur-sm text-neon-950 dark:text-neon-400">
                    <span className="flex w-2.5 h-2.5 rounded-full bg-neon-900 dark:bg-neon-100 mr-2.5 animate-pulse" />
                    Aura Precision System Ready
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neon-950 dark:text-neon-50 text-balance mb-6">
                    Cultivate the Future of <br className="hidden lg:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-neon-600 to-neon-900 dark:from-neon-200 dark:to-neon-500">
                        Sri Lanka's Agriculture
                    </span>
                </h1>

                <p className="max-w-3xl text-lg md:text-xl text-neon-800 dark:text-neon-300 mb-6 font-medium leading-relaxed">
                    By analyzing specific inputs like your soil conditions, environmental factors, and regional characteristics, our intelligent model determines exactly the most optimal crop to cultivate on your particular land.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-2xl">
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-neon-200/50 dark:bg-neon-800/50 border border-neon-300 dark:border-neon-700 text-neon-900 dark:text-neon-200">
                        Analyzes Soil & Topography
                    </span>
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-neon-200/50 dark:bg-neon-800/50 border border-neon-300 dark:border-neon-700 text-neon-900 dark:text-neon-200">
                        Evaluates Environmental Factors
                    </span>
                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-neon-200/50 dark:bg-neon-800/50 border border-neon-300 dark:border-neon-700 text-neon-900 dark:text-neon-200">
                        Recommends the Optimal Crop
                    </span>
                </div>

                {/* Call to Action Wrapper */}
                <div className="relative group">
                    {/* Animated glow effect behind button */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-400 to-neon-600 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

                    <Link
                        href="/predict"
                        className="relative flex items-center gap-3 px-8 py-4 bg-neon-900 dark:bg-neon-100 text-neon-50 dark:text-neon-900 font-bold rounded-xl text-lg hover:pr-6 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-900 dark:focus:ring-offset-neon-950 dark:focus:ring-neon-100 cursor-pointer border border-transparent dark:border-neon-200"
                    >
                        Launch Prediction Engine
                        <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 flex flex-col items-center justify-center gap-2 text-sm font-medium text-neon-800/60 dark:text-neon-400/60 tracking-wider text-center">
                <p>© {new Date().getFullYear()} By Chathura Abeygunawardhana</p>
                <div className="flex items-center gap-4 text-neon-800/60 dark:text-neon-400/60">
                    <a href="https://www.linkedin.com/in/chathura-abeygunawardhana/" target="_blank" rel="noopener noreferrer" className="hover:text-neon-950 dark:hover:text-neon-200 transition-colors" aria-label="LinkedIn">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://chathura.tech" target="_blank" rel="noopener noreferrer" className="hover:text-neon-950 dark:hover:text-neon-200 transition-colors" aria-label="Personal Website">
                        <Globe className="w-5 h-5" />
                    </a>
                </div>
            </footer>
        </div>
    );
}
