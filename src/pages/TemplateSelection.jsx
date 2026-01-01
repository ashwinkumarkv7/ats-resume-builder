import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import clsx from 'clsx';
import ResumePreview from '../components/ResumePreview';
import Button from '../components/Button';

const TemplateSelection = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);

    const templates = [
        {
            id: 'classic',
            name: 'Classic ATS',
            description: 'Traditional, standard format. Best for conservative industries like Finance, Law, and Healthcare. Highest ATS readability.',
            color: 'border-slate-400'
        },
        {
            id: 'modern',
            name: 'Modern Clean',
            description: 'Clean lines with subtle accents. Great for Tech, Startups, and Creative roles while keeping ATS compliance.',
            color: 'border-blue-500'
        },
        {
            id: 'minimal',
            name: 'Minimalist',
            description: 'Stripped back design focusing purely on content. Excellent for academic or executive roles.',
            color: 'border-gray-800'
        },
        {
            id: 'executive',
            name: 'Executive',
            description: 'A formal, serif-based template. Commands respect andAuthority. Perfect for Management, VP, and C-Suite roles.',
            color: 'border-slate-700'
        },
        {
            id: 'tech',
            name: 'Tech Specialist',
            description: 'Optimized for technical roles with highlighted skills and clear hierarchy. Monospace accents.',
            color: 'border-blue-700'
        },
        {
            id: 'simple',
            name: 'Simple & Quick',
            description: 'The safest bet for any Role. Maximum readability, zero clutter, 100% ATS proof.',
            color: 'border-green-600'
        },
        {
            id: 'creative',
            name: 'Creative Sidebar',
            description: 'Modern 2-column layout with a dark sidebar. Stands out in a stack of whites. Great for Designers.',
            color: 'border-slate-800'
        },
        {
            id: 'photo_centered',
            name: 'Profile Focused',
            description: 'Centers your profile picture and header. Personal and direct. Good for Customer Facing roles.',
            color: 'border-purple-600'
        }
    ];

    const mockData = {
        personal: {
            fullName: 'Alex Morgan',
            email: 'alex@example.com',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            phone: '(555) 123-4567',
            location: 'New York, NY',
            linkedin: 'linkedin.com/in/alexmorgan'
        },
        summary: 'Results-oriented Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable web applications.',
        experience: [
            {
                title: 'Senior Developer',
                company: 'Tech Corp',
                location: 'NY',
                startDate: '2020',
                endDate: 'Present',
                description: 'Led development of core platform features. Improved performance by 40%.'
            }
        ],
        education: [
            {
                school: 'State University',
                degree: 'BS Computer Science',
                year: '2019',
                location: 'NY'
            }
        ],
        skills: 'JavaScript, React, Node.js, Python, SQL, AWS, Docker'
    };

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleContinue = () => {
        if (selectedId) {
            navigate('/builder', { state: { templateId: selectedId } });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">Choose a Template</h1>
                            <p className="text-xs text-slate-500 hidden sm:block">All templates are ATS-Optimized</p>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        disabled={!selectedId}
                        onClick={handleContinue}
                        className="gap-2"
                    >
                        Use This Template <Check className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {templates.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => handleSelect(t.id)}
                                className={clsx(
                                    "group relative rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden bg-white hover:shadow-xl",
                                    selectedId === t.id
                                        ? `border-blue-600 ring-4 ring-blue-50`
                                        : "border-slate-200 hover:border-blue-300"
                                )}
                            >
                                {/* Selection Indicator */}
                                <div className={clsx(
                                    "absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                                    selectedId === t.id ? "bg-blue-600 text-white scale-100" : "bg-white border border-slate-200 text-slate-300 scale-90 group-hover:border-blue-400 group-hover:text-blue-400"
                                )}>
                                    <Check className="w-5 h-5" />
                                </div>

                                {/* Preview Area */}
                                <div className="bg-slate-100 p-4 flex justify-center items-start h-[300px] overflow-hidden relative">
                                    <div className="transform scale-[0.4] origin-top shadow-lg pointer-events-none select-none">
                                        <ResumePreview data={mockData} template={t.id} />
                                    </div>

                                    {/* Overlay Gradient */}
                                    <div className={clsx(
                                        "absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/10 pointer-events-none",
                                        selectedId === t.id ? "opacity-0" : "opacity-20 group-hover:opacity-0"
                                    )} />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                                        {t.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>

                                {/* Hover Prompt */}
                                <div className={clsx(
                                    "absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transform transition-transform duration-300",
                                    selectedId === t.id ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
                                )} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TemplateSelection;
