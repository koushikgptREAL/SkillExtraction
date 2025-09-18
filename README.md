# SkillExtraction

SkillExtraction is a full-stack TypeScript application for uploading resumes (PDF), extracting skills using NLP, and managing user authentication.  
It uses **Express + React + TailwindCSS** with **Clerk Authentication**, **Drizzle ORM**, and **pdf-parse** for PDF parsing.

---

## 🚀 Features

- **User Authentication** (Clerk) – Secure login with Google or email/password.
- **Resume Upload** – Drag & drop PDF resumes.
- **Skill Extraction** – Automatically extracts skills from resumes using `pdf-parse` and custom NLP logic.
- **Dashboard UI** – Responsive UI built with React, TailwindCSS, Radix UI, and Framer Motion.
- **Database Integration** – Drizzle ORM with Neon/PGSQL backend.
- **Session Management** – Express-session + connect-pg-simple with secure storage.

---

## 🛠️ Tech Stack

**Frontend**  
- React 18  
- TailwindCSS + Tailwind Merge + Tailwind Animate  
- Radix UI components  
- Framer Motion animations  

**Backend**  
- Express.js + TypeScript  
- Clerk for Authentication  
- Drizzle ORM for database management  
- Multer for file uploads  
- pdf-parse for PDF content extraction  

**Build Tools**  
- Vite (frontend bundling)  
- Esbuild (server bundling)  
- TypeScript  
- Cross-env  

---

📂 Project Structure
SkillExtraction/
│
├── server/             # Express backend (TypeScript)
│   ├── index.ts        # Entry point
│   ├── routes/         # API endpoints
│   └── utils/          # Helper functions
│
├── src/                # React frontend
│   ├── components/     # UI components
│   ├── pages/          # Pages
│   └── hooks/          # React hooks
│
├── public/             # Static assets
├── .env                # Environment variables
├── package.json
├── README.md
└── ...

---
## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/koushikgptREAL/SkillExtraction.git
cd SkillExtraction
npm install


Set up your environment variables in a .env file (Clerk keys, database URL, etc.):

DATABASE_URL=...
CLERK_API_KEY=...
CLERK_FRONTEND_API=...
SESSION_SECRET=...
