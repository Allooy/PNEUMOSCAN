import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Contact() {
    usePageTitle(
        null,
        'Get in touch with PNEUMOSCAN for clinical support, hospital partnerships, and API integration inquiries. Our medical sales team is ready to assist you with AI diagnostic implementation.',
        'Contact Us | PNEUMOSCAN AI'
    );
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | submitting | success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate network request
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setForm({ name: '', email: '', subject: '', message: '' });
            }, 3000);
        }, 1500);
    };

    return (
        <div className="w-full relative z-10 pb-24">
            {/* Hero Section */}
            <section className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-semibold mb-6 border border-violet-200 dark:border-violet-800">
                        <MessageSquare className="h-4 w-4" /> We're here to help
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                        Get in Touch with our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Expert Team</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                        Whether you have questions about API integration, pricing, or clinical validation, our team is ready to assist you.
                    </p>
                </motion.div>
            </section>

            <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* Contact Info Cards */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:w-1/3 flex flex-col gap-6">
                    {[
                        { icon: <Mail className="h-6 w-6 text-violet-600 dark:text-violet-400" />, title: 'Email Support', desc: 'support@pneumoscan.com', subdesc: 'Usually responds within 2 hours', bg: 'bg-violet-100 dark:bg-violet-900/30' },
                        { icon: <Phone className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />, title: 'Sales & Partnerships', desc: '+1 (800) 555-0199', subdesc: 'Mon-Fri, 9am-6pm EST', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
                        { icon: <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />, title: 'Headquarters', desc: '142 Innovation Way', subdesc: 'Muharraq, Kingdom of Bahrain', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                            <div className={`${card.bg} p-3 rounded-2xl shrink-0`}>
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{card.title}</h3>
                                <p className="text-slate-700 dark:text-slate-300 font-medium">{card.desc}</p>
                                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">{card.subdesc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="lg:w-2/3 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-violet-500/10 dark:shadow-[0_0_50px_rgba(139,92,246,0.1)] relative overflow-hidden">
                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                                <p className="text-slate-500 dark:text-slate-400">Thank you for reaching out. A member of our clinical sales team will contact you shortly.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                    placeholder="Dr. John Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                    placeholder="doctor@hospital.org" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                            <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm"
                                placeholder="How can we help?" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                            <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 text-sm resize-none"
                                placeholder="Provide detailed information about your inquiry..." />
                        </div>

                        <button type="submit" disabled={status !== 'idle'}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg shadow-violet-500/20 text-sm font-bold text-white bg-slate-900 dark:bg-violet-600 hover:bg-violet-600 dark:hover:bg-violet-500 focus:outline-none disabled:opacity-50 transition-all">
                            {status === 'submitting' ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
                        </button>
                    </form>
                </motion.div>
            </section>
        </div>
    );
}
