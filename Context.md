[Previous Context.md content - I will just write a placeholder saying "See original context" or try to write it all back? Best to write it all back for reference.]

PROJECT CONTEXT: ATS-FRIENDLY RESUME BUILDER (WEBAPP)
Product Name
ATS Resume Builder
Product Type
Web application, mobile-ready, built with Firebase backend, scalable to Android/iOS later.
CORE GOAL
Build a strict ATS-friendly resume builder that helps users:
Create resumes that pass ATS systems
Check ATS match score against job descriptions
Improve resume content using AI
Export clean PDF and DOCX files
This product prioritizes functionality and ATS accuracy over visual design.
UNIQUE SELLING PROPOSITION (USP)
Most resume builders claim to be ATS-friendly but secretly break ATS rules using columns, icons, graphics, and tables.
This app:
Forces ATS-safe structure
Prevents users from breaking ATS rules
Provides real ATS keyword matching
Works especially well for Indian and international job markets
TARGET USERS
Freshers
Job switchers
International job applicants
ATS-rejected candidates
Freelancers applying on LinkedIn, Indeed, company career pages
TECH STACK (MANDATORY)
Frontend
React.js
Tailwind CSS
React Hook Form
Client-side routing
Backend (Firebase)
Firebase Authentication
Email/password
Google sign-in
Firebase Firestore
Users
Resumes
ATS scores
Payments
Firebase Cloud Functions
ATS scoring logic
AI processing
PDF & DOCX generation
Firebase Hosting
AI
OpenAI API (server-side only)
Used for:
Keyword extraction from job descriptions
Resume content rewriting
ATS optimization suggestions
Payments
Razorpay (India-focused)
One-time and subscription support
APPLICATION STRUCTURE (PAGES)
1. Landing Page
Purpose: conversion
Sections:
Headline: “Build ATS-Friendly Resumes That Actually Get Shortlisted”
How it works (3 steps)
ATS score preview (sample)
Pricing
CTA: “Build Resume Free”
Tone: confident, professional, not flashy.
2. Authentication
Email + Google login
No unnecessary onboarding
Redirect directly to dashboard after login
3. Dashboard
Shows:
Resume list
ATS score summary
“Create New Resume” button
Upgrade banner if on free plan
4. Resume Builder (STRICT MODE)
Single-column, step-by-step form.
Sections (fixed order):
Personal Information
Professional Summary
Work Experience
Skills
Education
Rules:
No columns
No icons
No tables
Bullet points only for experience
Skills as comma-separated text
Standard headings only
The user cannot change layout or styling.
4
5. ATS Checker
User pastes a job description.
System shows:
ATS Match Score (%)
Missing keywords
Weak sections
Suggestions to improve score
This is a paid feature after limited free usage.
6. AI Resume Improvement
Buttons:
“Rewrite for ATS”
“Optimize for this job description”
“Improve bullet impact”
AI output must:
Stay factual
Avoid exaggeration
Keep ATS-safe language
Use action verbs and metrics where possible
7. Export
Download PDF (ATS-safe)
Download DOCX (ATS-safe)
No colors, icons, or design elements
ATS SCORING LOGIC (IMPORTANT)
The ATS score must be rule-based + AI-assisted, not fake.
Steps:
Extract keywords from job description
Extract keywords from resume sections
Compare:
Skills overlap
Role keywords
Tools and technologies
Action verbs
Penalize:
Missing sections
Long paragraphs
Unstructured content
Output:
Score percentage
Missing keywords list
Improvement suggestions
MONETIZATION MODEL
Free Plan
1 resume
1 ATS check
PDF export with watermark
Paid Plan (India-friendly)
₹299 one-time OR ₹199/month
Unlimited resumes
Unlimited ATS checks
AI rewriting
DOCX export
No watermark
PAYMENT FLOW (RAZORPAY)
User clicks “Upgrade”
Backend creates Razorpay order
Checkout opens (UPI, card, net banking)
Payment verification on backend
User upgraded in Firestore
Premium features unlocked instantly
SECURITY RULES
OpenAI API key never exposed
ATS checks rate-limited
Resume content stored as structured JSON
All exports generated server-side
NON-GOALS (DO NOT BUILD)
Fancy templates
Multiple columns
Graphic resumes
Canva-style editor
Animations or heavy UI effects
SUCCESS METRIC
User ATS score improves after suggestions
Resume passes real ATS systems
Users are willing to pay because it actually works
FINAL INSTRUCTION TO AI
Build this product exactly as described.
Prioritize ATS accuracy, performance, and simplicity over visual design.
