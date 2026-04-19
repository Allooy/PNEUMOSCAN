import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Zap, CheckCircle, Brain, Clock, X, Stethoscope, Mail, KeyRound, AlertCircle, Moon, Sun, User, UserPlus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePageTitle } from '../hooks/usePageTitle';
import api from '../api';

export default function Welcome() {
    usePageTitle(null, 'PNEUMOSCAN | AI-Powered Pneumonia Detection Platform');
    const { setShowLoginModal } = useOutletContext();
    const [showDemoVideo, setShowDemoVideo] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) { navigate('/dashboard'); } else { setShowLoginModal(true); }
    };

    return (
        <div className="w-full">
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
