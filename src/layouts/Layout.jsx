import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Stethoscope, LogOut, User, Activity, Moon, Sun, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'New Analysis', path: '/upload' },
        { name: 'Patient History', path: '/history' },
        { name: 'AI Assistant', path: '/chat' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col font-sans relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-fuchsia-400 rounded-full blur-3xl opacity-10 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-500 rounded-full blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="fixed top-1/2 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-cyan-400 dark:bg-emerald-500 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000 pointer-events-none"></div>

            <header className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">
                                PNEUMO<span className="text-violet-600 dark:text-violet-400">SCAN</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-white/50 dark:border-slate-700 backdrop-blur-sm">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${location.pathname === item.path
                                        ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-700">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-slate-500 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                                title={isDarkMode ? "Switch to Light Mode" : "Dark Room Mode"}
                            >
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-1.5 pr-3 rounded-full border border-white/50 dark:border-slate-700 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800"
                                >
                                    <div className="bg-gradient-to-br from-fuchsia-500 to-violet-500 p-1.5 rounded-full shadow-sm">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">{user?.full_name || user?.email?.split('@')[0] || 'Clinician'}</p>
                                        <p className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold mt-0.5 uppercase tracking-wider">{user?.role || 'Staff'}</p>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate flex items-center gap-1">
                                                    <Activity className="h-3 w-3" /> UID: {user?.id}
                                                </p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                                >
                                                    <Settings className="h-4 w-4" /> Account Settings
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 relative z-10 flex flex-col">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 w-full flex flex-col"
                >
                    <Outlet />
                </motion.div>
            </main>

            <footer className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-white/20 dark:border-slate-800 py-8 mt-auto relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:justify-start gap-4 mb-4 md:mb-0">
                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-violet-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
                                <Activity className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Clinical Decision Support System</span>
                            </span>
                        </div>
                        <p className="font-medium text-slate-600 dark:text-slate-400">&copy; {new Date().getFullYear()} PNEUMOSCAN. For Research Use Only.</p>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Disclaimer: PNEUMOSCAN is a Clinical Decision Support tool utilizing Deep Learning (DenseNet121).
                        All AI outputs must be reviewed and verified by a qualified clinician before clinical action.
                    </p>
                </div>
            </footer>
            {/* Mobile Bottom Navigation (Hidden on md+) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        let Icon;
                        switch (item.name) {
                            case 'Dashboard': Icon = Activity; break;
                            case 'New Analysis': Icon = Stethoscope; break;
                            case 'Patient History': Icon = User; break;
                            case 'AI Assistant': Icon = Settings; break;
                            default: Icon = Activity;
                        }
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : ''}`} />
                                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
