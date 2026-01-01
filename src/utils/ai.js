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
        improve: "You are an expert ATS Resume Writer. Rewrite the following text to be concise (max 20 words), impactful, and result-oriented. Use active voice and strong action verbs. Do NOT use bullet points or special characters. Do not include explanations, just the rewritten text.",
        responsibilities: "You are an expert ATS Resume Writer. Generate 3-4 distinct, concise, and punchy responsibility points for the specific job role provided. Rules: 1. Do NOT use bullet points or any special characters at the start of lines. Just raw text separated by newlines. 2. Keep each point SHORT and PRECISE (max 15-20 words). 3. Use strong action verbs. 4. Focus on results/metrics. 5. No Markdown or introductory text.",
        fix: "Fix the grammar and spelling of the following text, maintaining a professional tone.",
        analyze: "You are an expert ATS Algorithm. Analyze the provided resume data against the target Job Role. Return a strict JSON object with the following structure: { \"score\": Number(0-100), \"feedback\": [\"concise bullet point critique 1\", \"critique 2\"], \"missingKeywords\": [\"keyword1\", \"keyword2\"], \"optimizedSummary\": \"A rewritten, keyword-rich professional summary tailored to the role\" }. Do strictly JSON only, no markdown formatting."
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
