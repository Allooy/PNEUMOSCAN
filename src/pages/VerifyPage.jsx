import React, { useState } from 'react';
import { useSearchParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, ShieldX, Mail, ArrowLeft, CheckCircle, Loader2, KeyRound, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function VerifyPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const [searchParams] = useSearchParams();
    const errorParam = searchParams.get('error'); // 'invalid_token' | 'expired_token'

    // Use email from state (redirected from login) or fallback to local state for resend
    const [email, setEmail] = useState(state?.email || '');
    const [showResendForm, setShowResendForm] = useState(false);
    const [resendState, setResendState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [resendMessage, setResendMessage] = useState('');

    // OTP State (for manual entry)
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const inputRefs = React.useRef([]);

    // If no error param AND no email in state, send them home
    if (!errorParam && !state?.email) return <Navigate to="/" replace />;

    const isErrorFlow = !!errorParam;
    const isExpired = errorParam === 'expired_token';

    const handleResend = async (e) => {
        if (e) e.preventDefault();
        const targetEmail = email || state?.email;
        if (!targetEmail?.trim()) return;
        setResendState('loading');
        try {
            const response = await api.post('/auth/resend-verification', { email: targetEmail.trim() });
            setResendState('success');
            setResendMessage(response.data?.message || 'Verification email sent! Check your inbox.');
            setOtpError('');
            setDigits(['', '', '', '', '', '']);
        } catch (err) {
            setResendState('error');
            setResendMessage(err.response?.data?.detail || 'Something went wrong. Please try again.');
        }
    };

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

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const code = digits.join('');
        if (code.length < 6) { setOtpError('Please enter all 6 digits.'); return; }
        setOtpError(''); setOtpLoading(true);
        try {
            const res = await api.post('/auth/verify-email', { email, code });
            if (res.data?.access_token) {
                setToken(res.data.access_token);
                navigate('/dashboard');
            } else {
                setResendState('success');
                setResendMessage('Account verified! You can now sign in.');
            }
        } catch (err) {
            setOtpError(err.response?.data?.detail || 'Invalid or expired code.');
        } finally { setOtpLoading(false); }
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
                    !isErrorFlow
                        ? 'bg-violet-500/15 border border-violet-500/30'
                        : isExpired
                            ? 'bg-amber-500/15 border border-amber-500/30'
                            : 'bg-rose-500/15 border border-rose-500/30'
                }`}>
                    {!isErrorFlow
                        ? <Mail className="h-8 w-8 text-violet-400" />
                        : isExpired
                            ? <Clock className="h-8 w-8 text-amber-400" />
                            : <ShieldX className="h-8 w-8 text-rose-400" />
                    }
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-extrabold text-white text-center tracking-tight mb-3">
                    {!isErrorFlow ? 'Verify Your Account' : isExpired ? 'Link Expired' : 'Link Invalid'}
                </h1>
                <p className="text-slate-400 text-center text-sm leading-relaxed mb-6">
                    {!isErrorFlow
                        ? <>We've sent a 6-digit code to <span className="text-violet-400 font-bold block mt-1">{email}</span></>
                        : isExpired
                            ? 'This magic link is only valid for 10 minutes and has expired.'
                            : 'This link is invalid or has already been used.'
                    }
                </p>

                {/* OTP Flow (Direct entry) */}
                {!isErrorFlow && resendState !== 'success' && (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {otpError && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5" /> {otpError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleOtpSubmit} className="space-y-5">
                            <div className="flex justify-center gap-2" onPaste={handlePaste}>
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
                                        className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-xl bg-slate-800 text-white outline-none transition-all ${d ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700'} focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20`}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={otpLoading || digits.join('').length < 6}
                                className="w-full py-3.5 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-lg shadow-violet-700/30 flex items-center justify-center gap-2"
                            >
                                {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                Verify Account
                            </button>
                        </form>

                        <div className="text-center">
                            <button
                                onClick={() => handleResend()}
                                disabled={resendState === 'loading'}
                                className="text-xs font-bold text-slate-500 hover:text-violet-400 transition-colors"
                            >
                                {resendState === 'loading' ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>
                    </div>
                )}

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
