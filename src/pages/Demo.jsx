import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UploadCloud, FileImage, Sparkles, X, Activity, Info, FileWarning, ClipboardList, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';

// We use a high quality public domain chest x-ray for the demo
const DEMO_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chest_Xray_PA_3-8-2010.png/800px-Chest_Xray_PA_3-8-2010.png';

export default function DemoPage() {
    usePageTitle(null, 'Interactive Demo | PNEUMOSCAN AI');
    const [files, setFiles] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [isTemporary] = useState(true); // Demo is always temporary
    
    // Full-screen Loading States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [loadingTask, setLoadingTask] = useState('');
    const navigate = useNavigate();

    // Lock body scroll when analyzing
    useEffect(() => {
        if (isAnalyzing) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isAnalyzing]);

    // Fast-track demo file selection
    const loadDemoScan = () => {
        setFiles([{
            id: 'demo1',
            preview: DEMO_IMAGE_URL,
            status: 'pending'
        }]);
        setPatientId('DEMO-PT-001');
    };

    const removeFile = (id) => {
        setFiles([]);
        setPatientId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) return;

        setIsAnalyzing(true);
        setProgressPercent(0);

        const updateTask = async (msg, duration, progress) => {
            if (msg) setLoadingTask(msg);
            if (progress !== undefined) setProgressPercent(progress);
            if (duration) await new Promise(r => setTimeout(r, duration));
        };

        // Ultra-fast simulated workflow (total ~2.5s)
        await updateTask("Initializing Demo Sandbox...", 300, 10);
        await updateTask("Bypassing Network Protocols...", 300, 30);
        await updateTask(`Scanning DEMO-PT-001...`, 400, 50);
        await updateTask("Simulating Gatekeeper Validation...", 400, 70);
        await updateTask("Loading Pre-computed Radiomics...", 400, 85);
        await updateTask("Generating Heatmap...", 400, 95);
        await updateTask("Compiling Final Report...", 300, 100);
        
        setIsAnalyzing(false);

        // Fabricated case data
        const demoCaseData = {
            id: 9999,
            ai_result: "PNEUMONIA DETECTED",
            confidence_score: 0.88,
            lung_area_percentage: 42.1,
            gatekeeper_score: 0.99,
            patient: { patient_uid: "DEMO-PT-001" },
            patient_id: "DEMO-PT-001",
            uploaded_at: new Date().toISOString(),
            uploaded_by: "DemoUser",
            model_version: "v1.4.2-demo",
            report: "DEMO: Bilateral opacities identified. This is a pre-calculated demo result.",
            image_path: DEMO_IMAGE_URL,
            gradcam_path: DEMO_IMAGE_URL, // In demo, we just reuse the image or you can use a real heatmap URL if you have one
            cutout_path: ""
        };

        navigate(`/cases/temporary`, { state: { caseData: demoCaseData } });
    };

    return (
        <React.Fragment>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-6xl mx-auto space-y-8 relative z-10 pb-24"
            >
                <div className="text-center pt-8 sm:pt-12 mb-10">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400 text-sm font-bold mb-4 border border-fuchsia-200 dark:border-fuchsia-800 animate-pulse">
                            <Sparkles className="h-4 w-4" /> LIVE DEMO SANDBOX
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Try it Yourself</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
                            Experience the interface speed and analysis dashboard instantly. <br className="hidden sm:block"/> No real patient data is transmitted.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-fuchsia-500/5 border-2 border-fuchsia-500/20 dark:border-fuchsia-500/30 overflow-hidden relative transition-colors duration-300 p-8 md:p-10 flex flex-col justify-center h-full">
                            
                            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Simulated Patient ID</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={patientId}
                                            className="block w-full px-4 py-4 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 outline-none rounded-2xl text-lg opacity-70 cursor-not-allowed font-mono text-slate-600 dark:text-slate-400"
                                            placeholder="Auto-filled on selection"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Chest X-Ray Entry</label>

                                        <div
                                            onClick={files.length === 0 ? loadDemoScan : undefined}
                                            className={`relative group transition-all duration-300 ease-in-out border-3 border-dashed rounded-3xl ${files.length > 0 ? 'p-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-black w-full aspect-[4/3] sm:aspect-video cursor-default' : 'p-10 text-center cursor-pointer overflow-hidden border-fuchsia-300 dark:border-fuchsia-700 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/10'} `}
                                        >
                                            {files.length === 0 ? (
                                                <div className="py-6 flex flex-col items-center">
                                                    <div className="mx-auto w-20 h-20 bg-fuchsia-100 dark:bg-fuchsia-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-fuchsia-200 dark:group-hover:bg-fuchsia-800/50 transition-all duration-300 shadow-inner">
                                                        <FileImage className="h-10 w-10 text-fuchsia-600 dark:text-fuchsia-400" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                                        Click to Load Demo Scan
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                                                        Simulates a provider uploading a standard DICOM/PNG study.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-black/5 dark:bg-black/40">
                                                    <img src={files[0].preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30 blur-3xl z-0 scale-110" />
                                                    <img src={files[0].preview} alt="preview" className="w-full h-full object-contain relative z-10 p-2 drop-shadow-2xl" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeFile('demo1'); }}
                                                        className="absolute top-4 right-4 bg-rose-500 hover:bg-rose-600 p-2.5 rounded-full text-white shadow-xl hover:scale-110 transition-all z-40 backdrop-blur-md"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={files.length === 0}
                                        className="w-full py-4 px-6 rounded-2xl shadow-xl shadow-fuchsia-500/25 text-white text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-3"
                                    >
                                        <Sparkles className="h-6 w-6" /> Run Fast Simulation
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-fuchsia-50/50 dark:bg-slate-800/50 rounded-3xl p-8 border border-fuchsia-100 dark:border-slate-700 flex-1 flex flex-col justify-start space-y-8"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-6 w-6 text-fuchsia-500" />
                                    Demo Environment
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    This is a simulated sandbox. Actions taken here do not communicate with the true PNEUMOSCAN inference cluster.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                                        <Activity className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Instant Results</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            The actual platform resolves scans in ~3 seconds. This sandbox skips the queue and returns a pre-computed diagnosis.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                                        <ClipboardList className="h-5 w-5 text-violet-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Full Featured</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            You will be redirected to the genuine Case Result dashboard to experience the XAI Grad-CAM scrubber and tools.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {createPortal(
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[9999] bg-slate-900/90 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
                        >
                            <div className="max-w-md w-full px-6 flex flex-col items-center">
                                <div className="relative flex items-center justify-center w-64 h-64 perspective-1000">
                                    <div className="absolute w-32 h-32 rounded-full blur-[60px] opacity-40 bg-fuchsia-500 animate-pulse"></div>
                                    <div className="absolute w-full h-full border-[3px] rounded-full border-fuchsia-500/50" style={{ animation: 'spin3D 1.5s linear infinite', transformStyle: 'preserve-3d' }}></div>
                                    <div className="absolute w-56 h-56 border-[3px] transition-all rounded-full border-violet-400/60" style={{ animation: 'spin3DReverse 1s ease-in-out infinite', transformStyle: 'preserve-3d', animationDirection: 'alternate' }}></div>
                                    <div className="absolute w-44 h-44 border-[3px] border-dashed rounded-full border-cyan-400/80" style={{ animation: 'spin3D 2s linear infinite', transformStyle: 'preserve-3d' }}></div>

                                    <div className="z-10 bg-slate-800 rounded-full p-4 border shadow-xl border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                                        <Activity className="h-10 w-10 text-fuchsia-400 animate-pulse" />
                                    </div>
                                </div>

                                <div className="h-20 flex flex-col items-center justify-center overflow-hidden w-full relative mt-10">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={loadingTask}
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 1.1, y: -10 }}
                                            transition={{ duration: 0.2, ease: "linear" }}
                                            className="absolute text-center w-full"
                                        >
                                            <p className="text-2xl font-bold tracking-wide text-center drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-violet-400">
                                                {loadingTask}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
                                    <div className="h-full transition-all duration-[300ms] ease-linear bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400" style={{ width: `${progressPercent}%` }}></div>
                                </div>
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
                                .perspective-1000 {
                                    perspective: 1000px;
                                }
                            `}} />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </React.Fragment>
    );
}
