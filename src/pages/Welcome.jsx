import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Zap, CheckCircle, Brain, Clock, X, Stethoscope, Mail, KeyRound, AlertCircle, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Welcome() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden transition-colors duration-300">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-fuchsia-400 dark:bg-fuchsia-900/40 rounded-full blur-3xl opacity-20 animate-blob transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-500 dark:bg-violet-900/40 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 transition-colors duration-300"></div>
            <div className="absolute top-1/2 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-cyan-400 dark:bg-cyan-900/40 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000 transition-colors duration-300"></div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/30">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                        PNEUMO<span className="text-violet-600 dark:text-violet-400">SCAN</span>
                    </span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5 text-slate-600" />
                        ) : (
                            <Sun className="h-5 w-5 text-slate-400" />
                        )}
                    </button>
                    {user ? (
                        <Link to="/dashboard" className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold shadow-sm hover:shadow-md border border-violet-500 transition-all hover:bg-violet-700">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <button onClick={() => setShowLoginModal(true)} className="px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:text-violet-600 dark:hover:text-violet-400">
                            Sign In
                        </button>
                    )}
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-6 border border-violet-200 dark:border-violet-800 transition-colors duration-300">
                            <span className="flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse"></span>
                            AI-Powered Diagnostics v2.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6 transition-colors duration-300">
                            Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">Healthcare</span> <br />
                            Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400">Speed.</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl transition-colors duration-300">
                            Advanced pneumonia detection powered by deep learning. Get instant, reliable X-ray analysis designed for modern clinical workflows.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-0">
                            <button onClick={handleGetStarted} className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-violet-600 text-white font-bold text-lg hover:bg-slate-800 dark:hover:bg-violet-500 transition-all shadow-xl shadow-slate-900/20 dark:shadow-violet-900/30 flex items-center justify-center gap-2 group">
                                {user ? 'Go to Dashboard' : 'Get Started Now'}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a href="#features" className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 justify-center flex">
                                View Demo
                            </a>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                HIPAA Compliant
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                99.8% Uptime
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                Secure Encryption
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/30 dark:shadow-violet-900/30 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 transition-colors duration-300">
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                                alt="Doctor using iPad"
                                className="rounded-2xl"
                            />

                            {/* Floating Card 1 */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute top-8 left-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 transition-colors duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg transition-colors duration-300">
                                        <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">ACCURACY</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">98.5%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Card 2 */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-8 right-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 transition-colors duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg transition-colors duration-300">
                                        <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">SPEED</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">&lt; 2.5s</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Powerful Features for Modern Diagnostics</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors duration-300">Streamline your workflow with tools designed for precision and efficiency.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain className="h-8 w-8 text-white" />}
                            color="bg-violet-500 dark:bg-violet-600"
                            title="Deep Learning"
                            description="Our DenseNet121 model is trained on thousands of verified CXR images specifically for pneumonia detection."
                        />
                        <FeatureCard
                            icon={<Clock className="h-8 w-8 text-white" />}
                            color="bg-fuchsia-500 dark:bg-fuchsia-600"
                            title="Real-time Analysis"
                            description="Upload to results in seconds. Reduce patient wait times with instant preliminary triage."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-8 w-8 text-white" />}
                            color="bg-cyan-500 dark:bg-cyan-600"
                            title="Enterprise Secure"
                            description="End-to-end encryption and GDPR compliant infrastructure ensures patient data stays private."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity className="h-6 w-6 text-violet-500" />
                        <span className="text-xl font-bold text-white">PNEUMO<span className="text-violet-500">SCAN</span></span>
                    </div>
                    <p className="text-slate-400 text-sm">© 2024 Pneumoscan AI. All rights reserved.</p>
                </div>
            </footer>

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <LoginModal key="login-modal" onClose={() => setShowLoginModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function FeatureCard({ icon, title, description, color }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-900/20 transition-all cursor-default"
        >
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-colors duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                {description}
            </p>
        </motion.div>
    )
}

function LoginModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard'); // Proceed to dashboard after login
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Fixed Floating Error Message on entire screen - Placed DIRECTLY in the overlay to avoid modal layout bounds */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -50, x: "-50%" }}
                        className="fixed top-6 left-1/2 z-[100] bg-rose-50/95 dark:bg-rose-900/95 backdrop-blur-md text-rose-600 dark:text-rose-400 py-3 px-6 rounded-2xl text-sm flex items-center gap-3 border border-rose-200 dark:border-rose-800 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="font-semibold">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden relative transition-colors transition-shadow duration-300 border border-violet-200 dark:border-violet-700/50 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]"
                onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing modal
            >
                {/* Animated Glowing Gradient Border/Shadow Effect (CSS trick) */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(139,92,246,0.2)] animate-pulse"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-slate-400 hover:text-slate-900 dark:text-white dark:hover:text-white transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/20 shadow-sm"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8 pt-12 flex flex-col items-center border-b border-transparent">
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-3xl mb-6 shadow-inner border border-slate-100 dark:border-slate-700 relative">
                        {/* Subtle inner glow to match the image icon box */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-50" />
                        <Stethoscope className="h-8 w-8 text-violet-600 dark:text-violet-400 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center">Secure access to your clinical dashboard</p>
                </div>

                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-violet-500 transition-colors duration-300" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700"
                                    placeholder="doctor@hospital.org"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-violet-500 transition-colors duration-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="remember-me"
                                        className="sr-only"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className={`block w-11 h-6 rounded-full transition-colors ${rememberMe ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${rememberMe ? 'transform translate-x-5' : ''}`}></div>
                                </div>
                                <span className="ml-3 block text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                                    Remember me
                                </span>
                            </label>

                            <div className="text-sm">
                                <a href="#" className="font-semibold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/20 text-sm font-bold text-white bg-slate-900 dark:bg-violet-600 hover:bg-violet-600 dark:hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100/50 dark:border-slate-800/50 transition-colors duration-300">
                        <div className="text-xs text-center text-slate-500 dark:text-slate-500 transition-colors duration-300 opacity-80">
                            <p className="font-semibold mb-1">Restricted Access System</p>
                            <p>Unauthorized access is prohibited and monitored.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
