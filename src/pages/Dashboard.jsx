import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Activity, AlertTriangle, ArrowRight, TrendingUp, Clock, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    usePageTitle(
        'Dashboard',
        'Access the PNEUMOSCAN clinical dashboard for a comprehensive overview of pneumonia detection statistics, recent case analyses, and real-time system performance metrics.'
    );
    const { user } = useAuth();
    const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('justVerified') === 'true') {
            sessionStorage.removeItem('justVerified');
            setShowVerifiedBanner(true);
            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => setShowVerifiedBanner(false), 5000);
            return () => clearTimeout(timer);
        }
    }, []);
    const { data: stats } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            // 1. Fetch current basic stats
            const statsRes = await api.get('/cases/stats');
            const statsData = statsRes.data;

            // 2. Fetch full case list to calculate precise Clinically Validated accuracy
            const casesRes = await api.get('/cases/');
            const allCases = casesRes.data || [];

            // 3. Calculate "Validator Accuracy": (Approved / (Approved + Denied))
            const reviewedCases = allCases.filter(c => {
                const s = c.status?.toLowerCase();
                return s === 'validated' || s === 'denied';
            });

            const validatedCount = reviewedCases.filter(c => 
                c.status?.toLowerCase() === 'validated'
            ).length;
            
            let calculatedRate = "0%";
            if (reviewedCases.length > 0) {
                const rateVal = (validatedCount / reviewedCases.length) * 100;
                calculatedRate = `${Math.round(rateVal)}%`;
            }

            return {
                ...statsData,
                validationRate: calculatedRate
            };
        }
    });

    const { data: recentCases, isLoading } = useQuery({
        queryKey: ['recent-cases'],
        queryFn: async () => {
            const response = await api.get('/cases/');
            // Sort to get newest first, then take top 5
            const sorted = response.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
            return sorted.slice(0, 5);
        }
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="space-y-8 relative z-10">
            {/* ── Email Verified Success Banner ───────────────────────────── */}
            <AnimatePresence>
                {showVerifiedBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-900/90 border border-emerald-500/50 shadow-2xl shadow-emerald-900/40 backdrop-blur-md text-emerald-100 text-sm font-semibold w-max max-w-[90vw]"
                    >
                        <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span>Email verified successfully! Welcome to PNEUMOSCAN.</span>
                        <button
                            onClick={() => setShowVerifiedBanner(false)}
                            className="ml-2 p-1 rounded-full hover:bg-emerald-800/60 transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="h-4 w-4 text-emerald-300" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm border border-white/40 dark:border-slate-700/40 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-3 transition-colors duration-300">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors duration-300">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="hidden sm:block">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-sm text-slate-600 dark:text-slate-300 text-sm font-bold border border-white/50 dark:border-slate-700/50 transition-colors duration-300">
                        <Clock className="w-4 h-4 mr-2 text-violet-500" />
                        Last updated: Just now
                    </span>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatsCard
                    title="Total Cases"
                    value={stats?.totalCases}
                    icon={<FileText className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-br from-violet-500 to-indigo-600"
                    trend={stats?.totalCasesTrend}
                />
                <StatsCard
                    title="Pending Review"
                    value={stats?.pendingReview}
                    icon={<AlertTriangle className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                    trend={stats?.pendingReviewTrend}
                />
                 <StatsCard
                    title="Validation Rate"
                    value={stats?.validationRate}
                    icon={<CheckCircle className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-br from-rose-500 to-pink-600"
                    trend={stats?.validationRateTrend}
                />
                <StatsCard
                    title="Avg Confidence"
                    value={stats?.avgConfidence}
                    icon={<Users className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                    trend={stats?.avgConfidenceTrend}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 border border-white dark:border-slate-700 overflow-hidden transition-colors duration-300"
            >
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 transition-colors duration-300">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Recent Analysis</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">Latest cases processed by the AI</p>
                    </div>
                    <Link to="/history" className="group flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors bg-white/80 dark:bg-slate-700/80 px-4 py-2 rounded-xl shadow-sm hover:shadow dark:shadow-none">
                        View All History
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100/50 dark:divide-slate-700/50">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 transition-colors duration-300">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Case ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Result</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 dark:divide-slate-700/50 bg-white/30 dark:bg-slate-800/30 transition-colors duration-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading recent analyses...</td>
                                </tr>
                            ) : recentCases?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No recent analyses found.</td>
                                </tr>
                            ) : (
                                recentCases?.map((caseItem, idx) => {
                                    const isPneumonia = caseItem.ai_result === "PNEUMONIA DETECTED";
                                    const isInconclusive = caseItem.ai_result === "INCONCLUSIVE";
                                    let resultColorStr = 'emerald';
                                    if (isPneumonia) resultColorStr = 'rose';
                                    if (isInconclusive) resultColorStr = 'amber';

                                    return (
                                        <motion.tr
                                            key={caseItem.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + (idx * 0.1) }}
                                            className="hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-200">#{caseItem.id}</td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">{new Date(caseItem.uploaded_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">PT-{caseItem.patient_id}</td>
                                             <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-colors duration-300 ${
                                                    caseItem.status === 'Pending' 
                                                        ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' 
                                                        : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                                }`}>
                                                    {caseItem.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex font-extrabold text-[11px] tracking-wider uppercase px-3 py-1 rounded-lg shadow-sm border transition-colors duration-300 text-${resultColorStr}-700 bg-${resultColorStr}-100 border-${resultColorStr}-200 dark:text-${resultColorStr}-400 dark:bg-${resultColorStr}-900/30 dark:border-${resultColorStr}-800`}>
                                                    {caseItem.ai_result}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                {(caseItem.status === 'Pending' && (user?.role === 'admin' || user?.role === 'doctor')) ? (
                                                    <Link to={`/cases/${caseItem.id}`} className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all font-bold">
                                                        Validate <ArrowRight className="w-4 h-4 ml-1" />
                                                    </Link>
                                                ) : (
                                                    <Link to={`/cases/${caseItem.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-all opacity-100 md:opacity-0 group-hover:opacity-100 md:transform md:translate-x-2 group-hover:translate-x-0 duration-200">
                                                        Details <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

function StatsCard({ title, value, icon, gradient, trend }) {
    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                show: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 border border-white dark:border-slate-700 transition-colors duration-300"
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-2xl shadow-lg border border-white/20 ${gradient}`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-700/80 shadow-sm border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-300 transition-colors duration-300">
                        {trend.includes('+') ? <TrendingUp className="w-3 h-3 mr-1.5 text-emerald-500" /> : null}
                        {trend}
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">{title}</p>
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight transition-colors duration-300">{value}</h3>
            </div>
            {/* Decoration Blob */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 ${gradient} blur-3xl pointer-events-none`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/5 to-transparent pointer-events-none rounded-3xl transition-colors duration-300"></div>
        </motion.div>
    )
}
