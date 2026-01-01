# 📄 ATS Resume Builder

A powerful, intelligent resume builder designed to help job seekers create professional, ATS-friendly resumes in minutes. Built with **React** and powered by **Google Gemini AI**.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

-   **✨ AI-Powered Writing Assistant**:
    -   Instantly generate professional summaries tailored to your profile.
    -   Create impactful, action-oriented bullet points for job descriptions just by entering a job title.
    -   "Enhance" mode to rewrite existing text for better grammar and impact.
-   **🎨 Multiple Professional Templates**: Choose from Classic, Modern, Minimal, Executive, and more.
-   **👀 Real-Time Preview**: See changes instantly as you type with a dynamic split-screen editor.
-   **✅ ATS Optimization**:
    -   Built-in "ATS Strict Mode" to ensure best practices.
    -   Smart filename suggestions (e.g., `John_Doe_Software_Engineer_Resume`).
-   **🖼️ Image Processing**: Integrated image cropper and editor for profile photos.
-   **☁️ Cloud Save**: Auto-saves your progress using Firebase (Authentication & Firestore).
-   **📱 Responsive**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend:**
-   **React** (Vite) - Fast, modern UI development.
-   **TailwindCSS** - Utility-first styling for rapid design.
-   **Framer Motion** - Smooth animations and transitions.
-   **React Hook Form** - Efficient form state management.

**AI & Backend:**
-   **Google Gemini AI** (`@google/generative-ai`) - Powers the content generation features.
-   **Firebase** - Authentication and database for saving user resumes.

**Utilities:**
-   `lucide-react` - Beautiful, consistent icons.
-   `react-easy-crop` - Profile picture editing.
-   `jspdf` - High-quality PDF export (implied).

## ⚡ Getting Started

### Prerequisites

-   Node.js (v16+)
-   NPM or Yarn
-   A Google Gemini API Key
-   A Firebase Project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ats-resume-builder.git
    cd ats-resume-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_GOOGLE_API_KEY=your_gemini_api_key_here
    # Add your Firebase config keys as needed by your firebase.js setup
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

1.  **Sign Up/Login**: Access your dashboard to manage resumes.
2.  **Create New Resume**: Start fresh or pick a template.
3.  **Fill Details**:
    -   Use the **Magic Wand** 🪄 icon to let AI write your summary or responsibilities.
    -   Upload and crop your photo.
4.  **Customize**: Switch templates instantly to see what looks best.
5.  **Export**: Download your resume as a PDF ready for job applications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

