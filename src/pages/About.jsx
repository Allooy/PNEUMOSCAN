import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Brain, Zap, User, Users, Globe, Building, Award, CheckCircle } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export default function About() {
    usePageTitle(
        null, 
        'Learn about PNEUMOSCAN, the clinical-grade AI platform for pneumonia detection. Founded by radiologists and engineers to eliminate diagnostic delays in emergency settings.',
        'About Us | PNEUMOSCAN AI'
    );
    const { setShowLoginModal } = useOutletContext();

    return (
        <div className="w-full relative z-10 pb-24">
            {/* Hero Section */}
            <section className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-6 border border-violet-200 dark:border-violet-800">
                        <Award className="h-4 w-4" /> Leading the Future of Radiology
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                        We are building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">Clinical Standard</span> for AI diagnostics.
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                        PNEUMOSCAN was founded with a singular mission: to eliminate diagnostic delays in critical lung conditions using state-of-the-art deep learning architecture.
                    </p>
                </motion.div>

                {/* Animated Stats */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {[
                        { label: 'Accuracy', value: '98.5%', suffix: '', color: 'text-violet-600 dark:text-violet-400' },
                        { label: 'Scans Processed', value: '1.2', suffix: 'M+', color: 'text-cyan-600 dark:text-cyan-400' },
                        { label: 'Hospitals', value: '350', suffix: '+', color: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Average Speed', value: '<2.5', suffix: 's', color: 'text-amber-600 dark:text-amber-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className={`text-3xl md:text-4xl font-black mb-1 ${stat.color}`}>{stat.value}<span className="text-xl md:text-2xl">{stat.suffix}</span></h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Our Mission / Core Tech */}
            <section className="py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:w-1/2 relative">
                        <div className="w-full aspect-square md:aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl p-6 ring-1 ring-white/10 flex flex-col justify-between">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/30 blur-[80px] rounded-full pointer-events-none" />
                            
                            <div>
                                <Brain className="h-10 w-10 text-violet-400 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">DenseNet121 Architecture</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                    Our proprietary model utilizes densely connected convolutional networks to extract rich feature hierarchies from chest X-rays, ensuring superior sensitivity and specificity.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                                    <ShieldCheck className="h-6 w-6 text-emerald-400 mb-2" />
                                    <h4 className="text-white font-semibold text-sm mb-1">HIPAA Compliant</h4>
                                    <p className="text-slate-500 text-xs text-balance">End-to-end encryption for all PHI data.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                                    <Globe className="h-6 w-6 text-cyan-400 mb-2" />
                                    <h4 className="text-white font-semibold text-sm mb-1">GDPR Aware</h4>
                                    <p className="text-slate-500 text-xs text-balance">Hosted on compliant EU and US servers.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Designed by Clinicians, <br/>Engineered for Scale.</h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Eliminating Wait Times', desc: 'In emergency settings, every minute counts. Our AI acts as an instant second reader, highlighting potential anomalies before the radiologist even opens the scan.' },
                                { title: 'Reducing Burnout', desc: 'By automating the initial triage of normal scans, we allow specialists to focus their cognitive load on complex, critical cases.' },
                                { title: 'Explainable AI (Grad-CAM)', desc: 'We don\'t believe in black boxes. Every positive prediction is accompanied by a heatmap showing exactly what regions influenced the model\'s decision.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1"><CheckCircle className="h-6 w-6 text-violet-500" /></div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Advisory Board & Leadership</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Guided by leading experts in pulmonary medicine, radiology, and artificial intelligence.</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {[
                        { name: 'Dr. Sarah Chen, MD', role: 'Chief Medical Officer', icon: <User className="h-10 w-10 text-violet-500" />, desc: 'Board-certified radiologist with 15+ years experience. Former Head of Imaging at Mass General.' },
                        { name: 'Marcus Torres', role: 'Chief Technology Officer', icon: <Users className="h-10 w-10 text-cyan-500" />, desc: 'Ex-Google Brain researcher specializing in applied computer vision for healthcare diagnostics.' },
                        { name: 'Dr. Elena Rostova', role: 'Head of Clinical AI', icon: <Brain className="h-10 w-10 text-amber-500" />, desc: 'PhD in Biomedical Engineering. Architect of our proprietary DenseNet evaluation pipeline.' },
                    ].map((member, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300 group-hover:scale-110 transform">
                                {member.icon}
                            </div>
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-slate-700">
                                {member.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                            <p className="text-violet-600 dark:text-violet-400 font-semibold text-sm mb-4">{member.role}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-violet-900/20 border border-slate-800 dark:border-violet-500/30 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-[url('/pneumoscan.svg')] opacity-5 bg-repeat pointer-events-none" />
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 tracking-tight">Ready to transform your workflow?</h2>
                    <p className="text-slate-400 md:text-lg mb-8 max-w-xl mx-auto relative z-10">
                        Join hundreds of clinicians already using PNEUMOSCAN to deliver faster, more accurate diagnoses.
                    </p>
                    <button onClick={() => setShowLoginModal(true)} className="relative z-10 px-8 py-4 rounded-full bg-violet-600 text-white font-bold shadow-xl shadow-violet-600/30 hover:bg-violet-500 hover:shadow-violet-500/40 transition-all scale-100 hover:scale-105 active:scale-95 text-lg">
                        Create Free Account
                    </button>
                </div>
            </section>
        </div>
    );
}
