import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Search, Pencil, Trash2, X, Save, ChevronLeft, ChevronRight,
    AlertTriangle, CheckCircle, HelpCircle, ShieldAlert, Loader2,
    FileDigit, Calendar, User, Activity, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;

export default function ScanManagement() {
    usePageTitle('Scan Management');
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCase, setEditingCase] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saveError, setSaveError] = useState('');

    // Role guard
    useEffect(() => {
        if (user && user.role !== 'doctor' && user.role !== 'admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const { data: cases = [], isLoading, error } = useQuery({
        queryKey: ['all-cases-management'],
        queryFn: async () => {
            const res = await api.get('/cases/');
            return res.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
        },
        staleTime: 30 * 1000,
    });

    const filteredCases = cases.filter(c => {
        if (!debouncedSearch) return true;
        const s = debouncedSearch.toLowerCase();
        return (
            String(c.id).includes(s) ||
            String(c.patient_id).toLowerCase().includes(s) ||
            (c.ai_result || '').toLowerCase().includes(s)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredCases.length / ITEMS_PER_PAGE));
    const paginated = filteredCases.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Edit mutation
    const editMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await api.put(`/cases/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-cases-management'] });
            queryClient.invalidateQueries({ queryKey: ['cases'] });
            setEditingCase(null);
            setSaveError('');
        },
        onError: (err) => setSaveError(err.response?.data?.detail || 'Failed to save changes.'),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/cases/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-cases-management'] });
            queryClient.invalidateQueries({ queryKey: ['cases'] });
            setDeleteTarget(null);
        },
        onError: () => setDeleteTarget(null),
    });

    const openEdit = (c) => {
        setEditingCase(c);
        setSaveError('');
        setEditForm({
            patient_id: c.patient_id ?? '',
            ai_result: c.ai_result ?? '',
            confidence_score: c.confidence_score != null ? (c.confidence_score * 100).toFixed(1) : '',
        });
    };

    const handleSave = () => {
        const payload = {
            patient_id: editForm.patient_id,
            ai_result: editForm.ai_result,
            confidence_score: parseFloat(editForm.confidence_score) / 100,
        };
        editMutation.mutate({ id: editingCase.id, data: payload });
    };

    const resultOptions = ['PNEUMONIA DETECTED', 'NO PNEUMONIA DETECTED', 'INCONCLUSIVE'];

    const getResultStyle = (result) => {
        if (result === 'PNEUMONIA DETECTED') return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
        if (result === 'INCONCLUSIVE') return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    };

    const ResultIcon = ({ result }) => {
        if (result === 'PNEUMONIA DETECTED') return <AlertTriangle className="h-3.5 w-3.5" />;
        if (result === 'INCONCLUSIVE') return <HelpCircle className="h-3.5 w-3.5" />;
        return <CheckCircle className="h-3.5 w-3.5" />;
    };

    if (!user || (user.role !== 'doctor' && user.role !== 'admin')) return null;

    return (
        <div className="space-y-6 relative z-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold mb-3 border border-violet-200 dark:border-violet-800">
                    <ShieldAlert className="h-3 w-3" />
                    {user.role === 'admin' ? 'Admin' : 'Doctor'} — Restricted Access
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Scan Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Edit or remove scans from the system. All changes are permanent.</p>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white dark:border-slate-700 shadow-sm p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Case ID, Patient ID, or result..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
                    />
                </div>
            </motion.div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white dark:border-slate-700 shadow-xl overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-violet-500 animate-spin mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading scans...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-rose-500">Failed to load scans.</div>
                ) : filteredCases.length === 0 ? (
                    <div className="text-center py-20">
                        <FileDigit className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">No scans found.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700/50">
                                <thead className="bg-slate-50/80 dark:bg-slate-900/50">
                                    <tr>
                                        {['Case ID', 'Patient ID', 'Date', 'AI Result', 'Confidence', 'Actions'].map(h => (
                                            <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                                    <AnimatePresence>
                                        {paginated.map((c, idx) => (
                                            <motion.tr
                                                key={c.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group"
                                            >
                                                <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                                                    <Link to={`/cases/${c.id}`} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">#{c.id}</Link>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> PT-{c.patient_id}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(c.uploaded_at).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getResultStyle(c.ai_result)}`}>
                                                        <ResultIcon result={c.ai_result} />
                                                        {c.ai_result}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm font-mono font-bold text-slate-700 dark:text-slate-200">
                                                    {c.confidence_score != null ? `${(c.confidence_score * 100).toFixed(1)}%` : '—'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEdit(c)}
                                                            className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors border border-violet-100 dark:border-violet-800/50"
                                                            title="Edit scan"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteTarget(c)}
                                                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors border border-rose-100 dark:border-rose-800/50"
                                                            title="Delete scan"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredCases.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </motion.div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingCase && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setEditingCase(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-violet-100 dark:bg-violet-900/40 p-2 rounded-xl">
                                        <SlidersHorizontal className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Scan #{editingCase.id}</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Changes are saved to the database immediately</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditingCase(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                <AnimatePresence>
                                    {saveError && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 shrink-0" />{saveError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Patient ID</label>
                                    <input
                                        type="text"
                                        value={editForm.patient_id}
                                        onChange={e => setEditForm(p => ({ ...p, patient_id: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">AI Result</label>
                                    <select
                                        value={editForm.ai_result}
                                        onChange={e => setEditForm(p => ({ ...p, ai_result: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                    >
                                        {resultOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Confidence Score <span className="text-slate-400 font-normal">(0–100%)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={editForm.confidence_score}
                                            onChange={e => setEditForm(p => ({ ...p, confidence_score: e.target.value }))}
                                            className="w-full px-4 py-3 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 pb-6 flex gap-3">
                                <button onClick={() => setEditingCase(null)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={editMutation.isPending}
                                    className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                >
                                    {editMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setDeleteTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm p-6 text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Delete Scan #{deleteTarget.id}?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action is permanent and cannot be undone. The scan and all associated data will be removed.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTarget(null)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(deleteTarget.id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Shared Pagination Bar ────────────────────────────────────────────────────
export function PaginationBar({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
    if (totalPages <= 1) return null;

    const from = (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, totalItems);

    // Build page pills: show up to 5 around current
    const getPages = () => {
        const pages = [];
        const range = 2;
        for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
            pages.push(i);
        }
        if (pages[0] > 1) { pages.unshift('...'); pages.unshift(1); }
        if (pages[pages.length - 1] < totalPages) { pages.push('...'); pages.push(totalPages); }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 dark:border-slate-700/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold text-slate-700 dark:text-slate-200">{from}–{to}</span> of <span className="font-bold text-slate-700 dark:text-slate-200">{totalItems}</span> results
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {getPages().map((p, i) =>
                    p === '...' ? (
                        <span key={`dots-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all border ${
                                p === currentPage
                                    ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
