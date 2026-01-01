import React from 'react';
import clsx from 'clsx';

const ResumePreview = ({ data, template = 'classic' }) => {
    // Styles for ATS Strict Mode
    // 8.5in x 11in or A4.

    // Template Specific Class Logic
    const isClassic = template === 'classic';
    const isModern = template === 'modern';
    const isMinimal = template === 'minimal';
    const isExecutive = template === 'executive';
    const isTech = template === 'tech';
    const isSimple = template === 'simple';
    const isCreative = template === 'creative';
    const isPhotoCentered = template === 'photo_centered';

    return (
        <div className={clsx(
            "w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[20mm] text-black font-sans leading-normal transition-all duration-300",
            // Classic: Standard 11pt, centered
            isClassic && "text-[11pt]",
            // Modern: Slightly tighter, 10.5pt, left align mostly
            isModern && "text-[10.5pt]",
            // Minimal: Clean, 10pt or 11pt
            isMinimal && "text-[11pt]",
            // Executive: Serif, proper borders, 12pt heading
            isExecutive && "text-[11pt] font-serif",
            // Tech: Monospace headers maybe, but clean sans-serif body
            isTech && "text-[10pt] font-mono",
            // Simple: No borders, just spacing
            isSimple && "text-[11pt]",
            // Creative: Grid layout usually, but here we handle main container font
            isCreative && "text-[10pt] grid grid-cols-[30%_70%] p-0 overflow-hidden",
            // Photo Centered
            isPhotoCentered && "text-[11pt]"
        )} id="resume-preview">

            {/* --- CREATIVE SIDEBAR (Only for Creative Template) --- */}
            {isCreative && (
                <div className="bg-slate-900 text-white p-8 flex flex-col items-center text-center h-full">
                    {data.personal?.photo && (
                        <img src={data.personal.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 mb-6" />
                    )}
                    <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">{data.personal?.fullName}</h1>
                    <div className="text-xs font-light text-slate-400 space-y-2 mb-8 w-full">
                        {data.personal?.email && <div className="break-all">{data.personal.email}</div>}
                        {data.personal?.phone && <div>{data.personal.phone}</div>}
                        {data.personal?.location && <div>{data.personal.location}</div>}
                        {data.personal?.linkedin && <div className="break-all">{data.personal.linkedin}</div>}
                    </div>

                    {/* Skills in Sidebar for Creative */}
                    {data.skills && (
                        <div className="w-full text-left mt-auto mb-8">
                            <h3 className="text-sm font-bold uppercase border-b border-slate-700 pb-1 mb-3 text-slate-300">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.split(',').map((s, i) => (
                                    <span key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{s.trim()}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- MAIN CONTENT AREA (Wrapper for Creative Right Side, or Main for others) --- */}
            <div className={clsx(
                isCreative ? "p-8 bg-white h-full" : ""
            )}>

                {/* --- Header Section --- */}
                {!isCreative && (
                    <div className={clsx(
                        "mb-6",
                        isClassic && "text-center border-b-2 border-black pb-4",
                        isModern && "text-left border-b border-gray-300 pb-2",
                        isMinimal && "flex justify-between items-start border-b border-black pb-4",
                        isExecutive && "text-center border-b-2 border-double border-slate-700 pb-4",
                        isTech && "text-left border-b-2 border-slate-900 pb-4 bg-slate-50 p-4 -mx-[20mm] -mt-[20mm] mb-8 w-[calc(100%+40mm)] px-[20mm] pt-[20mm]",
                        isSimple && "text-left pb-4",
                        isPhotoCentered && "flex flex-col items-center border-b-2 border-blue-100 pb-6"
                    )}>
                        {/* Photo for Non-Creative Templates */}
                        {(isPhotoCentered || (data.personal?.photo && !isCreative && !isClassic && !isMinimal && !isExecutive && !isSimple && !isTech && !isModern)) && (
                            <img src={data.personal.photo} className="w-24 h-24 rounded-full object-cover mb-4 shadow-md" />
                        )}
                        <div className={clsx(isMinimal && "flex-1")}>
                            <h1 className={clsx(
                                "font-bold uppercase tracking-wide mb-2",
                                isClassic && "text-2xl",
                                isModern && "text-3xl text-slate-900",
                                isMinimal && "text-2xl",
                                isExecutive && "text-3xl tracking-widest",
                                isTech && "text-2xl text-blue-700",
                                isSimple && "text-2xl",
                                isPhotoCentered && "text-3xl font-serif text-slate-800"
                            )}>
                                {data.personal?.fullName || "YOUR NAME"}
                            </h1>

                            {/* Minimal: Title/Role if we had it, but we only have contact info */}
                            {!isMinimal && (
                                <div className={clsx(
                                    "text-sm flex flex-wrap gap-3 text-slate-700",
                                    isClassic && "justify-center",
                                    isModern && "justify-start",
                                    isExecutive && "justify-center text-slate-600 italic mt-2",
                                    isTech && "justify-start text-xs font-bold text-slate-500",
                                    isSimple && "justify-start"
                                )}>
                                    {data.personal?.email && <span>{data.personal.email}</span>}
                                    {data.personal?.phone && <span>{data.personal.email ? '|' : ''} {data.personal.phone}</span>}
                                    {data.personal?.location && <span>{data.personal.phone ? '|' : ''} {data.personal.location}</span>}
                                    {data.personal?.linkedin && <span>{data.personal.location ? '|' : ''} {data.personal.linkedin}</span>}
                                </div>
                            )}
                        </div>

                        {/* Minimal: Contact info on right */}
                        {isMinimal && (
                            <div className="text-right text-sm text-slate-700 space-y-1">
                                {data.personal?.email && <div className="block">{data.personal.email}</div>}
                                {data.personal?.phone && <div className="block">{data.personal.phone}</div>}
                                {data.personal?.location && <div className="block">{data.personal.location}</div>}
                                {data.personal?.linkedin && <div className="block">{data.personal.linkedin}</div>}
                            </div>
                        )}
                    </div>
                )}

                {/* --- Summary --- */}
                {data.summary && (
                    <div className="mb-6">
                        <h2 className={clsx(
                            "text-sm font-bold uppercase mb-2",
                            isClassic && "border-b border-black",
                            isModern && "text-blue-800 tracking-wider", // Modern uses color safe for ATS (dark blue usually ok, or just black)
                            isMinimal && "tracking-[0.15em] text-gray-500",
                            isExecutive && "text-center border-b-2 border-slate-200 text-slate-700",
                            isTech && "bg-slate-100 p-1 pl-2 border-l-4 border-blue-600 mb-4",
                            isSimple && "uppercase tracking-wider text-slate-500"
                        )}>
                            Professional Summary
                        </h2>
                        <p className="text-justify leading-relaxed">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* --- Experience --- */}
                {data.experience && data.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className={clsx(
                            "text-sm font-bold uppercase mb-3",
                            isClassic && "border-b border-black",
                            isModern && "text-blue-800 tracking-wider",
                            isMinimal && "tracking-[0.15em] text-gray-500"
                        )}>
                            Work Experience
                        </h2>
                        <div className={clsx("space-y-4", isModern && "space-y-5")}>
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className={clsx(
                                        "flex justify-between font-bold",
                                        isModern ? "text-slate-900 text-[1.05em]" : "",
                                        isTech ? "text-blue-800" : "",
                                        isExecutive ? "text-lg" : ""
                                    )}>
                                        <span>{exp.title}</span>
                                        <span className="shrink-0 ml-4">{exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}</span>
                                    </div>
                                    <div className={clsx(
                                        "flex justify-between mb-1",
                                        isClassic && "italic",
                                        isModern && "text-slate-600 font-medium",
                                        isMinimal && "italic text-gray-600",
                                        isExecutive && "text-slate-700 font-serif italic",
                                        isTech && "text-xs uppercase tracking-wide text-slate-500",
                                        isSimple && "text-slate-600"
                                    )}>
                                        <span>{exp.company}</span>
                                        <span>{exp.location}</span>
                                    </div>
                                    <div className="whitespace-pre-line pl-4 text-justify">
                                        <ul className="list-disc list-outside ml-1 space-y-1">
                                            {exp.description && exp.description.split('\n').map((line, i) => (
                                                line.trim() && <li key={i}>{line.trim()}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Education --- */}
                {data.education && data.education.length > 0 && (
                    <div className="mb-6">
                        <h2 className={clsx(
                            "text-sm font-bold uppercase mb-3",
                            isClassic && "border-b border-black",
                            isModern && "text-blue-800 tracking-wider",
                            isMinimal && "tracking-[0.15em] text-gray-500",
                            isExecutive && "text-center border-b-2 border-slate-200 text-slate-700",
                            isTech && "bg-slate-100 p-1 pl-2 border-l-4 border-blue-600 mb-4",
                            isSimple && "uppercase tracking-wider text-slate-500"
                        )}>
                            Education
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex justify-between font-bold">
                                        <span>{edu.school}</span>
                                        <span>{edu.year}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={clsx(isClassic && "italic")}>{edu.degree}</span>
                                        <span>{edu.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Skills (Standard View) --- */}
                {data.skills && !isCreative && (
                    <div className="mb-6">
                        <h2 className={clsx(
                            "text-sm font-bold uppercase mb-2",
                            isClassic && "border-b border-black",
                            isModern && "text-blue-800 tracking-wider",
                            isMinimal && "tracking-[0.15em] text-gray-500",
                            isExecutive && "text-center border-b-2 border-slate-200 text-slate-700",
                            isTech && "bg-slate-100 p-1 pl-2 border-l-4 border-blue-600 mb-4",
                            isSimple && "uppercase tracking-wider text-slate-500"
                        )}>
                            Skills
                        </h2>
                        <div className={clsx(
                            "flex flex-wrap gap-x-4 gap-y-2",
                            isClassic && "block", // Classic keeps it simple text or list
                        )}>
                            {isClassic ? (
                                <p className="leading-relaxed">
                                    {data.skills}
                                </p>
                            ) : (
                                // Modern and Minimal get chips/tags
                                data.skills.split(',').map((skill, index) => {
                                    const trimmedSkill = skill.trim();
                                    if (!trimmedSkill) return null;
                                    return (
                                        <span key={index} className={clsx(
                                            "inline-block",
                                            isModern && "bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium text-sm border border-slate-200",
                                            isMinimal && "border-b border-gray-300 pb-0.5 text-gray-700",
                                            isExecutive && "italic text-slate-700 border-r border-slate-300 pr-3 mr-3 last:border-0",
                                            isTech && "font-mono text-xs bg-blue-50 text-blue-700 px-1 border border-blue-200",
                                            isSimple && "bg-gray-100 px-2 py-1 rounded-sm text-xs",
                                            isPhotoCentered && "bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                                        )}>
                                            {trimmedSkill}
                                        </span>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
                {/* Close content wrapper */}
            </div>
        </div>
    );
};

export default ResumePreview;
