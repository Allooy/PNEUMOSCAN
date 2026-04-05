import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import { Loader2, Eye, Calendar, User, FileDigit, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';

export default function HistoryPage() {
    usePageTitle('Case History');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: cases, isLoading, error } = useQuery({
        queryKey: ['cases'],
        queryFn: async () => {
            const response = await api.get('/cases/');
            // Sort by Date descending so newest is first
            return response.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes fresh data (prevents double query on mount)
        refetchOnWindowFocus: false
    });

    const filteredCases = cases?.filter(caseItem => {
        // First apply the category filter
        let matchesFilter = true;
        if (filter === 'PNEUMONIA') matchesFilter = caseItem.ai_result === "PNEUMONIA DETECTED";
        if (filter === 'NO PNEUMONIA') matchesFilter = caseItem.ai_result === "NO PNEUMONIA DETECTED";
        if (filter === 'Inconclusive') matchesFilter = caseItem.ai_result === "INCONCLUSIVE";
        
        if (!matchesFilter) return false;

        const searchLower = debouncedSearchTerm.toLowerCase().trim();
        if (!searchLower) return true;

        const patientStr = caseItem.patient_id ? `pt-${caseItem.patient_id}`.toLowerCase() : '';
        const caseIdStr = caseItem.id ? caseItem.id.toString().toLowerCase() : '';

        return patientStr.includes(searchLower) || caseIdStr.includes(searchLower) || `cs-${caseIdStr}`.includes(searchLower);
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-violet-100 rounded-full"></div>
                <div className="absolute top-0 w-12 h-12 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium transition-colors duration-300">Loading history...</p>
        </div>
    );

    if (error) return (
        <div className="text-center p-12 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 transition-colors duration-300">
            Error loading history: {error.message}
        </div>
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    return (
        <div className="space-y-8 relative z-10 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Patient History</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Archive of all past AI analyses</p>
                </div>
                <Link to="/upload" className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-xl hover:scale-105 transition-all font-semibold">
                    <Plus className="h-5 w-5" />
                    New Analysis
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Patient ID or Case ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 focus:border-violet-500 dark:text-white transition-all outline-none text-slate-700 shadow-sm"
                    />
                </div>
                
                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0">
                    {['All', 'PNEUMONIA', 'NO PNEUMONIA', 'Inconclusive'].map(lbl => (
                        <button
                            key={lbl}
                            onClick={() => setFilter(lbl)}
                            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shadow-sm border ${
                                filter === lbl 
                                    ? 'bg-slate-800 text-white border-slate-900 dark:bg-violet-600 dark:border-violet-500 dark:text-white' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                            }`}
                        >
                            {lbl}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredCases?.map((caseItem) => {
                        const isPneumonia = caseItem.ai_result === "PNEUMONIA DETECTED";
                        const isInconclusive = caseItem.ai_result === "INCONCLUSIVE";

                        let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
                        let glow = "hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20";
                        if (isPneumonia) {
                            statusColor = "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
                            glow = "hover:shadow-rose-500/10 dark:hover:shadow-rose-900/20";
                        }
                        else if (isInconclusive) {
                            statusColor = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
                            glow = "hover:shadow-amber-500/10 dark:hover:shadow-amber-900/20";
                        }

                        return (
                            <motion.div
                                key={caseItem.id}
                                layout
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg ${glow} transition-colors group`}
                            >
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    {/* Icon / ID */}
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isPneumonia ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'
                                            }`}>
                                            <FileDigit className={`h-6 w-6 ${isPneumonia ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'
                                                }`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider transition-colors duration-300">Case ID</p>
                                            <p className="font-bold text-slate-900 dark:text-white transition-colors duration-300">#{caseItem.id}</p>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors duration-300">
                                                {new Date(caseItem.uploaded_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors duration-300">PT-{caseItem.patient_id}</span>
                                        </div>
                                        <div className="sm:text-right">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-300 ${statusColor}`}>
                                                {caseItem.ai_result}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="w-full md:w-auto flex justify-end">
                                        <Link
                                            to={`/cases/${caseItem.id}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                </AnimatePresence>

                {filteredCases?.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 border-dashed transition-colors duration-300"
                    >
                        <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
                            <FileDigit className="h-8 w-8 text-slate-300 dark:text-slate-500 transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white transition-colors duration-300">{cases?.length === 0 ? "No cases found" : "No matches found"}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">{cases?.length === 0 ? "Upload your first X-ray to get started." : "Try adjusting your search term."}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
