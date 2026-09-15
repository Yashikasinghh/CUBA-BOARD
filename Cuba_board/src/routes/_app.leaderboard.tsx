import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { leaderboard } from "@/lib/mock-data";
import { ArrowDown, ArrowUp, Crown, Minus } from "lucide-react";

export const Route = createFileRoute("/_app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — CUBA BOARD" }, { name: "description", content: "Top scholars worldwide." }] }),
  component: Leaderboard,
});

function Leaderboard() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const [tab, setTab] = useState("global");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">Hall of Champions</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Leaderboard</h1>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white/5">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="alltime">All-time</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="space-y-6 mt-6">
          {/* Podium */}
          <div className="grid grid-cols-3 gap-3 items-end">
            {[1, 0, 2].map((idx, pos) => {
              const u = top3[idx];
              const heights = ["h-32", "h-40", "h-24"];
              const colors = ["from-slate-300 to-slate-500", "from-amber-300 to-amber-600", "from-orange-300 to-amber-700"];
              return (
                <motion.div key={u.handle} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: pos * 0.15 }} className="flex flex-col items-center gap-3">
                  <div className={`size-16 sm:size-20 rounded-full bg-gradient-to-br ${colors[pos]} grid place-items-center text-xl font-extrabold text-white ring-4 ring-background relative`}>
                    {u.avatar}
                    {pos === 1 && <Crown className="absolute -top-5 text-amber-300 size-6" />}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm truncate max-w-[100px]">{u.name}</p>
                    <p className="text-xs font-mono text-foreground/50">{u.xp.toLocaleString()} XP</p>
                  </div>
                  <div className={`w-full rounded-t-xl bg-gradient-to-t ${colors[pos]} ${heights[pos]} grid place-items-center text-3xl font-extrabold text-white/90`}>
                    {u.rank}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Table */}
          <GlassCard className="p-2 sm:p-4">
            <div className="divide-y divide-border/50">
              {rest.map((u, i) => (
                <motion.div key={u.handle} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 sm:gap-4 px-3 py-3 rounded-lg ${u.you ? "bg-brand-primary/10 ring-1 ring-brand-primary/30" : ""}`}>
                  <span className="font-mono text-sm font-bold text-foreground/50 w-7">{u.rank}</span>
                  <div className="size-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center text-xs font-bold text-white shrink-0">{u.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{u.name} {u.you && <span className="text-xs text-brand-accent">(you)</span>}</p>
                    <p className="text-xs text-foreground/40">{u.handle}</p>
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-mono ${u.delta > 0 ? "text-brand-success" : u.delta < 0 ? "text-red-400" : "text-foreground/30"}`}>
                    {u.delta > 0 ? <ArrowUp className="size-3" /> : u.delta < 0 ? <ArrowDown className="size-3" /> : <Minus className="size-3" />}
                    {Math.abs(u.delta) || ""}
                  </span>
                  <span className="font-mono font-bold text-sm tabular-nums w-24 text-right">{u.xp.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
