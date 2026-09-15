# CUBA BOARD — Master Product & Technical Implementation

**Cuba Board** is an AI-powered collaborative learning, quiz generation, and competitive study platform built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js + Express**, **Prisma PostgreSQL**, and **Supabase**.

> **Master Product Version**: 1.0  
> **Repository**: [https://github.com/Yashikasinghh/CUBA-BOARD](https://github.com/Yashikasinghh/CUBA-BOARD)

---

## 🚀 Core Learning Loop

$$\text{Upload} \longrightarrow \text{Analyze} \longrightarrow \text{Generate} \longrightarrow \text{Play} \longrightarrow \text{Score} \longrightarrow \text{Revise} \longrightarrow \text{Improve}$$

1. **Upload**: Upload PDF, TXT, or paste lecture notes into your study library.
2. **Analyze**: AI text extraction engine cleans document text, estimates page counts, and extracts key topics.
3. **Generate**: Grounded AI engine generates structured assessments with Zod validation (4 options, correct answer, explanation, source page references).
4. **Play**: Play timed solo quizzes with visual timers, auto-submit on timeout, and keyboard navigation (`1-4`, `Enter`).
5. **Score**: Earn XP, level up, maintain daily streaks, and inspect detailed answer breakdowns.
6. **Revise**: Practice 3D interactive flashcards with spaced repetition and generate targeted **Mistake Revision Quizzes**.
7. **Compete**: Challenge friends in private 1v1 battle rooms or enter the **Random Matchmaking Queue** (MMR Rating system).

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, Zustand.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **AI Processing**: Google Gemini API integration with Zod JSON validation & grounded fallback engine.
- **Real-Time Multiplayer**: Socket.IO client/server events & MMR matchmaking queue.

---

## ⚙️ Quick Start Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Yashikasinghh/CUBA-BOARD.git
cd CUBA-BOARD

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3. Run Development Servers

```bash
# Start Frontend Dev Server (Vite)
npm run dev

# Start Backend Express API Server (in backend directory)
cd backend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📋 Phase Implementation Status (Phase 0 – Phase 13)

- [x] **Phase 0**: Product Planning & Architecture Specification
- [x] **Phase 1**: React + Vite + TypeScript Setup & Layout System
- [x] **Phase 2**: Authentication & User Profile State Management
- [x] **Phase 3**: Study Library & Document Management
- [x] **Phase 4**: Document Processing & Text Extraction Engine
- [x] **Phase 5**: AI Quiz Generation Engine with Zod Output Validation
- [x] **Phase 6**: Quiz Configuration & Timed Solo Player
- [x] **Phase 7**: Scoring, XP/Streak Rewards & Recharts Progress Analytics
- [x] **Phase 8**: AI Opponent Mode (Controlled Bot Difficulty)
- [x] **Phase 9**: Friend Multiplayer (Private Room Codes)
- [x] **Phase 10**: Leaderboard, Social Features & Direct Challenges
- [x] **Phase 11**: 3D Flashcards, Spaced Repetition & Mistake Quiz Generator
- [x] **Phase 12**: Random Matchmaking Engine (Skill Rating / MMR Queue)
- [x] **Phase 13**: Security, Environment Configuration & Deployment Setup
