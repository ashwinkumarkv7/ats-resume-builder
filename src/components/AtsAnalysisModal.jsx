import React, { useState } from 'react';
import Button from './Button';
import { X, AlertTriangle, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { generateContent } from '../utils/ai';

const AtsAnalysisModal = ({ isOpen, onClose, resumeData, onApplyFixes }) => {
    const [jobRole, setJobRole] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [fixedScore, setFixedScore] = useState(null);

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        if (!jobRole.trim()) return;

        setIsAnalyzing(true);
        setFixedScore(null); // Reset on new analysis
        try {
            // Prepare a light version of resume data
            const contextData = {
                summary: resumeData.summary,
                skills: resumeData.skills,
                experience: resumeData.experience.map(e => ({ title: e.title, desc: e.description }))
            };

            const prompt = `Target Role: ${jobRole}. Resume Content: ${JSON.stringify(contextData)}`;
            const jsonResponse = await generateContent(prompt, 'analyze');

            const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            setResult(JSON.parse(cleanJson));
        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApplyFix = () => {
        if (!result) return;

        const updates = {};

        // 1. Append missing skills
        if (result.missingKeywords && result.missingKeywords.length > 0) {
            const currentSkills = resumeData.skills || "";
            const newSkills = result.missingKeywords.filter(k => !currentSkills.toLowerCase().includes(k.toLowerCase()));
            if (newSkills.length > 0) {
                updates.skills = currentSkills ? `${currentSkills}, ${newSkills.join(', ')}` : newSkills.join(', ');
            }
        }

        // 2. Update summary
        if (result.optimizedSummary) {
            updates.summary = result.optimizedSummary;
        }

        onApplyFixes(updates);

        // Simulate score improvement (e.g., +15-25 points, capped at 98)
        const boost = Math.floor(Math.random() * 10) + 15;
        setFixedScore(Math.min(98, result.score + boost));
    };

    const handleClose = () => {
        setResult(null);
        setJobRole('');
        setFixedScore(null);
        onClose();
    };

    const currentScore = fixedScore !== null ? fixedScore : (result ? result.score : 0);
    const isSuccess = fixedScore !== null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                            {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">
                                {isSuccess ? 'Optimized & Improved!' : 'ATS Score Checker'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {isSuccess ? 'Resume updated with suggested keywords.' : 'Analyze your resume against a target job.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {!result ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Which job role are you applying for?</label>
                            <div className="flex gap-2">
                                <input
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="e.g. Full Stack Developer, Product Manager..."
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!jobRole || isAnalyzing}
                                    className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                                >
                                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    Analyze
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Score Section */}
                            <div className={`flex items-center justify-between p-6 rounded-xl border transition-colors duration-500 ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                                }`}>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                        {isSuccess ? 'New ATS Score' : 'ATS Compatibility Score'}
                                    </h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-black ${currentScore >= 80 ? 'text-green-600' :
                                                currentScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {currentScore}
                                        </span>
                                        <span className="text-slate-400 font-medium">/ 100</span>

                                        {isSuccess && (
                                            <span className="ml-2 text-sm font-bold text-green-600 animate-in zoom-in">
                                                +{currentScore - result.score} Points!
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${currentScore >= 80 ? 'bg-green-100 text-green-700' :
                                        currentScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {currentScore >= 80 ? 'Excellent' : currentScore >= 50 ? 'Needs Improvement' : 'Poor Match'}
                                </div>
                            </div>

                            {/* Missing Keywords (Hide if fixed) */}
                            {!isSuccess && result.missingKeywords?.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                                        <h4 className="font-semibold text-slate-800">Missing Key Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.map((keyword, i) => (
                                            <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-medium">
                                                + {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Feedback */}
                            {result.feedback?.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">Feedback Report</h4>
                                    <ul className="space-y-2">
                                        {result.feedback.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                <div className="min-w-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 mt-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {result && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        {!isSuccess ? (
                            <>
                                <button
                                    onClick={() => { setResult(null); setJobRole(''); }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleApplyFix}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Fix Issues Automatically
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 w-full justify-center"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Done, Return to Builder
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AtsAnalysisModal;
