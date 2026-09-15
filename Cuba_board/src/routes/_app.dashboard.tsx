import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { XPBar, RankBadge, StreakStrip, AchievementBadge } from "@/components/gamification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currentUser, quizzes, notes, achievements, activityData, subjectRadar } from "@/lib/mock-data";
import { ArrowUpRight, Flame, Plus, Sparkles, Swords, Trophy, Upload } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CUBA BOARD" }, { name: "description", content: "Your learning command center." }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">Welcome back</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight truncate">Hey, {currentUser.name.split(" ")[0]} 👋</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" className="border-white/10 bg-white/5"><Link to="/library"><Upload className="size-4 mr-1.5" />Upload</Link></Button>
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90"><Link to="/battle"><Swords className="size-4 mr-1.5" />Battle</Link></Button>
        </div>
      </header>

      {/* Top stat row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6 md:col-span-2 relative overflow-hidden">
          <div aria-hidden className="absolute -top-10 -right-10 size-48 bg-brand-primary/20 blur-3xl rounded-full" />
          <div className="relative flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1">Total Points</p>
              <p className="text-5xl font-extrabold tracking-tight text-gradient-brand">{currentUser.points.toLocaleString()}</p>
            </div>
            <RankBadge rank={currentUser.rank} />
          </div>
          <XPBar value={currentUser.xp} max={currentUser.xpToNext} />
          <p className="text-xs text-foreground/50 mt-2">Level {currentUser.level} · {currentUser.xpToNext - currentUser.xp} XP to next rank</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="size-4 text-orange-400" />
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">Daily Streak</p>
          </div>
          <p className="text-4xl font-extrabold mb-3">{currentUser.streak} <span className="text-base font-mono font-normal text-foreground/40">days</span></p>
          <StreakStrip days={currentUser.streak} />
        </GlassCard>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Performance · last 7 days</h2>
            <Badge variant="outline" className="border-brand-success/30 text-brand-success">+24%</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="xp-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(11,18,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} fill="url(#xp-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-bold mb-2">Subject Mastery</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <RadarChart data={subjectRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
                <Radar dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Quizzes</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/quiz">View all <ArrowUpRight className="size-3.5 ml-1" /></Link></Button>
          </div>
          <div className="divide-y divide-border/50">
            {quizzes.map((q, i) => (
              <motion.div key={q.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 py-3"
              >
                <div className="size-10 rounded-lg bg-brand-primary/10 text-brand-primary grid place-items-center font-mono text-xs font-bold shrink-0">
                  {q.subject.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{q.title}</p>
                  <p className="text-xs text-foreground/40">{q.subject} · {q.date}</p>
                </div>
                <Badge className={q.score === q.total ? "bg-brand-success/20 text-brand-success" : q.score >= 7 ? "bg-brand-primary/20 text-brand-primary" : "bg-amber-500/20 text-amber-400"}>
                  {q.score}/{q.total}
                </Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Notes</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/library"><Plus className="size-3.5" /></Link></Button>
          </div>
          <div className="space-y-2">
            {notes.slice(0, 4).map((n) => (
              <Link key={n.id} to="/library" className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`h-1 w-12 rounded-full mb-2 bg-gradient-to-r ${n.color}`} />
                <p className="font-medium text-sm truncate">{n.title}</p>
                <p className="text-xs text-foreground/40">{n.subject} · {n.updated}</p>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Achievements */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-amber-400" />
            <h2 className="font-bold">Achievements</h2>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/profile">View all <ArrowUpRight className="size-3.5 ml-1" /></Link></Button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {achievements.map((a) => <AchievementBadge key={a.id} {...a} />)}
        </div>
      </GlassCard>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { to: "/quiz", icon: Sparkles, title: "Generate Quiz", desc: "AI from your notes" },
          { to: "/battle", icon: Swords, title: "Start Battle", desc: "1v1 or party" },
          { to: "/library", icon: Upload, title: "Upload Notes", desc: "PDF, slides, txt" },
        ].map((a) => (
          <Link key={a.to} to={a.to}>
            <GlassCard className="p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className="size-10 rounded-lg bg-brand-primary/10 text-brand-primary grid place-items-center">
                <a.icon className="size-5" />
              </div>
              <div>
                <p className="font-bold">{a.title}</p>
                <p className="text-xs text-foreground/50">{a.desc}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
