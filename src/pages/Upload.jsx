import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { UploadCloud, FileImage, Sparkles, CheckCircle, FileText, X, Activity, Info, FileWarning, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import Toast from '../components/Toast';

export default function UploadPage() {
    usePageTitle('Upload X-Ray');
    const [files, setFiles] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [isTemporary, setIsTemporary] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Full-screen Loading States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [loadingTask, setLoadingTask] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const navigate = useNavigate();

    // Lock body scroll when analyzing
    useEffect(() => {
        if (isAnalyzing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount just in case
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isAnalyzing]);

    // Prevent accidental tab close/refresh during analysis
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isAnalyzing && !isRejected) {
                e.preventDefault();
                e.returnValue = ''; // Required for most browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isAnalyzing, isRejected]);

    const handleFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return;
        const file = fileList[0];

        setIsVerifying(true);
        try {
            // 1. CALL THE PRE-CHECK FIRST (Metadata only)
            await api.get(`/cases/verify-file`, {
                params: { 
                    filename: file.name, 
                    content_type: file.type 
                }
            });

            // 2. IF IT SUCCEEDS, ALLOW FILE ADDITION
            const newFile = {
                file,
                id: Math.random().toString(36).substring(7),
                preview: URL.createObjectURL(file),
                status: 'pending' // pending, processing, complete, error
            };
            setFiles([newFile]);
        } catch (error) {
            // 3. IF IT FAILS, SHOW WARNING & STOP
            const message = error.response?.data?.detail || "Unsupported file or metadata mismatch. Please upload a valid Chest X-Ray image.";
            setToast({ show: true, message, type: 'error' });
            // Scan animation never starts because handleSubmit is never reached for this file
        } finally {
            setIsVerifying(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) handleFiles(e.target.files);
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0 || (!isTemporary && !patientId)) return;

        setIsAnalyzing(true);
        setIsRejected(false);
        setProgressPercent(0);

        const updateTask = async (msg, duration, progress) => {
            if (msg) setLoadingTask(msg);
            if (progress !== undefined) setProgressPercent(progress);
            if (duration) await new Promise(r => setTimeout(r, duration));
        };

        // Fake AI workflow simulation text - Gatekeeper Phase 1 (0 to 30%)
        await updateTask("Scanning Image Attributes...", 1800, 10);
        await updateTask("Verifying if image is a Chest X-Ray...", 2000, 20);

        let results = [];

        for (let i = 0; i < files.length; i++) {
            const currentFile = files[i];

            await updateTask(`Scanning ${currentFile.file.name}...`, 1500, 30);
            let localRejected = false;

            try {
                const formData = new FormData();
                formData.append('file', currentFile.file);
                formData.append('patient_id', isTemporary ? 'TEMP_SCAN' : patientId);
                formData.append('is_temporary', isTemporary);

                // Start simulation up to validation phase
                await updateTask("Gatekeeper Validation in progress...", 1500, 40);

                // Run API and wait for real validation
                const response = await api.post('/cases/analyze', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // Only if API succeeds do we show the "Verified" and subsequent steps
                await updateTask("Verified: Image is a valid X-Ray [PASS]", 1200, 50);
                await updateTask("Isolating Lung Fields...", 1500, 70);
                await updateTask("Extracting Radiomic Features...", 1800, 85);
                await updateTask("Estimating Pneumonia Probability...", 1500, 95);

                results.push(response.data);

            } catch (err) {
                localRejected = true;
                console.error("Analysis Failed:", err);
                const errorDetail = err.response?.data?.detail;
                
                if (errorDetail) {
                    setIsRejected(true);
                    setProgressPercent(100);
                    // Use the specific error message from backend or a fallback
                    setLoadingTask(`Gatekeeper Error: ${errorDetail === "NOT_AN_XRAY" ? "Non-X-Ray Image Detected" : errorDetail}`);
                    return; // Stop processing entirely and show red screen
                }
            }
        }

        if (isRejected) return; // Halt overall function if rejected (safety)

        if (results.length > 0) {
            await updateTask("Compiling Final Report...", 1000, 100);
            
            // Auto Redirect Sequence
            setIsAnalyzing(false);
            if (results.length === 1) {
                if (isTemporary) {
                    navigate(`/cases/temporary`, { state: { caseData: results[0] } });
                } else {
                    navigate(`/cases/${results[0].id}`);
                }
            } else if (results.length > 1) {
                navigate('/dashboard');
            }
        } else if (!isRejected) {
            // In case of complete failure (like a connection error)
            alert("Analysis failed. Could not connect to the server or database error.");
            setIsAnalyzing(false);
        }
    };

    return (
        <React.Fragment>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-6xl mx-auto space-y-8 relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">New Analysis</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">Upload chest X-rays for instant AI-assisted diagnostics.</p>
                    </motion.div>
                </div>

                {/* 2-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COL: Upload Form (Smaller, concise box) */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden relative transition-colors duration-300 p-8 md:p-10 flex flex-col justify-center h-full">

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Patient Identifier</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                            <input
                                                type="text"
                                                required={!isTemporary}
                                                disabled={isTemporary}
                                                value={isTemporary ? '' : patientId}
                                                onChange={(e) => setPatientId(e.target.value)}
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 dark:text-white transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 dark:disabled:bg-slate-800"
                                                placeholder={isTemporary ? "Not required for temporary scans" : "Enter Patient UID (e.g., PT-1001)"}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Chest X-Ray Image</label>

                                        <div
                                            className={`relative group transition-all duration-300 ease-in-out border-3 border-dashed rounded-3xl ${files.length > 0 ? 'p-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-black w-full aspect-[4/3] sm:aspect-video' : 'p-10 text-center cursor-pointer overflow-hidden border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/80'}
                                                ${dragActive && files.length === 0 ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-[1.02]' : ''}
                                            `}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            {files.length === 0 ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                        onChange={handleFileChange}
                                                        accept="image/png, image/jpeg, image/webp, image/dicom, .webp"
                                                    />

                                                    <div className="py-6 flex flex-col items-center">
                                                        <div className="mx-auto w-20 h-20 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/50 transition-all duration-300 shadow-inner">
                                                            {isVerifying ? (
                                                                <Loader2 className="h-10 w-10 text-violet-600 dark:text-violet-400 animate-spin" />
                                                            ) : (
                                                                <UploadCloud className="h-10 w-10 text-violet-600 dark:text-violet-400" />
                                                            )}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                                            {isVerifying ? "Verifying metadata..." : dragActive ? "Drop image here" : "Click or drag to upload"}
                                                        </h3>
                                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                                                            {isVerifying ? "Communicating with clinical gateway..." : "Supports standard PNG, JPG, or DICOM."}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-black/5 dark:bg-black/40">
                                                    {/* Background blurred image */}
                                                    <img src={files[0].preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30 blur-3xl z-0 scale-110" />

                                                    {/* Foreground sharp image */}
                                                    <img src={files[0].preview} alt="preview" className="w-full h-full object-contain relative z-10 p-2 drop-shadow-2xl" />

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(files[0].id)}
                                                        className="absolute top-4 right-4 bg-rose-500 hover:bg-rose-600 p-2.5 rounded-full text-white shadow-xl hover:scale-110 transition-all z-40 backdrop-blur-md"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-2 group">
                                        <button
                                            type="button"
                                            onClick={() => setIsTemporary(!isTemporary)}
                                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                                            style={{ backgroundColor: isTemporary ? '#8b5cf6' : '#cbd5e1' }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isTemporary ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                        <span className="ml-3 flex flex-col">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Temporary Scan</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Do not save to database (results lost after viewing)</span>
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={files.length === 0 || (!isTemporary && !patientId)}
                                        className="w-full py-4 px-6 rounded-2xl shadow-xl shadow-violet-500/25 text-white text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-3"
                                    >
                                        <Sparkles className="h-6 w-6" /> Start Diagnostic Analysis
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT COL: Guidelines & Info Card */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700 flex-1 flex flex-col justify-start space-y-8"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <ClipboardList className="h-6 w-6 text-violet-500" />
                                    Clinical Guidelines
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Review the parameters beneath before initializing an AI query on patient scans.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                                        <FileImage className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Supported Modalities</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AP/PA Chest X-Rays only. Do not upload lateral views. Supported filetypes are standard PNG, JPG, and uncompressed DICOM slices.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                                        <FileWarning className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Patient Anonymization</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All protected health information (PHI) should theoretically be stripped from image metadata if bypassing PACS direct integration.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                                        <Info className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Turnaround Time</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expect typical cluster-assisted analyses to resolve within roughly ~3 seconds per radiograph submitted.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </motion.div>

            {/* FULL SCREEN LOADING OVERLAY */}
            {createPortal(
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[9999] bg-slate-900/90 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
                    >
                        <div className="max-w-md w-full px-6 flex flex-col items-center">

                            {/* Smooth 3D Generative Loader */}
                            <div className="relative flex items-center justify-center w-64 h-64 perspective-1000">
                                {/* Core Glow */}
                                <div className={`absolute w-32 h-32 rounded-full blur-[60px] opacity-40 ${isRejected ? 'bg-rose-600' : 'bg-violet-500 animate-pulse'}`}></div>

                                {/* 3D CSS Rings */}
                                <div className={`absolute w-full h-full border-[3px] rounded-full ${isRejected ? 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'border-violet-500/50'}`}
                                    style={{ animation: 'spin3D 3s linear infinite', transformStyle: 'preserve-3d', animationPlayState: isRejected ? 'paused' : 'running' }}>
                                </div>
                                <div className={`absolute w-56 h-56 border-[3px] transition-all rounded-full ${isRejected ? 'border-rose-400/80' : 'border-cyan-400/60'}`}
                                    style={{ animation: 'spin3DReverse 2.5s ease-in-out infinite', transformStyle: 'preserve-3d', animationDirection: 'alternate', animationPlayState: isRejected ? 'paused' : 'running' }}>
                                </div>
                                <div className={`absolute w-44 h-44 border-[3px] border-dashed rounded-full ${isRejected ? 'border-red-400' : 'border-fuchsia-400/80'}`}
                                    style={{ animation: 'spin3D 4s linear infinite', transformStyle: 'preserve-3d', animationPlayState: isRejected ? 'paused' : 'running' }}>
                                </div>

                                <div className={`z-10 bg-slate-800 rounded-full p-4 border shadow-xl ${isRejected ? 'border-rose-500/50 shadow-rose-500/30' : 'border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]'}`}>
                                    {isRejected ? (
                                        <X className="h-10 w-10 text-rose-500" />
                                    ) : (
                                        <Activity className="h-10 w-10 text-cyan-400 animate-pulse" />
                                    )}
                                </div>
                            </div>

                            {/* Task Text Cycler */}
                            <div className="h-20 flex flex-col items-center justify-center overflow-hidden w-full relative mt-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={loadingTask}
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.1, y: -10 }}
                                        transition={{ duration: 0.3, ease: "anticipate" }}
                                        className="absolute text-center w-full"
                                    >
                                        <p className={`text-2xl font-bold tracking-wide text-center drop-shadow-md ${isRejected ? 'text-rose-400' : 'bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-cyan-300'}`}>
                                            {loadingTask}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* ProgressBar simulation */}
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
                                <div className={`h-full transition-all duration-[1200ms] ease-linear ${isRejected ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400'}`} style={{ width: `${progressPercent}%` }}></div>
                            </div>

                            {/* Try Again Button on Rejection */}
                            <AnimatePresence>
                                {isRejected && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-10"
                                    >
                                        <button
                                            onClick={() => {
                                                setIsAnalyzing(false);
                                                setIsRejected(false);
                                            }}
                                            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all shadow-lg backdrop-blur-md"
                                        >
                                            Return to Upload
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes spin3D {
                                0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
                                100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); }
                            }
                            @keyframes spin3DReverse {
                                0% { transform: rotateX(70deg) rotateY(360deg) rotateZ(0deg); }
                                100% { transform: rotateX(70deg) rotateY(0deg) rotateZ(360deg); }
                            }
                            @keyframes progress {
                                0% { transform: scaleX(0); }
                                100% { transform: scaleX(1); }
                            }
                            .perspective-1000 {
                                perspective: 1000px;
                            }
                        `}} />
                    </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
            {/* TOAST SYSTEM */}
            <Toast 
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />
        </React.Fragment>
    );
}
