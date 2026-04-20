import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Clock, ShieldX, Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api';

export default function VerifyPage() {
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error'); // 'invalid_token' | 'expired_token'

    const [email, setEmail] = useState('');
    const [showResendForm, setShowResendForm] = useState(false);
    const [resendState, setResendState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [resendMessage, setResendMessage] = useState('');

    // If no error param, send them home
    if (!error) return <Navigate to="/" replace />;

    const isExpired = error === 'expired_token';

    const handleResend = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setResendState('loading');
        try {
            const response = await api.post('/auth/resend-verification', { email: email.trim() });
            setResendState('success');
            setResendMessage(response.data?.message || 'Verification email sent! Check your inbox.');
        } catch (err) {
            setResendState('error');
            setResendMessage(err.response?.data?.detail || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-10"
            >
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/30">
                    <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                    PNEUMO<span className="text-violet-400">SCAN</span>
                </span>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-md bg-slate-900 rounded-3xl border border-rose-500/30 shadow-2xl shadow-rose-900/20 p-8 sm:p-10"
            >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                    isExpired
                        ? 'bg-amber-500/15 border border-amber-500/30'
                        : 'bg-rose-500/15 border border-rose-500/30'
                }`}>
                    {isExpired
                        ? <Clock className="h-8 w-8 text-amber-400" />
                        : <ShieldX className="h-8 w-8 text-rose-400" />
                    }
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-extrabold text-white text-center tracking-tight mb-3">
                    {isExpired ? 'Verification Link Expired' : 'Invalid Verification Link'}
                </h1>
                <p className="text-slate-400 text-center text-sm leading-relaxed mb-8">
                    {isExpired
                        ? 'This magic link is only valid for 10 minutes and has expired. Request a new one below.'
                        : 'This link is invalid or has already been used. If you need to verify your account, request a new link.'
                    }
                </p>

                {/* Resend section */}
                {!showResendForm && resendState !== 'success' && (
                    <button
                        onClick={() => setShowResendForm(true)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-700/30 flex items-center justify-center gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        Resend Verification Email
                    </button>
                )}

                {showResendForm && resendState !== 'success' && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={handleResend}
                        className="space-y-3"
                    >
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                            />
                        </div>

                        {resendState === 'error' && (
                            <p className="text-rose-400 text-xs font-medium px-1">{resendMessage}</p>
                        )}

                        <button
                            type="submit"
                            disabled={resendState === 'loading'}
                            className="w-full py-3.5 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-violet-700/30 flex items-center justify-center gap-2"
                        >
                            {resendState === 'loading'
                                ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                                : <><Mail className="h-4 w-4" /> Send New Link</>
                            }
                        </button>
                    </motion.form>
                )}

                {resendState === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3 py-2"
                    >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                        </div>
                        <p className="text-emerald-400 font-semibold text-sm text-center">{resendMessage}</p>
                        <p className="text-slate-500 text-xs text-center">Check your spam folder if you don't see it within a minute.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Back link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to homepage
                </Link>
            </motion.div>
        </div>
    );
}
