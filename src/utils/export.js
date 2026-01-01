import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

// --- PDF Export ---
export const exportToPdf = async (filename = 'resume.pdf') => {
    const originalElement = document.getElementById('resume-preview');
    if (!originalElement) {
        throw new Error('Resume preview element not found');
    }

    // 1. Create a simplified container (no fixed px width, just isolate it)
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.width = '210mm'; // Match the CSS width exactly
    document.body.appendChild(container);

    // 2. Clone using deep clone
    const clone = originalElement.cloneNode(true);

    // 3. Reset Styles strictly
    // We keep the classes 'w-[210mm]' etc to maintain internal consistency
    clone.style.transform = 'none'; // reset zoom/scale
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.height = 'auto'; // allow expansion
    clone.style.minHeight = '297mm'; // A4 height
    clone.style.overflow = 'visible';

    container.appendChild(clone);

    // Wait for images to load in clone? (Usually data urls, so instant)

    try {
        const canvas = await html2canvas(clone, {
            scale: 2, // 2x resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            // Do NOT force width/windowWidth here; let the container constraint work
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.90);

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfW = 210; // A4 width in mm
        const pdfH = 297; // A4 height in mm

        // Calculate dimensions to fit width
        // We use the canvas intrinsic dimensions
        const imgH = (canvas.height * pdfW) / canvas.width;

        let heightLeft = imgH;
        let position = 0;

        // First Page
        pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
        heightLeft -= pdfH;

        // Subsequent Pages
        // We use a small buffer (1mm) to prevent extra pages from rounding errors
        while (heightLeft > 1) {
            position = heightLeft - imgH;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
            heightLeft -= pdfH;
        }

        pdf.save(filename);
    } catch (error) {
        console.error('PDF Export Error:', error);
        throw new Error('Failed to export PDF');
    } finally {
        document.body.removeChild(container);
    }
};

// --- DOCX Export ---
export const exportToDocx = async (data, filename = 'resume.docx') => {
    if (!data) return;

    // Helper to create sections
    const children = [];

    // 1. Header (Name & Contact)
    children.push(
        new Paragraph({
            text: data.personal?.fullName || "YOUR NAME",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        })
    );

    const contactParts = [
        data.personal?.email,
        data.personal?.phone,
        data.personal?.location,
        data.personal?.linkedin
    ].filter(Boolean);

    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: contactParts.join(' | '),
                    size: 20 // 10pt
                })
            ],
            spacing: { after: 400 } // space after header
        })
    );

    // 2. Summary
    if (data.summary) {
        children.push(
            new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true, // line under
                spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
                text: data.summary,
                spacing: { after: 300 }
            })
        );
    }

    // 3. Experience
    if (data.experience && data.experience.length > 0) {
        children.push(
            new Paragraph({
                text: "WORK EXPERIENCE",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 200, after: 100 }
            })
        );

        data.experience.forEach(exp => {
            // Role & Date
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: exp.title || "Job Title",
                            bold: true,
                            size: 24 // 12pt
                        }),
                        new TextRun({
                            text: `\t${exp.startDate || ""} - ${exp.endDate || "Present"}`,
                            bold: true,
                        })
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX,
                        },
                    ],
                })
            );

            // Company & Location
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: exp.company || "Company",
                            italics: true,
                        }),
                        new TextRun({
                            text: `\t${exp.location || ""}`,
                            italics: true,
                        })
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX,
                        },
                    ],
                    spacing: { after: 100 }
                })
            );

            // Bullets
            if (exp.description) {
                const bullets = exp.description.split('\n').filter(line => line.trim());
                bullets.forEach(bullet => {
                    const cleanBullet = bullet.replace(/^•\s*/, '').trim(); // Remove existing bullet char if user typed it
                    children.push(
                        new Paragraph({
                            text: cleanBullet,
                            bullet: { level: 0 }, // adds bullet point
                            spacing: { after: 50 }
                        })
                    );
                });
            }

            // Spacer
            children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        });
    }

    // 4. Education
    if (data.education && data.education.length > 0) {
        children.push(
            new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 200, after: 100 }
            })
        );

        data.education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: edu.school || "University",
                            bold: true,
                            size: 24
                        }),
                        new TextRun({
                            text: `\t${edu.year || ""}`,
                            bold: true,
                        })
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX,
                        },
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: edu.degree || "Degree",
                            italics: true,
                        }),
                        new TextRun({
                            text: `\t${edu.location || ""}`,
                            italics: true,
                        })
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX,
                        },
                    ],
                    spacing: { after: 200 }
                })
            );
        });
    }

    // 5. Skills
    if (data.skills) {
        children.push(
            new Paragraph({
                text: "SKILLS",
                heading: HeadingLevel.HEADING_2,
                thematicBreak: true,
                spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
                text: data.skills,
                spacing: { after: 200 }
            })
        );
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, filename);
    } catch (error) {
        console.error("DOCX Export Error:", error);
        throw new Error('Failed to export DOCX');
    }
};
