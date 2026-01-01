import { FileText, Plus, BarChart2, Download, MoreVertical, Crown, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { getUserResumes } from '../utils/db';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userResumes = await getUserResumes(currentUser.uid);
                    setResumes(userResumes);
                } catch (error) {
                    console.error("Error fetching resumes:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleEdit = (resume) => {
        navigate('/builder', { state: { resumeId: resume.id } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Dashboard Header */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">Dashboard</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">Free Plan</span>
                            <Button variant="gradient" className="h-9 px-4 text-sm gap-2">
                                <Crown className="w-4 h-4" /> Upgrade Pro
                            </Button>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Stats / Welcome */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.displayName || 'User'}</h1>
                    <p className="text-slate-500 mt-1">Here is how your resumes are performing.</p>
                </div>

                {/* Resume Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card */}
                    <Link to="/builder" className="group">
                        <div className="h-full min-h-[200px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-500 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer p-6">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Create New Resume</h3>
                            <p className="text-sm text-slate-500 mt-1">Start from scratch with ATS rules</p>
                        </div>
                    </Link>

                    {/* Resume Cards */}
                    {resumes.map((resume) => (
                        <div key={resume.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <FileText className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="font-semibold text-slate-900 truncate">{resume.title || 'Untitled Resume'}</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Edited {resume.updatedAt?.seconds ? new Date(resume.updatedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                </p>

                                <div className="mt-6 flex items-center gap-3">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${resume.progress >= 80 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                        <BarChart2 className="w-3 h-3" />
                                        Progress: {resume.progress || 0}%
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
                                <button
                                    onClick={() => handleEdit(resume)}
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600"
                                >
                                    Edit
                                </button>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
