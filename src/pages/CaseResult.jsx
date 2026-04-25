import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Loader2, AlertTriangle, CheckCircle, HelpCircle, Eye, EyeOff, Download, Share2, Printer, Activity, Mic, MicOff, BrainCircuit, BarChart, Bot, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../context/AuthContext';

export default function CaseResult() {
    const { user } = useAuth();
    const params = useParams();
    const id = params.id || 'temporary';
    const navigate = useNavigate();
    const location = useLocation();
    const temporaryData = location.state?.caseData;
    const [showGradCam, setShowGradCam] = useState(true);
    const [viewMode, setViewMode] = useState('original'); // 'original' or 'cutout'
    const [secureImages, setSecureImages] = useState({ base: null, gradcam: null, cutout: null });
    const [scrubberValue, setScrubberValue] = useState(50);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isDownloadingDicom, setIsDownloadingDicom] = useState(false);

    // Voice Dictation State
    const [notes, setNotes] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSavingValidation, setIsSavingValidation] = useState(false);
    const [showDenyConfirm, setShowDenyConfirm] = useState(false);

    // PDF Config Options
    const [pdfConfig, setPdfConfig] = useState({
        include_llm_context: true,
        include_severity_assessment: true,
        include_audit_trail: true,
        clinical_notes: ''
    });

    const { data: fetchedData, isLoading: isQueryLoading, error } = useQuery({
        queryKey: ['case', id],
        queryFn: async () => {
            if (id === 'temporary' && temporaryData) return temporaryData;
            const response = await api.get(`/cases/${id}`);
            return response.data;
        },
        enabled: !temporaryData
    });

    const caseData = temporaryData || fetchedData;
    const isLoading = isQueryLoading && !temporaryData;

    // Dynamic title: update once case data is available
    const caseTitle = caseData
        ? (id === 'temporary' ? 'Temporary Scan' : `Case #${id} — ${caseData.ai_result || 'Analysis'}`)
        : (id === 'temporary' ? 'Temporary Scan' : `Case #${id}`);
    usePageTitle(caseTitle);

    useEffect(() => {
        if (!caseData) return;

        const fetchSecureImage = async (path) => {
            if (!path) return null;
            if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:') || path.startsWith('/')) {
                return path;
            }
            try {
                const response = await api.get(`/cases/image/${path}`, { responseType: 'blob' });
                return URL.createObjectURL(response.data);
            } catch (err) {
                console.error("Failed to securely load image:", path, err);
                return null;
            }
        };

        const loadAllSecureImages = async () => {
            const base = await fetchSecureImage(caseData.image_path);
            const gradcam = await fetchSecureImage(caseData.gradcam_path);
            const cutout = await fetchSecureImage(caseData.cutout_path);
            setSecureImages({ base, gradcam, cutout });
        };

        loadAllSecureImages();
        
        return () => {
            if (secureImages.base) URL.revokeObjectURL(secureImages.base);
            if (secureImages.gradcam) URL.revokeObjectURL(secureImages.gradcam);
            if (secureImages.cutout) URL.revokeObjectURL(secureImages.cutout);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caseData]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-violet-100 dark:border-violet-900/30 rounded-full"></div>
                <div className="absolute top-0 w-16 h-16 border-4 border-violet-600 dark:border-violet-500 rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium animate-pulse">Retrieving detailed analysis...</p>
        </div>
    );

    if (error) return (
        <div className="text-center p-12 bg-rose-50 dark:bg-rose-900/20 rounded-3xl border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold">Error loading case</h3>
            <p>{error.message}</p>
        </div>
    );

    // Determine status color/icon
    const isPneumonia = caseData.ai_result === "PNEUMONIA DETECTED";
    const isInconclusive = caseData.ai_result === "INCONCLUSIVE";

    let statusColors = {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        text: "text-emerald-800 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800/50",
        iconBg: "bg-emerald-100 dark:bg-emerald-800/50",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        gradient: "from-emerald-500 to-teal-500"
    };
    let StatusIcon = CheckCircle;

    if (isPneumonia) {
        statusColors = {
            bg: "bg-rose-50 dark:bg-rose-950/30",
            text: "text-rose-800 dark:text-rose-300",
            border: "border-rose-200 dark:border-rose-800",
            iconBg: "bg-rose-100 dark:bg-rose-900",
            iconColor: "text-rose-600 dark:text-rose-400",
            gradient: "from-rose-500 to-red-600"
        };
        StatusIcon = AlertTriangle;
    } else if (isInconclusive) {
        statusColors = {
            bg: "bg-amber-50 dark:bg-amber-900/20",
            text: "text-amber-800 dark:text-amber-300",
            border: "border-amber-200 dark:border-amber-800/50",
            iconBg: "bg-amber-100 dark:bg-amber-800/50",
            iconColor: "text-amber-600 dark:text-amber-400",
            gradient: "from-amber-400 to-orange-500"
        };
        StatusIcon = HelpCircle;
    }

    // Genuine Backend XAI Metrics
    // Convert 0-1 values back into percentages
    const confScore = caseData.confidence_score != null ? (caseData.confidence_score * 100).toFixed(1) : "0.0";
    const healthScore = caseData.confidence_score != null ? ((1.0 - caseData.confidence_score) * 100).toFixed(1) : "0.0";
    const lungArea = caseData.lung_area_percentage != null ? caseData.lung_area_percentage.toFixed(1) : "N/A";
    const gatekeeper = caseData.gatekeeper_score != null ? (caseData.gatekeeper_score * 100).toFixed(1) : "N/A";

    const explainabilityMetrics = [
        { label: "Pneumonia Confidence", value: confScore, color: "bg-rose-500" },
        { label: "Healthy Lung Probability", value: healthScore, color: "bg-emerald-500" },
        { label: "Isolated Lung Territory", value: lungArea, color: "bg-violet-500" },
        { label: "Gatekeeper Validation", value: gatekeeper, color: "bg-blue-500" }
    ];



    const imageUrl = secureImages.base;
    const gradCamUrl = secureImages.gradcam;
    const cutoutUrl = secureImages.cutout;
    
    // Determine which base image to show
    const currentBaseImageUrl = (viewMode === 'cutout' && cutoutUrl) ? cutoutUrl : imageUrl;

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);
        try {
            const finalOptions = { ...pdfConfig, clinical_notes: notes };
            const response = await api.post(`/cases/${id}/generate-report`, finalOptions, {
                responseType: 'blob' // Important for binary data
            });

            // Create a blob from the PDF Stream
            const file = new Blob([response.data], { type: 'application/pdf' });

            // Create a link element, trigger download, and remove it
            const fileURL = URL.createObjectURL(file);
            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.setAttribute('download', `PNEUMOSCAN_Report_${caseData.patient?.patient_uid || id}.pdf`);
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // Clean up
            downloadLink.parentNode.removeChild(downloadLink);
            URL.revokeObjectURL(fileURL);
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            alert("Failed to generate PDF Report. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleAskAI = () => {
        const patientId = caseData.patient?.patient_uid || caseData.patient_id || "Unknown Patient";
        const promptParams = id === 'temporary' 
            ? `I am currently viewing a temporary Case for patient ${patientId}. The analysis resulted in a diagnosis of "${caseData.ai_result}" with a confidence score of ${(caseData.confidence_score * 100).toFixed(1)}%. Can you provide a clinical summary of what this means and suggest very general next steps?`
            : `I am currently viewing Case #${id} for patient ${patientId}. Can you provide a clinical summary of this specific scan and their history?`;

        navigate('/chat', {
            state: {
                autoPrompt: promptParams
            }
        });
    };

    const handleDownloadImage = async () => {
        setIsDownloadingDicom(true);
        try {
            // Priority: Heatmapped image (Grad-CAM) if available, otherwise original base image
            const downloadUrl = gradCamUrl || imageUrl;
            
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename based on what we're downloading
            const typeSuffix = gradCamUrl ? '_XAI' : '';
            const filename = `PNEUMOSCAN_${id}${typeSuffix}.png`;
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download image file.');
        } finally {
            setIsDownloadingDicom(false);
        }
    };

    const handleApproveValidation = async () => {
        if (id === 'temporary') return;
        setIsSavingValidation(true);
        try {
            await api.put(`/cases/${id}`, { 
                clinical_notes: notes,
                status: 'Validated'
            });
            alert("Case validated and approved successfully.");
            // Refetch to update status UI
            window.location.reload(); 
        } catch (err) {
            console.error("Approve Validation failed:", err);
            alert("Failed to approve validation.");
        } finally {
            setIsSavingValidation(false);
        }
    };

    const handleDenyValidation = async () => {
        if (id === 'temporary') return;
        setIsSavingValidation(true);
        try {
            await api.put(`/cases/${id}`, { 
                clinical_notes: notes,
                status: 'Denied'
            });
            setShowDenyConfirm(false);
            alert("Case flagged as Incorrect (Denied).");
            window.location.reload();
        } catch (err) {
            console.error("Deny Validation failed:", err);
            alert("Failed to deny validation.");
        } finally {
            setIsSavingValidation(false);
        }
    };

    // Voice Dictation Logic
    const toggleDictation = () => {
        if (isListening) {
            setIsListening(false);
            window.speechRecognitionInstance?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Dictation.");
            return;
        }

        const recognition = new SpeechRecognition();
        window.speechRecognitionInstance = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setNotes(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + finalTranscript);
            }
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 sm:p-8 rounded-3xl border ${statusColors.border} ${statusColors.bg} flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 relative overflow-hidden`}
            >
                <div className={`p-3 sm:p-4 rounded-2xl ${statusColors.iconBg} shadow-sm z-10 shrink-0`}>
                    <StatusIcon className={`h-8 w-8 sm:h-10 sm:w-10 ${statusColors.iconColor}`} />
                </div>
                <div className="z-10 flex-1 min-w-0">
                    <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${statusColors.text}`}>{caseData.ai_result}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white/60 dark:bg-slate-800/60 ${statusColors.text}`}>
                            Confidence Score
                        </span>
                        <span className={`text-xl font-bold ${statusColors.text}`}>
                            {(caseData.confidence_score * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 sm:gap-3 z-10 w-full md:w-auto">
                    <div className="relative group">
                        <button
                            onClick={caseData.is_demo ? undefined : handleAskAI}
                            disabled={caseData.is_demo}
                            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm ${
                                caseData.is_demo 
                                ? 'bg-violet-600/50 text-white/70 cursor-not-allowed border border-transparent' 
                                : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-md hover:-translate-y-0.5 border border-transparent'
                            }`}
                        >
                            <Bot className="h-4 w-4" />
                            <span className="hidden xs:inline">Ask </span>AI Assistant
                        </button>
                        {caseData.is_demo && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col items-center">
                                Register to unlock AI
                                <div className="absolute -bottom-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleGeneratePdf}
                        disabled={isGeneratingPdf || id === 'temporary'}
                        title={id === 'temporary' ? "Cannot export PDF for temporary scans" : "Export PDF Report"}
                        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm ${isGeneratingPdf || id === 'temporary'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {isGeneratingPdf ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /><span className="hidden sm:inline">Generating...</span></>
                        ) : (
                            <><Download className="h-4 w-4 text-violet-600 dark:text-violet-400" /><span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">PDF</span></>
                        )}
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600" title="Print">
                            <Printer className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${statusColors.gradient} opacity-10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3`}></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Image Viewer */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-4"
                >
                        <div className="relative aspect-[4/3] flex items-center justify-center bg-black overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <div className="relative max-h-full max-w-full flex items-center justify-center">
                                    {currentBaseImageUrl && (
                                        <motion.img
                                            key={viewMode === 'cutout' ? 'cutout' : 'original'}
                                            src={currentBaseImageUrl}
                                            alt="CXR Base"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="max-h-[75vh] sm:max-h-full max-w-full w-auto h-auto block pointer-events-none"
                                        />
                                    )}
                                    
                                    {showGradCam && gradCamUrl && (
                                        <motion.div
                                            key="heatmap-container"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 w-full h-full"
                                        >
                                            <img
                                                src={gradCamUrl}
                                                alt="Grad-CAM Overlay"
                                                className="w-full h-full object-fill pointer-events-none mix-blend-screen opacity-70"
                                                style={{ clipPath: `polygon(0 0, ${scrubberValue}% 0, ${scrubberValue}% 100%, 0 100%)` }}
                                            />

                                            {/* Scrubber Line — visible on all screens */}
                                            <div
                                                className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none z-10"
                                                style={{ left: `calc(${scrubberValue}% - 1px)` }}
                                            >
                                                <div className="absolute top-1/2 left-1/2 -ml-3 -mt-3 w-6 h-6 bg-white rounded-full shadow-lg hidden sm:flex items-center justify-center">
                                                    <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center gap-[1px]">
                                                        <div className="w-[1px] h-2 bg-slate-400"></div>
                                                        <div className="w-[1px] h-2 bg-slate-400"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Drag scrubber — desktop (invisible overlay) */}
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={scrubberValue}
                                                onChange={(e) => setScrubberValue(parseInt(e.target.value, 10))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 hidden sm:block"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </AnimatePresence>

                            {/* Overlay Controls */}
                            <div className="absolute top-4 right-4 flex gap-2 z-30 pointer-events-none">
                                <span className="bg-black/50 backdrop-blur-md text-white/80 text-xs px-3 py-1 rounded-full border border-white/10">
                                    {showGradCam ? 'Interactive Scrubber' : 'Standard View'}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-3 sm:p-4 bg-slate-900/90 backdrop-blur border-t border-slate-800 space-y-3">
                            {/* Mobile GradCAM slider — always visible on small screens */}
                            {showGradCam && gradCamUrl && (
                                <div className="sm:hidden flex items-center gap-3 px-1">
                                    <span className="text-xs text-slate-400 shrink-0">0%</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={scrubberValue}
                                        onChange={(e) => setScrubberValue(parseInt(e.target.value, 10))}
                                        className="flex-1 h-1.5 rounded-full accent-violet-500 cursor-pointer"
                                    />
                                    <span className="text-xs text-slate-400 shrink-0">100%</span>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setShowGradCam(!showGradCam)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${showGradCam
                                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                    >
                                        {showGradCam ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                        {showGradCam ? 'Heatmap On' : 'Show Heatmap'}
                                    </button>

                                    <button
                                        onClick={() => setViewMode(viewMode === 'original' ? 'cutout' : 'original')}
                                        disabled={!cutoutUrl}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${viewMode === 'cutout'
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <Activity className="h-3.5 w-3.5" />
                                        <span className="hidden xs:inline">{viewMode === 'cutout' ? 'Isolated View' : 'Original View'}</span>
                                        <span className="xs:hidden">{viewMode === 'cutout' ? 'Isolated' : 'Original'}</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleDownloadImage}
                                    disabled={isDownloadingDicom || id === 'temporary'}
                                    title={id === 'temporary' ? 'Not available for temporary scans' : 'Download high-fidelity diagnostic image'}
                                    className="flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">{isDownloadingDicom ? 'Downloading...' : (gradCamUrl ? 'Download High-Res XAI' : 'Download Original')}</span>
                                    <span className="sm:hidden">{isDownloadingDicom ? '...' : 'Download'}</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Legend */}
                    {showGradCam && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 text-sm shadow-soft transition-colors duration-300"
                        >
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-violet-500" />
                                Attention Map:
                            </span>
                            <div className="flex-1 w-full flex flex-col gap-1">
                                <div className="h-3 w-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-600 rounded-full"></div>
                                <div className="flex justify-between w-full text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    <span>Low Probability Area</span>
                                    <span>High Probability Area</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Sidebar Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
                            Case Details
                        </h3>
                        <dl className="space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                <dt className="text-slate-500 dark:text-slate-400">Case ID</dt>
                                <dd className="font-bold text-slate-800 dark:text-slate-200">{id === 'temporary' ? 'Temporary' : `#${caseData.id}`}</dd>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                <dt className="text-slate-500 dark:text-slate-400">Uploaded</dt>
                                <dd className="font-semibold text-slate-700 dark:text-slate-300">{new Date(caseData.uploaded_at).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                <dt className="text-slate-500 dark:text-slate-400">Uploaded By</dt>
                                <dd className="font-semibold text-slate-700 dark:text-slate-300">Dr. Smith (ID: {caseData.uploaded_by})</dd>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                <dt className="text-slate-500 dark:text-slate-400">Model Version</dt>
                                <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{caseData.model_version}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Explainable AI Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300 relative overflow-hidden"
                    >
                        {/* High-tech gradient background overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 pointer-events-none"></div>

                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-violet-500" />
                                Explainable AI (XAI)
                            </span>
                            <span className="text-xs font-mono bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded">DENSENET-121</span>
                        </h3>

                        <div className="space-y-5">
                            {explainabilityMetrics.map((metric, idx) => (
                                <div key={idx} className="relative z-10">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{metric.label}</span>
                                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{metric.value}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden border border-slate-200/50 dark:border-slate-600/50 shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1), ease: "easeOut" }}
                                            className={`h-2.5 rounded-full ${metric.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-1.5">
                                <BarChart className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 opacity-70" />
                                Statistics are derived from neural network feature activations. Higher percentages indicate stronger feature presence in the final classification layer.
                            </p>
                        </div>
                    </motion.div>

                    {/* Clinical Notes & Voice Dictation */}
                    <div className="relative group">
                        <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300 relative ${caseData.is_demo ? 'opacity-60 saturate-50' : ''}`}>
                            {caseData.is_demo && <div className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"></div>}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
                                    Clinical Notes
                                </h3>
                                <button
                                    onClick={toggleDictation}
                                    disabled={caseData.is_demo}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isListening
                                        ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} ${!caseData.is_demo && !isListening ? 'hover:bg-slate-200 dark:hover:bg-slate-600' : ''}`}
                                >
                                    {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                    {isListening ? 'Recording...' : 'Dictate'}
                                </button>
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={caseData.is_demo}
                                placeholder="Type or dictate clinical observations here... (These notes will be embedded into the final PDF report)"
                                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all resize-none shadow-inner"
                            ></textarea>

                            {(user?.role === 'admin' || user?.role === 'doctor') && id !== 'temporary' && caseData.status === 'Pending' && (
                                <div className="mt-4 flex flex-col gap-3">
                                    <button
                                        onClick={handleApproveValidation}
                                        disabled={isSavingValidation}
                                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSavingValidation ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                        Approve AI Analysis
                                    </button>
                                    <button
                                        onClick={() => setShowDenyConfirm(true)}
                                        disabled={isSavingValidation}
                                        className="w-full py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-bold text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShieldAlert className="h-4 w-4" />
                                        Deny (Model is Mistaken)
                                    </button>
                                </div>
                            )}

                            {/* Status indicator if already validated/denied */}
                            {caseData.status !== 'Pending' && id !== 'temporary' && (
                                <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${
                                    caseData.status === 'Validated' 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                                }`}>
                                    {caseData.status === 'Validated' ? <CheckCircle className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                                    <div className="text-sm font-bold">
                                        Clinical Oversight: {caseData.status === 'Validated' ? 'Approved' : 'Denied'}
                                        <p className="text-[10px] font-medium opacity-70 mt-0.5">Decision finalized in database</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {caseData.is_demo && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Sign in to save records
                            </div>
                        )}
                    </div>

                    {/* Deny Confirmation Modal */}
                    <AnimatePresence>
                        {showDenyConfirm && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowDenyConfirm(false)}
                                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Deny AI Validation?</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                        Are you sure the AI model is mistaken? Flagging this case as <strong>Denied</strong> will mark the model's output as incorrect for clinical auditing.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDenyConfirm(false)}
                                            className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDenyValidation}
                                            disabled={isSavingValidation}
                                            className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSavingValidation && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Yes, Deny
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setShowDenyConfirm(false)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Disclaimer */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 text-sm transition-colors duration-300">
                        <p className="font-semibold mb-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Clinical Note
                        </p>
                        <p className="opacity-90 leading-relaxed">
                            This AI analysis serves as a decision support tool. Final diagnosis should always be confirmed by a radiologist.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
