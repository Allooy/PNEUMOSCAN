import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from '../components/AuthModal';

export default function PublicLayout() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    return (
        <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300 flex flex-col">
            {/* Animated Background Blobs — fixed so they never cause layout overflow */}
            <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-fuchsia-400 dark:bg-fuchsia-900/40 rounded-full blur-3xl opacity-20 animate-blob transition-colors duration-300 z-0 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-500 dark:bg-violet-900/40 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 transition-colors duration-300 z-0 pointer-events-none"></div>
            <div className="fixed top-1/2 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-cyan-400 dark:bg-cyan-900/40 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000 transition-colors duration-300 z-0 pointer-events-none"></div>

            {/* Navigation */}
            <nav aria-label="Main navigation" className="relative z-50 px-4 sm:px-6 py-5 md:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
                            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                            PNEUMO<span className="text-violet-600 dark:text-violet-400">SCAN</span>
                        </span>
                    </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <Link to="/" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${location.pathname === '/' ? 'text-violet-600 dark:text-violet-400' : ''}`}>Home</Link>
                    <Link to="/about" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${location.pathname === '/about' ? 'text-violet-600 dark:text-violet-400' : ''}`}>About</Link>
                    <Link to="/contact" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${location.pathname === '/contact' ? 'text-violet-600 dark:text-violet-400' : ''}`}>Contact</Link>
                    <Link to="/demo" className={`hover:text-fuchsia-600 dark:hover:text-fuchsia-400 font-extrabold flex items-center gap-1 transition-colors ${location.pathname === '/demo' ? 'text-fuchsia-600 dark:text-fuchsia-400' : ''}`}><Activity className="h-4 w-4" /> Try Demo</Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors z-50 text-slate-500 dark:text-slate-400"
                    >
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    {user ? (
                        <Link to="/dashboard" className="px-4 sm:px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold shadow-sm hover:shadow-md border border-violet-500 transition-all hover:bg-violet-700 text-sm">
                            Dashboard
                        </Link>
                    ) : (
                        <button onClick={() => setShowLoginModal(true)} className="px-4 sm:px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:text-violet-600 dark:hover:text-violet-400 text-sm">
                            Sign In
                        </button>
                    )}
                </motion.div>
            </nav>

            {/* Mobile Nav Links */}
            <div className="md:hidden flex justify-center gap-6 pb-4 relative z-50 text-sm font-bold text-slate-600 dark:text-slate-300">
                <Link to="/" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${location.pathname === '/' ? 'text-violet-600 dark:text-violet-400' : ''}`}>Home</Link>
                <Link to="/about" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${location.pathname === '/about' ? 'text-violet-600 dark:text-violet-400' : ''}`}>About</Link>
                <Link to="/contact" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${location.pathname === '/contact' ? 'text-violet-600 dark:text-violet-400' : ''}`}>Contact</Link>
                <Link to="/demo" className={`hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors ${location.pathname === '/demo' ? 'text-fuchsia-600 dark:text-fuchsia-400' : ''}`}>Demo</Link>
            </div>

            {/* Main content area */}
            <main className="flex-1 relative z-10 w-full flex flex-col">
                <Outlet context={{ setShowLoginModal }} />
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 py-10 px-4 sm:px-6 mt-auto relative z-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-80">
                        <Activity className="h-5 w-5 text-violet-500" />
                        <span className="text-lg font-bold text-white tracking-tight">PNEUMO<span className="text-violet-500">SCAN</span></span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                        <Link to="/demo" className="hover:text-white transition-colors">Interactive Demo</Link>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                    <p className="text-slate-600 text-sm text-center">© {new Date().getFullYear()} Pneumoscan AI. All rights reserved.</p>
                </div>
            </footer>

            {/* Auth Modal */}
            <AnimatePresence>
                {showLoginModal && <AuthModal key="auth-modal" onClose={() => setShowLoginModal(false)} />}
            </AnimatePresence>
        </div>
    );
}
