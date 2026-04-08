import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Zap, CheckCircle, Brain, Clock, X, Stethoscope, Mail, KeyRound, AlertCircle, Moon, Sun, User, UserPlus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';
import api from '../api';

export default function Welcome() {
    usePageTitle(null, 'PNEUMOSCAN | AI-Powered Pneumonia Detection Platform');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showDemoVideo, setShowDemoVideo] = useState(false);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) { navigate('/dashboard'); } else { setShowLoginModal(true); }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden transition-colors duration-300">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-fuchsia-400 dark:bg-fuchsia-900/40 rounded-full blur-3xl opacity-20 animate-blob transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-500 dark:bg-violet-900/40 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 transition-colors duration-300"></div>
            <div className="absolute top-1/2 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-cyan-400 dark:bg-cyan-900/40 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000 transition-colors duration-300"></div>

            {/* Navigation */}
            <nav aria-label="Main navigation" className="relative z-10 px-4 sm:px-6 py-5 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-1.5 rounded-xl shadow-lg shadow-violet-500/30 overflow-hidden">
                        <img src="/favicon.png" alt="PNEUMOSCAN" className="h-5 w-5 sm:h-6 sm:w-6 object-cover" />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                        PNEUMO<span className="text-violet-600 dark:text-violet-400">SCAN</span>
                    </span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'light' ? <Moon className="h-5 w-5 text-slate-600" /> : <Sun className="h-5 w-5 text-slate-400" />}
                    </button>
                    {user ? (
                        <Link to="/dashboard" className="px-4 sm:px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold shadow-sm hover:shadow-md border border-violet-500 transition-all hover:bg-violet-700 text-sm">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <button onClick={() => setShowLoginModal(true)} className="px-4 sm:px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:text-violet-600 dark:hover:text-violet-400 text-sm">
                            Sign In
                        </button>
                    )}
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-10 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:w-1/2 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-6 border border-violet-200 dark:border-violet-800 transition-colors duration-300">
                            <span className="flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse"></span>
                            AI-Powered Diagnostics v2.0
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6 transition-colors duration-300">
                            Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">Healthcare</span> <br />
                            Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400">Speed.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl transition-colors duration-300">
                            Advanced pneumonia detection powered by deep learning. Get instant, reliable X-ray analysis designed for modern clinical workflows.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-0">
                            <button onClick={handleGetStarted} className="px-6 sm:px-8 py-4 rounded-2xl bg-slate-900 dark:bg-violet-600 text-white font-bold text-base sm:text-lg hover:bg-slate-800 dark:hover:bg-violet-500 transition-all shadow-xl shadow-slate-900/20 dark:shadow-violet-900/30 flex items-center justify-center gap-2 group">
                                {user ? 'Go to Dashboard' : 'Get Started Now'}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => setShowDemoVideo(true)} className="px-6 sm:px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 justify-center flex">
                                View Demo
                            </button>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
                            {['HIPAA Compliant', '99.8% Uptime', 'Secure Encryption'].map(t => (
                                <div key={t} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:w-1/2 w-full relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/30 dark:shadow-violet-900/30 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 transition-colors duration-300">
                            <InteractiveHero />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Powerful Features for Modern Diagnostics</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg transition-colors duration-300">Streamline your workflow with tools designed for precision and efficiency.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        <FeatureCard icon={<Brain className="h-8 w-8 text-white" />} color="bg-violet-500 dark:bg-violet-600" title="Deep Learning" description="Our DenseNet121 model is trained on thousands of verified CXR images specifically for pneumonia detection." />
                        <FeatureCard icon={<Clock className="h-8 w-8 text-white" />} color="bg-fuchsia-500 dark:bg-fuchsia-600" title="Real-time Analysis" description="Upload to results in seconds. Reduce patient wait times with instant preliminary triage." />
                        <FeatureCard icon={<ShieldCheck className="h-8 w-8 text-white" />} color="bg-cyan-500 dark:bg-cyan-600" title="Enterprise Secure" description="End-to-end encryption and GDPR compliant infrastructure ensures patient data stays private." />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-10 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-6 w-6 text-violet-500" />
                        <span className="text-xl font-bold text-white">PNEUMO<span className="text-violet-500">SCAN</span></span>
                    </div>
                    <p className="text-slate-400 text-sm text-center">© {new Date().getFullYear()} Pneumoscan AI. All rights reserved.</p>
                </div>
            </footer>

            {/* Auth Modal */}
            <AnimatePresence>
                {showLoginModal && <AuthModal key="auth-modal" onClose={() => setShowLoginModal(false)} />}
            </AnimatePresence>

            {/* Demo Video */}
            <AnimatePresence>
                {showDemoVideo && (
                    <motion.div key="demo-video-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-slate-900/90 dark:bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10">
                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
                            <button onClick={() => setShowDemoVideo(false)} className="bg-white/10 hover:bg-rose-500 text-white rounded-full p-3 sm:p-4 transition-all border border-white/20 shadow-2xl hover:scale-110" title="Close Demo">
                                <X className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>
                        </div>
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                            className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.2)] ring-1 ring-white/20">
                            <video src="/assets/web-gif.mov" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-[1.02]" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Interactive Hero ─────────────────────────────────────────────────────────
function InteractiveHero() {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const images = ['/assets/image1.png', '/assets/image2.png', '/assets/image3.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) setCurrentImageIdx(prev => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered, images.length]);

    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-crosshair bg-slate-900 group shadow-inner">
            <video src="/assets/web-gif.mov" autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover scale-[1.05] transition-transform duration-[1.5s] ease-out group-hover:scale-100" />
            <motion.div animate={{ opacity: isHovered ? 0 : 1 }} transition={{ duration: 0.6, ease: "easeInOut" }} className="absolute inset-0 w-full h-full z-10 bg-slate-900">
                <AnimatePresence>
                    <motion.img key={currentImageIdx} src={images[currentImageIdx]}
                        initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={`PNEUMOSCAN AI clinical dashboard — chest X-ray analysis view ${currentImageIdx + 1}`}
                    />
                </AnimatePresence>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl shadow-black/40 border border-white/50 dark:border-slate-700 transition-colors duration-300">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-lg"><ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
                        <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ACCURACY</p><p className="text-base font-bold text-slate-800 dark:text-white">98.5%</p></div>
                    </div>
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl shadow-black/40 border border-white/50 dark:border-slate-700 transition-colors duration-300">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-amber-100 dark:bg-amber-900/40 p-1.5 rounded-lg"><Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" /></div>
                        <div><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">SPEED</p><p className="text-base font-bold text-slate-800 dark:text-white">&lt; 2.5s</p></div>
                    </div>
                </motion.div>
            </motion.div>
            <div className={`absolute inset-0 bg-violet-600/10 z-20 pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, color }) {
    return (
        <motion.div whileHover={{ y: -5 }} className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-900/20 transition-all cursor-default">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg mb-5 sm:mb-6 transition-colors duration-300`}>{icon}</div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300 text-sm sm:text-base">{description}</p>
        </motion.div>
    );
}

// ─── Auth Modal (Sign In + Register + Verify + Success) ────────────────────────
function AuthModal({ onClose }) {
    // 'login' | 'register' | 'verify' | 'success'
    const [view, setView] = useState('login');
    const [registeredEmail, setRegisteredEmail] = useState('');
    // Track where mousedown started — only close if drag began ON the backdrop
    const mouseDownOnBackdrop = useRef(false);

    const handleBackdropMouseDown = (e) => {
        mouseDownOnBackdrop.current = e.target === e.currentTarget;
    };
    const handleBackdropMouseUp = (e) => {
        if (mouseDownOnBackdrop.current && e.target === e.currentTarget) {
            onClose();
        }
        mouseDownOnBackdrop.current = false;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            onMouseDown={handleBackdropMouseDown}
            onMouseUp={handleBackdropMouseUp}>
            <div onMouseDown={e => e.stopPropagation()} onMouseUp={e => e.stopPropagation()} className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {view === 'login' && (
                        <LoginView key="login" onClose={onClose} onSwitchRegister={() => setView('register')} />
                    )}
                    {view === 'register' && (
                        <RegisterView key="register" onClose={onClose} onSwitchLogin={() => setView('login')}
                            onRegistered={(email) => { setRegisteredEmail(email); setView('verify'); }} />
                    )}
                    {view === 'verify' && (
                        <VerifyView key="verify" email={registeredEmail} onClose={onClose} onSuccess={() => setView('success')} />
                    )}
                    {view === 'success' && (
                        <SuccessView key="success" onClose={onClose} />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ─── Login View ───────────────────────────────────────────────────────────────
function LoginView({ onClose, onSwitchRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-violet-200 dark:border-violet-700/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mx-6 mt-6 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />{error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-8 pt-10 flex flex-col items-center border-b border-slate-100 dark:border-slate-800">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                </button>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl mb-5 shadow-inner border border-slate-100 dark:border-slate-700">
                    <Stethoscope className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center">Secure access to your clinical dashboard</p>
            </div>

            <div className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                placeholder="doctor@hospital.org" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative group">
                            <KeyRound className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center cursor-pointer group gap-2">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                                <div className={`block w-9 h-5 rounded-full transition-colors ${rememberMe ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform ${rememberMe ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                        </label>
                        <a href="#" className="text-sm font-semibold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors">Forgot password?</a>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-violet-500/20 text-sm font-bold text-white bg-slate-900 dark:bg-violet-600 hover:bg-violet-600 dark:hover:bg-violet-500 focus:outline-none disabled:opacity-50 transition-all">
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>}
                    </button>
                </form>

                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <button onClick={onSwitchRegister} className="font-bold text-violet-600 dark:text-violet-400 hover:underline transition-colors">
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Register View ────────────────────────────────────────────────────────────
function RegisterView({ onClose, onSwitchLogin, onRegistered }) {
    const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setLoading(true);
        try {
            await register(form.email, form.password, form.full_name, 'staff');
            onRegistered(form.email);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-violet-200 dark:border-violet-700/50 shadow-[0_0_30px_rgba(139,92,246,0.3)] max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <button onClick={onSwitchLogin} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back to Sign In
                </button>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="p-6">
                <div className="mb-6 text-center">
                    <div className="bg-violet-100 dark:bg-violet-900/30 p-3.5 rounded-2xl inline-flex mb-4 border border-violet-200 dark:border-violet-800">
                        <UserPlus className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join the PNEUMOSCAN clinical platform</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />{error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                        <div className="relative group">
                            <User className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                            <input type="text" required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                placeholder="Dr. Jane Smith" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                            <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                placeholder="doctor@hospital.org" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative group">
                            <KeyRound className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                            <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                placeholder="Min. 8 characters" />
                        </div>
                        {form.password && (
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex-1 flex gap-1">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`} />
                                    ))}
                                </div>
                                <span className={`text-xs font-semibold ${['','text-rose-500','text-amber-500','text-blue-500','text-emerald-500'][strength]}`}>{strengthLabel}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                        <div className="relative group">
                            <KeyRound className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                            <input type="password" required value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                                className={`block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm ${form.confirm && form.confirm !== form.password ? 'border-rose-400 dark:border-rose-600' : 'border-slate-200 dark:border-slate-700'}`}
                                placeholder="••••••••" />
                        </div>
                        {form.confirm && form.confirm !== form.password && (
                            <p className="text-xs text-rose-500 mt-1">Passwords don't match</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/25 transition-all text-sm disabled:opacity-50 mt-2">
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="h-4 w-4" /> Create Account</>}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

// ─── OTP Verify View ──────────────────────────────────────────────────────────
function VerifyView({ email, onClose, onSuccess }) {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    const handleDigit = (idx, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...digits];
        next[idx] = val;
        setDigits(next);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = digits.join('');
        if (code.length < 6) { setError('Please enter all 6 digits.'); return; }
        setError(''); setLoading(true);
        try {
            const res = await api.post('/auth/verify-email', { email, code });
            // If backend returns a token, auto-login and go straight to dashboard
            if (res.data?.access_token) {
                setToken(res.data.access_token);
                navigate('/dashboard');
            } else {
                // Fallback: show success screen (user will need to sign in manually)
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid or expired code. Please try again.');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await api.post('/auth/resend-verification', { email });
            setResendCooldown(60);
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch { } finally { setResending(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-violet-200 dark:border-violet-700/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]">

            <div className="flex justify-end p-4 pb-0">
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="px-8 pb-8 text-center">
                {/* Animated envelope icon */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-violet-200 dark:border-violet-800 shadow-lg">
                    <Mail className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">We sent a verification code to</p>
                <p className="font-bold text-violet-600 dark:text-violet-400 text-sm mb-6 truncate">{email}</p>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2 text-left">
                            <AlertCircle className="h-4 w-4 shrink-0" />{error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 6-digit OTP input */}
                    <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                        {digits.map((d, i) => (
                            <input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                onChange={e => handleDigit(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className={`w-11 h-13 sm:w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all ${d ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'} focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20`}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        Or click the <span className="font-semibold text-violet-600 dark:text-violet-400">magic link</span> in your email to verify instantly
                    </p>

                    <button type="submit" disabled={loading || digits.join('').length < 6}
                        className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/25 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="h-4 w-4" /> Verify Account</>}
                    </button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Didn't receive the email?</p>
                    <button onClick={handleResend} disabled={resendCooldown > 0 || resending}
                        className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-50 disabled:no-underline transition-colors">
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resending ? 'Sending...' : 'Resend Code'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Success View ─────────────────────────────────────────────────────────────
function SuccessView({ onClose }) {
    const navigate = useNavigate();

    useEffect(() => {
        // After 2.5s, close the modal and send user to sign in
        const t = setTimeout(() => {
            onClose();
            navigate('/?verified=true');
        }, 2500);
        return () => clearTimeout(t);
    }, [onClose, navigate]);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-emerald-200 dark:border-emerald-800/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] p-10 text-center">
            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1, bounce: 0.5 }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account Verified!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Welcome to PNEUMOSCAN. Please sign in to continue.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Redirecting you back…</p>
            <motion.div className="mt-4 h-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <motion.div initial={{ width: '100%' }} animate={{ width: 0 }} transition={{ duration: 2.5, ease: 'linear' }} className="h-full bg-emerald-500 rounded-full" />
            </motion.div>
        </motion.div>
    );
}
