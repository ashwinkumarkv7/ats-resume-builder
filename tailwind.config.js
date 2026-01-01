/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                background: '#ffffff',
                foreground: '#0f172a', // Slate 900
                primary: {
                    DEFAULT: '#2563eb', // Blue 600
                    foreground: '#ffffff',
                    hover: '#1d4ed8', // Blue 700
                },
                muted: {
                    DEFAULT: '#f1f5f9', // Slate 100
                    foreground: '#64748b', // Slate 500
                },
                border: '#e2e8f0', // Slate 200
            },
        },
    },
    plugins: [],
}
