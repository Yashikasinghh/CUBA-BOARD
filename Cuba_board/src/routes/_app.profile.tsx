import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/glass-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { XPBar, RankBadge, AchievementBadge } from "@/components/gamification";
import { currentUser, achievements, quizzes, friends, subjectRadar } from "@/lib/mock-data";
import { Calendar, Mail, Trophy, Zap } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — CUBA BOARD" }, { name: "description", content: "Your scholar profile." }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
        <div aria-hidden className="absolute -top-20 -right-20 size-60 bg-brand-primary/20 blur-3xl rounded-full" />
        <div className="relative grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-4 sm:gap-6 items-center">
          <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center text-3xl font-extrabold text-white shrink-0">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold truncate">{currentUser.name}</h1>
              <RankBadge rank={currentUser.rank} />
            </div>
            <p className="text-sm text-foreground/50">{currentUser.handle}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-foreground/60">
              <span className="flex items-center gap-1"><Mail className="size-3" /> {currentUser.email}</span>
              <span className="flex items-center gap-1"><Calendar className="size-3" /> joined {currentUser.joined}</span>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 w-full sm:w-56">
            <p className="text-xs font-mono uppercase text-foreground/40 mb-1">Level {currentUser.level}</p>
            <XPBar value={currentUser.xp} max={currentUser.xpToNext} />
          </div>
        </div>
      </GlassCard>

      <Tabs defaultValue="overview">
        <TabsList className="bg-white/5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">Battles</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-4">
            {[
              { icon: Trophy, label: "Total Points", value: currentUser.points.toLocaleString(), color: "text-amber-400" },
              { icon: Zap, label: "Daily Streak", value: `${currentUser.streak} days`, color: "text-orange-400" },
              { icon: Trophy, label: "Wins", value: "147", color: "text-brand-success" },
            ].map((s) => (
              <GlassCard key={s.label} className="p-6">
                <div className="flex items-center gap-2 mb-2"><s.icon className={`size-4 ${s.color}`} /><p className="text-xs font-mono uppercase text-foreground/50">{s.label}</p></div>
                <p className="text-3xl font-extrabold">{s.value}</p>
              </GlassCard>
            ))}
            <GlassCard className="p-6 lg:col-span-3">
              <h3 className="font-bold mb-3">Subject mastery</h3>
              <div className="h-72">
                <ResponsiveContainer>
                  <RadarChart data={subjectRadar}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)" }} />
                    <Radar dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <GlassCard className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {achievements.map((a) => <AchievementBadge key={a.id} {...a} />)}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <GlassCard className="p-6">
            <div className="divide-y divide-border/50">
              {quizzes.map((q) => (
                <div key={q.id} className="flex items-center gap-4 py-3">
                  <div className="size-10 rounded-lg bg-brand-primary/10 text-brand-primary grid place-items-center font-mono text-xs font-bold">{q.subject.slice(0,2).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{q.title}</p>
                    <p className="text-xs text-foreground/40">{q.subject} · {q.date}</p>
                  </div>
                  <span className="font-mono font-bold">{q.score}/{q.total}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <GlassCard className="p-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {friends.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="relative size-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center text-sm font-bold text-white">
                    {f.avatar}
                    {f.online && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-brand-success ring-2 ring-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{f.name}</p>
                    <p className="text-xs text-foreground/40">{f.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
