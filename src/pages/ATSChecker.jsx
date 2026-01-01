import { useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

const ATSChecker = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                score: 72,
                missingKeywords: ['Agile', 'Docker', 'Kubernetes'],
                formattingIssues: ['Found 2 columns in header (fixed auto-converted)'],
                suggestions: [
                    'Include specific metrics in your experience (e.g. "Improved performance by 20%")',
                    'Add "Docker" to your skills section to match JD.'
                ]
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">ATS Resume Checker</h1>
                    <p className="text-slate-600 mt-2">Paste your Job Description and Resume content to get a match score.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                        <textarea
                            className="w-full h-64 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Paste the job description here..."
                        ></textarea>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Content</label>
                        <textarea
                            className="w-full h-64 p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Paste your resume text here (or select from dashboard)"
                        ></textarea>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <Button
                        variant="primary"
                        size="lg"
                        className="px-8 py-4 text-lg w-full sm:w-auto min-w-[200px]"
                        onClick={handleAnalyze}
                        disabled={analyzing}
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            "Check Score"
                        )}
                    </Button>
                </div>

                {/* Results */}
                {result && (
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Analysis Results</h2>
                                <div className="text-3xl font-bold text-yellow-500">{result.score}% <span className="text-sm font-normal text-slate-400">Match score</span></div>
                            </div>

                            <div className="p-8 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-4">
                                        <XCircle className="w-5 h-5" /> Missing Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.map(kw => (
                                            <span key={kw} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-yellow-600 flex items-center gap-2 mb-4">
                                        <AlertTriangle className="w-5 h-5" /> Improve These
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.suggestions.map((sug, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                                                {sug}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
                                <p className="text-slate-600 mb-4">Want to reach 100%? Use our AI Rewriter.</p>
                                <Button variant="gradient">Fix My Resume with AI</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ATSChecker;
