import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateContent = async (prompt, type = 'improve') => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error('API Key is missing');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompts = {
        summary: "You are an expert ATS Resume Writer. Write a professional, punchy professional summary (max 3-4 sentences) for a resume based on the provided details. Use strong action verbs and keyword-rich language suitable for ATS systems. Do not include any introductory text, just the summary.",
        improve: "You are an expert ATS Resume Writer. Rewrite the following bullet point or text to be more impactful, using active voice, strong action verbs, and quantifiable metrics where possible. Keep it concise. Do not include explanations, just the rewritten text.",
        responsibilities: "You are an expert ATS Resume Writer. Generate 3-4 distinct, impactful, and ATS-friendly bullet points for the specific job role provided. Use strong action verbs at the start of each bullet. The output MUST be a list where each line starts with a solid bullet point character '• '. Do not use Markdown formatting like bold or italics. Do not include introductory text.",
        fix: "Fix the grammar and spelling of the following text, maintaining a professional tone."
    };

    const finalPrompt = `${systemPrompts[type] || systemPrompts.improve}\n\nInput Text:\n"${prompt}"`;

    try {
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};
