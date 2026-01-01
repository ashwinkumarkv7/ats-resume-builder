import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, ChevronLeft, Save, Eye, Sparkles, Upload, ZoomIn, ZoomOut, Maximize, Wand2, X, Check, Loader2, Download, FileText } from 'lucide-react';
import Button from '../components/Button';
import ResumePreview from '../components/ResumePreview';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/canvasUtils';
import { generateContent } from '../utils/ai';
import { auth } from '../firebase';
import { createResume, updateResume, getResumeById } from '../utils/db';
import { exportToPdf, exportToDocx } from '../utils/export';
import AtsAnalysisModal from '../components/AtsAnalysisModal';

const SECTION_STEPS = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
];

const ResumeBuilder = () => {
    const location = useLocation();
    const [activeStep, setActiveStep] = useState(0);
    const [showPreviewMobile, setShowPreviewMobile] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(location.state?.templateId || 'classic');
    const [zoom, setZoom] = useState(0.8);

    // Crop State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [cropZoom, setCropZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);

    // AI State
    const [isGenerating, setIsGenerating] = useState(false);

    // Helper to handle AI generation
    // Helper to handle AI generation
    const handleAiGenerate = async (field, type = 'improve', index = null) => {
        setIsGenerating(true);
        try {
            const currentContent = index !== null
                ? watch(`experience.${index}.description`)
                : watch('summary');

            let finalType = type;
            let prompt = "";

            if (index !== null) {
                // Experience Section Logic
                const title = watch(`experience.${index}.title`);
                const company = watch(`experience.${index}.company`);

                if (!title) {
                    alert("Please enter a Job Title first to generate responsibilities.");
                    setIsGenerating(false);
                    return;
                }

                finalType = 'responsibilities'; // Force bullet point mode

                if (currentContent) {
                    prompt = `Role: ${title}. refine and format these responsibilities into distinct bullet points: "${currentContent}"`;
                } else {
                    prompt = `Role: ${title} ${company ? 'at ' + company : ''}. Generate key professional responsibilities.`;
                }

            } else {
                // Summary Logic
                if (!currentContent) {
                    alert("Please enter some text first for the AI to improve.");
                    setIsGenerating(false);
                    return;
                }
                prompt = `Name: ${watch('personal.fullName') || 'Candidate'}. Task: Write a professional summary based on: "${currentContent}"`;
            }

            const improvedContent = await generateContent(prompt, finalType);

            if (index !== null) {
                setValue(`experience.${index}.description`, improvedContent);
            } else {
                setValue('summary', improvedContent);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    // Initial Resume State
    const { register, control, watch, handleSubmit, setValue } = useForm({
        defaultValues: {
            title: 'Untitled Resume',
            personal: { fullName: '', email: '', phone: '', linkedin: '', location: '' },
            summary: '',
            experience: [
                { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
            ],
            education: [
                { degree: '', school: '', location: '', year: '' }
            ],
            skills: '' // Comma separated
        }
    });

    const resumeData = watch();

    const sections = [
        // ... Form Components mapped to steps
    ];

    // DB & Auth State
    const { user } = auth; // Direct access or use a hook if available
    const [resumeId, setResumeId] = useState(location.state?.resumeId || null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const navigate = useNavigate();

    // Load existing resume if editing
    useEffect(() => {
        const loadResume = async () => {
            if (resumeId) {
                try {
                    const data = await getResumeById(resumeId);
                    // Reset form with fetched data
                    // Ensure dates/arrays are correctly formatted if needed
                    setValue('title', data.title);
                    setValue('personal', data.personal);
                    setValue('summary', data.summary);
                    setValue('experience', data.experience || []);
                    setValue('education', data.education || []);
                    setValue('skills', data.skills);
                    if (data.personal?.photo) setImageSrc(data.personal.photo);
                    setSelectedTemplate(data.templateId || 'classic');
                } catch (error) {
                    console.error("Failed to load resume", error);
                    // Handle error (e.g. redirect or show toast)
                }
            }
        };
        loadResume();
    }, [resumeId, setValue]);

    // Progress Calculation
    const calculateProgress = () => {
        const data = watch();
        let score = 0;
        let total = 0;

        // Personal (Weight: 20)
        total += 5; // Name, Email, Phone, Linkedin, Location
        if (data.personal?.fullName) score++;
        if (data.personal?.email) score++;
        if (data.personal?.phone) score++;
        if (data.personal?.linkedin) score++;
        if (data.personal?.location) score++;

        // Summary (Weight: 15)
        total += 1;
        if (data.summary?.length > 20) score++;

        // Experience (Weight: 30)
        total += 3; // At least one exp with title, company, desc
        if (data.experience?.length > 0) {
            if (data.experience[0].title) score++;
            if (data.experience[0].company) score++;
            if (data.experience[0].description) score++;
        }

        // Education (Weight: 20)
        total += 2; // At least one edu with school, degree
        if (data.education?.length > 0) {
            if (data.education[0].school) score++;
            if (data.education[0].degree) score++;
        }

        // Skills (Weight: 15)
        total += 1;
        if (data.skills?.length > 10) score++;

        return Math.round((score / total) * 100);
    };

    const progress = calculateProgress();

    // Save Logic
    const handleSave = async (silent = false) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            if (!silent) alert("Session expired. Please log in again.");
            return;
        }

        setIsSaving(true);

        try {
            const formData = watch();

            // Check content size
            // Default to null if no photo exists or if it is explicitly undefined (Firestore throws error on undefined)
            let photo = formData.personal?.photo || null;

            if (photo && photo.length > 950000) {
                if (!silent) alert("Image is still too large for the database limit. Please re-upload or crop it again.");
                photo = null;
            }

            const payload = {
                ...formData,
                personal: {
                    ...(formData.personal || {}),
                    photo: photo
                },
                templateId: selectedTemplate,
                progress: calculateProgress(),
            };

            // Wrap the specific db call
            const performSave = async () => {
                if (resumeId) {
                    await updateResume(resumeId, payload);
                } else {
                    const newDoc = await createResume(currentUser.uid, payload);
                    setResumeId(newDoc.id);
                    // Update URL state so refresh works!
                    navigate('/builder', { state: { resumeId: newDoc.id }, replace: true });
                }
            };

            // 15s Timeout
            await Promise.race([
                performSave(),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Network slow or unreachable. Check connection.")), 15000))
            ]);

            setLastSaved(new Date());
        } catch (error) {
            console.error("Save Error:", error);
            if (!silent) alert(`Save Failed: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const nextStep = async () => {
        await handleSave(true); // Auto-save
        setActiveStep((prev) => Math.min(prev + 1, SECTION_STEPS.length - 1));
    };
    const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setValue('personal.photo', croppedImage);
            setIsCropModalOpen(false);
            // Reset crop state
            setCrop({ x: 0, y: 0 });
            setCropZoom(1);
        } catch (e) {
            console.error(e);
        }
    };

    const cancelCrop = () => {
        setIsCropModalOpen(false);
        setImageSrc(null);
    };

    // --- Export Logic ---
    const [isExporting, setIsExporting] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showAtsModal, setShowAtsModal] = useState(false);

    const handleExport = async (type) => {
        setIsExporting(true);
        setShowExportDropdown(false);
        try {
            const data = watch();
            const filename = (data.title || 'Resume').replace(/\s+/g, '_');

            if (type === 'pdf') {
                await exportToPdf(`${filename}.pdf`);
            } else if (type === 'docx') {
                await exportToDocx(data, `${filename}.docx`);
            }
        } catch (error) {
            alert(`Export Failed: ${error.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    // ATS Fix Callback
    const handleApplyAtsFixes = (updates) => {
        if (updates.summary) setValue('summary', updates.summary);
        if (updates.skills) setValue('skills', updates.skills);
        // Optionally show toast or alert
        alert("Applied ATS optimizations successfully!");
    };

    // Template Options
    const [generatedNames, setGeneratedNames] = useState([]);
    const [showNameDropdown, setShowNameDropdown] = useState(false);

    const suggestATSFilename = () => {
        const data = watch();
        const name = data.personal.fullName;
        if (!name) {
            alert("Please enter your Full Name in the Personal Info section first.");
            return;
        }

        const sanitize = (text) => (text || '').trim().replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

        const sanitizedName = sanitize(name);

        // Data Extraction
        const rawRole = data.experience?.[0]?.title;
        const rawCompany = data.experience?.[0]?.company;
        const rawDegree = data.education?.[0]?.degree;

        const role = rawRole ? sanitize(rawRole) : null;
        const company = rawCompany ? sanitize(rawCompany) : null;
        const degree = rawDegree ? sanitize(rawDegree) : null;

        // Calculate Experience
        let experienceStr = null;
        if (data.experience && data.experience.length > 0) {
            const startDates = data.experience.map(e => new Date(e.startDate).getFullYear()).filter(d => !isNaN(d));
            if (startDates.length > 0) {
                const minYear = Math.min(...startDates);
                const currentYear = new Date().getFullYear();
                const years = Math.max(0, currentYear - minYear);
                if (years > 0) {
                    experienceStr = `${Math.round(years)}Y_Experience`;
                }
            }
        }

        const options = [];

        // 1. Always available if name is there
        options.push(`${sanitizedName}_Resume`);

        // 2. Role based (only if role exists)
        if (role) {
            options.push(`${sanitizedName}_${role}_Resume`);
        }

        // 3. Role + Company (only if both exist)
        if (role && company) {
            options.push(`${sanitizedName}_${role}_${company}`);
        }

        // 4. Role + Experience (only if role and experience years exist)
        if (role && experienceStr) {
            options.push(`${sanitizedName}_${role}_${experienceStr}`);
        }

        // 5. Qualification based (only if degree exists)
        if (degree) {
            options.push(`${sanitizedName}_${degree}_Resume`);
        }

        setGeneratedNames(options);
        setShowNameDropdown(true);
    };

    const templates = [
        { id: 'classic', name: 'Classic' },
        { id: 'modern', name: 'Modern' },
        { id: 'minimal', name: 'Minimal' },
        { id: 'executive', name: 'Executive' },
        { id: 'tech', name: 'Tech' },
        { id: 'simple', name: 'Simple' },
        { id: 'creative', name: 'Creative' },
        { id: 'photo_centered', name: 'Profile' }
    ];

    return (
        <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
            {/* Builder Header */}
            <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <input
                        {...register('title')}
                        className="font-bold text-slate-800 text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none transition-colors px-1 -ml-1 w-64"
                    />
                    <div className="relative">
                        <button
                            onClick={suggestATSFilename}
                            className="p-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                            title="Auto-generate ATS Friendly Filename (Recommended after completion)"
                        >
                            <Wand2 className="w-4 h-4" />
                        </button>

                        {showNameDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <span className="text-xs font-semibold text-slate-500">Select Filename Format</span>
                                    <button onClick={() => setShowNameDropdown(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {generatedNames.map((name, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setValue('title', name);
                                                setShowNameDropdown(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors truncate"
                                            title={name}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ATS Check Button */}
                    <button
                        onClick={() => setShowAtsModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 ml-4"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Check Score
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="hidden lg:flex flex-col w-32 gap-1">
                    <div className="flex justify-between text-[10px] font-medium text-slate-500">
                        <span>Completeness</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Template Selector */}
                <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    {templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={clsx(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                selectedTemplate === t.id
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="md:hidden" onClick={() => setShowPreviewMobile(!showPreviewMobile)}>
                        <Eye className="w-4 h-4 mr-2" /> {showPreviewMobile ? 'Edit' : 'Preview'}
                    </Button>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                            onClick={() => setShowExportDropdown(!showExportDropdown)}
                            disabled={isExporting}
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Export
                        </Button>

                        {showExportDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                                >
                                    <FileText className="w-4 h-4 text-red-500" />
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    onClick={() => handleExport('docx')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                                >
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span>Download Word (DOCX)</span>
                                </button>
                            </div>
                        )}
                        {/* Close dropdown when clicking outside (handled simply by overlay or user action in React usually, sticking to simple toggle here for brevity) */}
                    </div>

                    <div className="flex flex-col items-end">
                        <Button variant="primary" size="sm" className="gap-2" onClick={() => handleSave(false)} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        {lastSaved && <span className="text-[10px] text-slate-400 mt-0.5">Saved {lastSaved.toLocaleTimeString()}</span>}
                    </div>
                </div>
            </header >

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Form */}
                <div className={clsx(
                    "w-full md:w-1/2 bg-white border-r border-slate-200 flex flex-col h-full transition-all",
                    showPreviewMobile ? "hidden md:flex" : "flex"
                )}>
                    {/* Step Indicator */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 overflow-x-auto">
                        <div className="flex items-center gap-2 min-w-max">
                            {SECTION_STEPS.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(idx)}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                        activeStep === idx ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                    )}
                                >
                                    {step.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">{SECTION_STEPS[activeStep].label}</h2>

                        {activeStep === 0 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        {watch('personal.photo') && (
                                            <img src={watch('personal.photo')} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                                        )}
                                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-600 transition-colors">
                                            <Upload className="w-4 h-4" />
                                            <span>Upload Photo</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                        {watch('personal.photo') && (
                                            <button onClick={() => setValue('personal.photo', '')} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Recommended for Creative and Modern templates only.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input {...register('personal.fullName')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input {...register('personal.email')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                        <input {...register('personal.phone')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 9876543210" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                                        <input {...register('personal.linkedin')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                        <input {...register('personal.location')} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, Country" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeStep === 1 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary</label>
                                <textarea
                                    {...register('summary')}
                                    className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Write 2-3 sentences about your experience and top skills..."
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-slate-500">ATS Tip: Include keywords here.</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-xs text-blue-600 h-8 gap-1"
                                        onClick={() => handleAiGenerate('summary', 'summary')}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        {isGenerating ? 'Writing...' : 'Rewrite with AI'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeStep === 2 && (
                            <ExperienceForm
                                register={register}
                                control={control}
                                handleAiGenerate={handleAiGenerate}
                                isGenerating={isGenerating}
                                setValue={setValue}
                                watch={watch}
                            />
                        )}

                        {activeStep === 3 && (
                            <EducationForm register={register} control={control} />
                        )}

                        {activeStep === 4 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
                                <textarea
                                    {...register('skills')}
                                    className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Java, Python, React, Project Management..."
                                />
                                <p className="text-xs text-slate-500 mt-2">Enter skills separated by commas. Do not use ratings or bars.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Nav */}
                    <div className="p-4 border-t border-slate-200 flex justify-between bg-white mt-auto">
                        <Button variant="ghost" onClick={prevStep} disabled={activeStep === 0}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <Button variant="primary" onClick={nextStep} disabled={activeStep === SECTION_STEPS.length - 1}>
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className={clsx(
                    "flex-1 bg-slate-200/50 relative flex flex-col h-full overflow-hidden",
                    showPreviewMobile ? "flex" : "hidden md:flex"
                )}>
                    {/* Zoom Controls */}
                    <div className="absolute bottom-6 right-6 z-20 flex gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-slate-200">
                        <button onClick={() => setZoom(prev => Math.max(0.3, prev - 0.1))} className="p-2 hover:bg-slate-100 rounded text-slate-700 transition-colors" title="Zoom Out">
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <span className="flex items-center text-xs font-mono font-medium text-slate-500 w-12 justify-center border-l border-r border-slate-100 mx-1">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))} className="p-2 hover:bg-slate-100 rounded text-slate-700 transition-colors" title="Zoom In">
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button onClick={() => setZoom(0.8)} className="p-2 hover:bg-blue-50 text-blue-600 rounded ml-1 transition-colors" title="Fit to Screen">
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Preview Wrapper */}
                    <div className="flex-1 overflow-auto flex justify-center p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                        <div
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top center',
                                transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }}
                            className="shadow-2xl"
                        >
                            <ResumePreview data={resumeData} template={selectedTemplate} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Crop Modal */}
            {
                isCropModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[500px]">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Adjust Photo</h3>
                                <button onClick={cancelCrop} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative flex-1 bg-slate-100">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={cropZoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setCropZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-slate-500">Zoom</span>
                                    <input
                                        type="range"
                                        value={cropZoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setCropZoom(e.target.value)}
                                        className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={cancelCrop} className="flex-1 justify-center">
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleSaveCrop} className="flex-1 justify-center gap-2">
                                        <Check className="w-4 h-4" /> Save Photo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ATS Analysis Modal */}
            <AtsAnalysisModal
                isOpen={showAtsModal}
                onClose={() => setShowAtsModal(false)}
                resumeData={resumeData}
                onApplyFixes={handleApplyAtsFixes}
            />
        </div >
    );
};

// Sub-components for dynamic fields
// Sub-components for dynamic fields
// Sub-components for dynamic fields
const ExperienceForm = ({ register, control, handleAiGenerate, isGenerating, setValue, watch }) => {
    const { fields, append, remove } = useFieldArray({ control, name: "experience" });
    const experienceData = watch('experience'); // Subscribe to changes to update button text

    const handleBulletKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const textarea = e.target;
            const { selectionStart, selectionEnd, value } = textarea;

            // Insert newline and bullet
            const newValue = value.substring(0, selectionStart) + "\n• " + value.substring(selectionEnd);

            // Update form
            setValue(`experience.${index}.description`, newValue);

            // Fix cursor position
            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = selectionStart + 3; // \n • space
            });
        }
    };

    return (
        <div className="space-y-6">
            {fields.map((field, index) => {
                const hasContent = experienceData?.[index]?.description;
                const hasTitle = experienceData?.[index]?.title;

                return (
                    <div key={field.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="flex justify-between mb-4">
                            <h4 className="font-semibold text-sm">Experience #{index + 1}</h4>
                            <button type="button" onClick={() => remove(index)} className="text-red-500 text-xs hover:underline">Remove</button>
                        </div>
                        <div className="space-y-3">
                            <input {...register(`experience.${index}.title`)} placeholder="Job Title" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                            <input {...register(`experience.${index}.company`)} placeholder="Company" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                            <div className="grid grid-cols-2 gap-2">
                                <input {...register(`experience.${index}.startDate`)} placeholder="Start Date (MM/YYYY)" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                                <input {...register(`experience.${index}.endDate`)} placeholder="End Date (MM/YYYY)" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                            </div>
                            <div className="relative">
                                <textarea
                                    {...register(`experience.${index}.description`)}
                                    onKeyDown={(e) => handleBulletKeyDown(e, index)}
                                    placeholder="Responsibilities (Bulleted)... Press Enter for new bullet."
                                    className="w-full h-32 px-3 py-2 text-sm border border-slate-300 rounded resize-none font-mono"
                                />
                                <button
                                    type="button"
                                    className={clsx(
                                        "absolute bottom-2 right-2 text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-colors border shadow-sm",
                                        hasContent
                                            ? "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200"
                                            : "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
                                    )}
                                    onClick={() => handleAiGenerate('experience', 'responsibilities', index)}
                                    disabled={isGenerating}
                                    title={hasContent ? "Refine existing text into bullets" : "Generate responsibilities from Job Title"}
                                >
                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : (hasContent ? <Sparkles className="w-3 h-3" /> : <Wand2 className="w-3 h-3" />)}
                                    {isGenerating ? 'Working...' : (hasContent ? 'Enhance & Format' : 'Generate Responsibilities')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
            <Button variant="secondary" type="button" onClick={() => append({ title: '', company: '', description: '' })} className="w-full">
                + Add Position
            </Button>
        </div>
    );
};

const EducationForm = ({ register, control }) => {
    const { fields, append, remove } = useFieldArray({ control, name: "education" });
    return (
        <div className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex justify-between mb-4">
                        <h4 className="font-semibold text-sm">Education #{index + 1}</h4>
                        <button type="button" onClick={() => remove(index)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>
                    <div className="space-y-3">
                        <input {...register(`education.${index}.school`)} placeholder="University / School" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                        <input {...register(`education.${index}.degree`)} placeholder="Degree" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                        <div className="grid grid-cols-2 gap-2">
                            <input {...register(`education.${index}.year`)} placeholder="Year of Passing" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                            <input {...register(`education.${index}.location`)} placeholder="Location" className="w-full px-3 py-2 text-sm border border-slate-300 rounded" />
                        </div>
                    </div>
                </div>
            ))}
            <Button variant="secondary" type="button" onClick={() => append({ school: '', degree: '' })} className="w-full">
                + Add Education
            </Button>
        </div>
    );
};

export default ResumeBuilder;
