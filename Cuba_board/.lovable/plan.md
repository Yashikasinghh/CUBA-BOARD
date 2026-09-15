## CUBA BOARD — Frontend Build Plan

Stack: TanStack Start + React + TypeScript + Tailwind v4 + Framer Motion + shadcn/ui. All data mocked in `src/lib/mock-data.ts`. Dark-first cyber-sport neon design from the selected direction.

### Design tokens (src/styles.css)
Locked from the chosen prototype:
- `--brand-primary: #6366f1` (indigo) — anchors the selected direction; the user's `#4F46E5` is close enough that we keep prototype tokens verbatim per design rules. CTAs use this.
- `--brand-secondary: #2563eb`
- `--brand-accent: #22d3ee` (cyan)
- `--brand-violet: #8b5cf6` (added from user brief for badge/accent variety)
- `--brand-success: #4ade80`
- `--brand-dark: #020617` background
- Fonts: Outfit (sans), JetBrains Mono (mono) — installed via `@fontsource/outfit` and `@fontsource/jetbrains-mono`, loaded in `src/start.tsx`.
- Theme variables wired in `@theme inline` so utilities like `bg-brand-primary`, `text-brand-accent` exist.
- Light mode: provide a parallel `:root` light palette (white bg, slate-900 text) and toggle via `.dark` class on `<html>`. Theme stored in `localStorage`. App defaults to dark.

### Routes (file-based, under `src/routes/`)
```
__root.tsx              shell, theme provider, toaster
index.tsx               Landing
auth.login.tsx          Login
auth.signup.tsx         Signup
_app.tsx                Authenticated layout (sidebar + topbar) — mock "logged in"
_app.dashboard.tsx      Student Dashboard
_app.library.tsx        Study Material Library
_app.quiz.tsx           AI Quiz Center
_app.battle.tsx         Battle lobby (create/join)
_app.battle.$roomId.tsx Live battle arena (timer, questions, results)
_app.leaderboard.tsx    Leaderboards
_app.profile.tsx        Profile
_app.notifications.tsx  Notifications
_app.settings.tsx       Settings
```
`_app.tsx` is pathless — wraps authenticated screens with `<AppSidebar />` + `<Topbar />` + `<Outlet />`. No real auth; a `useMockUser` hook returns a fake user. The login/signup pages just navigate to `/dashboard`.

### Landing page (`index.tsx`)
Port the chosen prototype 1:1: sticky glass nav, hero with status pill + gradient headline + dual CTAs, hero product preview card, AI Generator showcase (2-col), 4-stat row, 3-testimonial grid, minimal footer. Add Framer Motion: hero fade/scale-in, stat counters animate on view, card hover lift, scroll-reveal sections. Generate two images for the placeholders (arena dashboard + upload module).

### Authenticated shell
- `AppSidebar` (shadcn sidebar, `collapsible="icon"`): Dashboard, Library, Quiz Center, Battle, Leaderboard, Profile, Notifications, Settings. Active route highlighted; brand mark on top.
- `Topbar`: search, theme toggle, notifications bell with unread dot, XP/points chip, avatar menu.

### Dashboard
Bento grid of glass cards:
- Hero greeting + Total Points + XP progress bar + current Rank badge
- Daily Streak (7-day strip with flame)
- Recent Notes (list of 4 with thumbnails)
- Quiz History (recent 5 with score chips)
- Performance Analytics (Recharts area + radar by subject)
- Achievement Badges (grid of unlocked/locked)
- Quick actions: Start Battle / Generate Quiz / Upload Notes

### Study Material Library
Filterable grid: search input, subject chips, sort. Cards show title, subject tag, page count, last opened, "Generate Quiz" button. Upload zone (dropzone UI only, accepts file → toast "Uploaded", appends to mock list).

### AI Quiz Center
3-step wizard (Framer Motion step transitions): pick source (note from library or paste text) → configure (count, difficulty, type chips) → generated preview (animated question cards with shimmer while "generating" via setTimeout). "Start Solo" or "Send to Battle" buttons.

### Battle Arena
- Lobby (`_app.battle.tsx`): Create Room (form: subject, questions, time, public/private → generates room code, routes to `/battle/$roomId`), Join Room (code input), Invite Friends (copy link + friend list), Public rooms list.
- Live room (`_app.battle.$roomId.tsx`): countdown lobby with avatars → question screen with circular timer (Framer Motion), 4 options, live opponent score bar, streak indicator. Simulated opponent answers via timers. After last question → Results screen: winner banner, XP gained, per-question breakdown, rematch/exit CTAs.

### Leaderboards
Tabs: Global / Friends / Weekly / All-time. Top-3 podium with avatars (animated rise on mount). Ranked table below with rank delta arrows. Filter by subject.

### Profile
Hero with avatar, rank, level, XP bar, join date. Tabs: Overview (stats grid + radar), Achievements (badge wall with rarity tiers), Battle History, Friends.

### Notifications
List grouped by Today / Earlier. Types: battle invite (accept/decline inline), achievement unlock, friend request, quiz reminder. Mark-all-read action.

### Settings
Sectioned form: Account (name/email/avatar), Appearance (theme toggle, accent color picker), Notifications (toggle switches), Privacy, Danger zone (delete account). Saves are mocked with toast feedback.

### Reusable components (`src/components/`)
- `GlassCard`, `GradientHeading`, `StatCounter` (Framer Motion animated number), `XPBar`, `RankBadge`, `StreakStrip`, `AchievementBadge`, `QuestionCard`, `CircularTimer`, `PlayerVsPlayer`, `ScoreBar`, `EmptyState`, `PageHeader`, `SectionHeader`, `ThemeToggle`, `MotionSection` (in-view reveal wrapper).
- All cards use the established glass treatment: `bg-white/5 border border-white/10 backdrop-blur` in dark; `bg-white/60 border border-black/5 backdrop-blur` in light.

### Mock data (`src/lib/mock-data.ts`)
Exports: `currentUser`, `notes[]`, `quizzes[]`, `battles[]`, `leaderboard[]`, `achievements[]`, `notifications[]`, `friends[]`, plus helpers (`generateMockQuestions`, `simulateOpponentScore`).

### Animations
- `MotionSection` uses `whileInView` fade+rise.
- Hero headline staggered word reveal.
- Stat numbers count up via `useMotionValue` + `animate`.
- Card hover: lift + glow.
- Battle timer: animated SVG stroke.
- Route transitions: subtle opacity fade in `_app` layout outlet wrapper.

### Quality bar
- Mobile-first responsive: sidebar collapses to sheet on mobile, hero typography scales down, bento grids reflow to single column.
- Accessibility: semantic landmarks, focus-visible rings on all interactive elements, ARIA labels on icon-only buttons, color contrast checked for both themes.
- SEO: per-route `head()` with unique title/description/og tags.
- No real backend — all writes are optimistic + toast.

### Deliverables in this build
All routes, components, mock data, theme system, light/dark toggle, 2 generated landing images, Framer Motion animations across the app. No auth, no DB, no realtime — those are explicit follow-ups.
