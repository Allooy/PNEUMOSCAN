import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save, Activity, LayoutDashboard, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Profile() {
    usePageTitle('Account Settings');
    const { user, setToken } = useAuth();
    const { isDarkMode } = useTheme();

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            setErrorMessage('New passwords do not match.');
            setIsSaving(false);
            return;
        }

        try {
            const payload = {};
            if (formData.full_name && formData.full_name !== user?.full_name) {
                payload.full_name = formData.full_name;
            }
            if (formData.new_password) {
                payload.current_password = formData.current_password;
                payload.new_password = formData.new_password;
            }

            if (Object.keys(payload).length > 0) {
                const response = await api.put('/auth/me', payload);
                if (response.data.access_token) {
                    setToken(response.data.access_token);
                }
            }

            setSuccessMessage('Profile and Security Settings updated successfully!');
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                confirm_password: ''
            }));
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col pt-4 sm:pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/dashboard" className="text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors">
                            <LayoutDashboard className="h-5 w-5" />
                        </Link>
                        <span className="text-slate-300 dark:text-slate-700">/</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                            Account Settings
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Manage your profile information, email address, and security preferences.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>

                        <div className="relative mb-6 group cursor-pointer">
                            <div className="h-32 w-32 rounded-full p-1 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl">
                                <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                                    <User className="h-16 w-16 text-slate-400 dark:text-slate-500" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-2.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-lg text-violet-600 dark:text-violet-400 hover:scale-110 transition-transform">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {user?.full_name || 'Clinician Name'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            {user?.email}
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-800/30">
                            <Shield className="h-4 w-4" />
                            {user?.role || 'Staff Member'}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 w-full flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> User ID</span>
                            <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">{user?.id || 'N/A'}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {successMessage && (
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-3">
                                    <Shield className="h-5 w-5" />
                                    {successMessage}
                                </div>
                            )}

                            {errorMessage && (
                                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-3">
                                    <Shield className="h-5 w-5" />
                                    {errorMessage}
                                </div>
                            )}

                            {/* Section: Personal Info */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-violet-500" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all dark:text-white"
                                            placeholder="Dr. John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all dark:text-white"
                                                placeholder="doctor@hospital.org"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-700/50" />

                            {/* Section: Security */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <KeyRound className="h-5 w-5 text-violet-500" /> Change Password
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2 max-w-md">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={formData.current_password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all dark:text-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                value={formData.new_password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all dark:text-white"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all dark:text-white"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end items-center gap-4 border-t border-slate-100 dark:border-slate-700/50">
                                <button type="button" className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
