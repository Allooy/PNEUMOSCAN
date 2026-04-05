import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Loader2, AlertTriangle, CheckCircle, HelpCircle, Eye, EyeOff, Download, Share2, Printer, Activity, Mic, MicOff, BrainCircuit, BarChart, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CaseResult() {
    const { id } = useParams();
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

    useEffect(() => {
        if (!caseData) return;

        const fetchSecureImage = async (path) => {
            if (!path) return null;
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

    const handleDownloadDicom = async () => {
        setIsDownloadingDicom(true);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = caseData.image_path?.split('/').pop() || `PNEUMOSCAN_${id}.png`;
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
        <div className="space-y-8">
            {/* Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-3xl border ${statusColors.border} ${statusColors.bg} flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden`}
            >
                <div className={`p-4 rounded-2xl ${statusColors.iconBg} shadow-sm z-10`}>
                    <StatusIcon className={`h-10 w-10 ${statusColors.iconColor}`} />
                </div>
                <div className="z-10 flex-1">
                    <h1 className={`text-3xl font-bold tracking-tight ${statusColors.text}`}>{caseData.ai_result}</h1>
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
                <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto mt-4 md:mt-0">
                    <button
                        onClick={handleAskAI}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm bg-violet-600 hover:bg-violet-700 text-white hover:shadow-md hover:-translate-y-0.5 border border-transparent"
                    >
                        <Bot className="h-5 w-5" />
                        Ask AI Assistant
                    </button>
                    <button
                        onClick={handleGeneratePdf}
                        disabled={isGeneratingPdf || id === 'temporary'}
                        title={id === 'temporary' ? "Cannot export PDF for temporary scans" : "Export PDF Report"}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isGeneratingPdf || id === 'temporary'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {isGeneratingPdf ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                Export PDF Report
                            </>
                        )}
                    </button>
                    <div className="flex gap-2 justify-end">
                        <button className="p-2.5 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                            <Printer className="h-5 w-5" />
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
                    <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative group border border-slate-800">
                        {/* Image Combine */}
                        <div className="relative aspect-[4/3] flex items-center justify-center bg-black">
                            <AnimatePresence>
                                {currentBaseImageUrl && (
                                    <motion.img
                                        key="base-image"
                                        src={currentBaseImageUrl}
                                        alt="CXR Base"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 w-full h-full object-contain"
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
                                            className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-70 pointer-events-none"
                                            style={{ clipPath: `polygon(0 0, ${scrubberValue}% 0, ${scrubberValue}% 100%, 0 100%)` }}
                                        />

                                        {/* Scrubber Line */}
                                        <div
                                            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none z-10 hidden sm:block"
                                            style={{ left: `calc(${scrubberValue}% - 2px)` }}
                                        >
                                            <div className="absolute top-1/2 left-1/2 -ml-3 -mt-3 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center gap-[1px]">
                                                    <div className="w-[1px] h-2 bg-slate-400"></div>
                                                    <div className="w-[1px] h-2 bg-slate-400"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Invisible Range Input Slider */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={scrubberValue}
                                            onChange={(e) => setScrubberValue(parseInt(e.target.value, 10))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Overlay Controls */}
                            <div className="absolute top-4 right-4 flex gap-2 z-30 pointer-events-none">
                                <span className="bg-black/50 backdrop-blur-md text-white/80 text-xs px-3 py-1 rounded-full border border-white/10">
                                    {showGradCam ? 'Interactive Scrubber' : 'Standard View'}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-4 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowGradCam(!showGradCam)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${showGradCam
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {showGradCam ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    {showGradCam ? 'Heatmap Active' : 'Show Heatmap'}
                                </button>

                                <button
                                    onClick={() => setViewMode(viewMode === 'original' ? 'cutout' : 'original')}
                                    disabled={!cutoutUrl}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'cutout'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <Activity className="h-4 w-4" />
                                    {viewMode === 'cutout' ? 'Surgeon View (Isolated)' : 'Original X-Ray View'}
                                </button>
                            </div>
                            <button
                                onClick={handleDownloadDicom}
                                disabled={isDownloadingDicom || id === 'temporary'}
                                title={id === 'temporary' ? 'Not available for temporary scans' : 'Download original image file'}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Download className="h-4 w-4" />
                                {isDownloadingDicom ? 'Downloading...' : 'Download Image'}
                            </button>
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
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
                                Clinical Notes
                            </h3>
                            <button
                                onClick={toggleDictation}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isListening
                                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                {isListening ? 'Recording...' : 'Dictate'}
                            </button>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Type or dictate clinical observations here... (These notes will be embedded into the final PDF report)"
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all resize-none shadow-inner"
                        ></textarea>
                    </div>

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
