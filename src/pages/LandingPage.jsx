import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { CheckCircle, AlertCircle, ArrowRight, XCircle, FileText } from 'lucide-react'; // Removing FileCheck, adding FileText as fallback
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: AI-Powered ATS Scoring
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
                        Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ATS-Friendly Resumes</span> That Actually Get Your Shortlisted
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop getting rejected by robots. Our strict ATS-compliant builder ensures your resume passes automated screening systems every time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link to="/dashboard">
                            <Button variant="gradient" className="h-14 px-8 text-lg w-full sm:w-auto">
                                Build Resume Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/#how-it-works">

                            <Button variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto">
                                View Sample Score
                            </Button>
                        </Link>
                    </div>

                    {/* Hero Visual - ATS Score Card */}
                    <div className="relative max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
                        <div className="p-8 grid md:grid-cols-2 gap-8 items-center text-left">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-50">
                                        <span className="text-2xl font-bold text-green-700">92%</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">ATS Match Score</h3>
                                        <p className="text-green-600 font-medium">Excellent probability</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>Keywords matched: <strong>React, TypeScript, AWS</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>Formatting: <strong>Clean, Single Column</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        <span>Suggestion: Add more action verbs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Analysis</p>
                                    <p className="text-sm text-slate-700">
                                        Your resume structure is perfect for ATS. The content is clear and includes relevant keywords for "Senior Frontend Developer".
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Steps */}
            <section id="how-it-works" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-lg text-slate-600">Three simple steps to your dream job interview.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FileText className="w-8 h-8 text-blue-600" />,
                                title: "1. Build in Strict Mode",
                                desc: "Create your resume using our single-column, no-nonsense builder that enforces ATS rules automatically."
                            },
                            {
                                icon: <CheckCircle className="w-8 h-8 text-indigo-600" />, // Replaced FileCheck
                                title: "2. Check ATS Score",
                                desc: "Paste the job description to get a real-time match score and keyword gaps analysis."
                            },
                            {
                                icon: <ArrowRight className="w-8 h-8 text-green-600" />,
                                title: "3. Export & Apply",
                                desc: "Download a clean PDF or DOCX that parses perfectly in every applicant tracking system."
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why standard 'pretty' resumes fail</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Columns confuse parsers</h4>
                                        <p className="text-slate-600 mt-1">ATS reads left-to-right. Columns mix up your work history and skills.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Graphics are invisible</h4>
                                        <p className="text-slate-600 mt-1">Skills shown as progress bars or icons are ignored completely.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Our Solution</h4>
                                        <p className="text-slate-600 mt-1">We enforce a standardized, text-first format that guarantees 100% readability by any system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-2xl transform rotate-3 scale-95 opacity-70"></div>
                            <img
                                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2070"
                                alt="Resume checking"
                                className="relative rounded-2xl shadow-xl border border-slate-200 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing is unchanged */}
            {/* ... keeping simplified for brevity in this replace call, wait I need to keep the whole file? Yes. */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-16">Simple Pricing</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                            <h3 className="text-xl font-semibold mb-2">Free Starter</h3>
                            <div className="text-3xl font-bold mb-6">₹0</div>
                            <ul className="space-y-4 text-slate-300 text-left mb-8">
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-400" /> 1 ATS-Friendly Resume</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-400" /> 1 AI Score Check</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-400" /> PDF Export (Watermarked)</li>
                            </ul>
                            <Button variant="secondary" className="w-full bg-slate-700 text-white border-slate-600 hover:bg-slate-600">Start Free</Button>
                        </div>
                        <div className="bg-gradient-to-b from-blue-900 to-slate-900 p-8 rounded-2xl border border-blue-500 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">Recommended</div>
                            <h3 className="text-xl font-semibold mb-2">Pro Career</h3>
                            <div className="text-3xl font-bold mb-6">₹299 <span className="text-lg font-normal text-slate-400">/ lifetime</span></div>
                            <ul className="space-y-4 text-slate-300 text-left mb-8">
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Unlimited Resumes</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Unlimited ATS Checks</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Advanced AI Improvements</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> PDF & DOCX (No Watermark)</li>
                            </ul>
                            <Button variant="primary" className="w-full shadow-blue-900/50">Upgrade Now</Button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
                    <p>© 2024 ATS Resume Builder. Built with precision.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
