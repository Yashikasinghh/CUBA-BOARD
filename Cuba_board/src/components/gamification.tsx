import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function XPBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between text-xs font-mono text-foreground/60">
        <span>{value.toLocaleString()} XP</span>
        <span>{max.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-brand-primary via-brand-violet to-brand-accent shadow-[0_0_20px_-2px_var(--brand-primary)]"
        />
      </div>
    </div>
  );
}

export function RankBadge({ rank }: { rank: string }) {
  const map: Record<string, string> = {
    Diamond: "from-cyan-400 to-indigo-500",
    Platinum: "from-slate-300 to-slate-500",
    Gold: "from-amber-300 to-orange-500",
    Silver: "from-zinc-300 to-zinc-500",
  };
  const grad = map[rank] ?? "from-brand-primary to-brand-accent";
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest",
      "bg-gradient-to-r text-white shadow-lg", grad
    )}>
      ◆ {rank}
    </span>
  );
}

export function StreakStrip({ days }: { days: number }) {
  const slots = Array.from({ length: 7 }, (_, i) => i < (days % 7 || 7));
  return (
    <div className="flex gap-1.5">
      {slots.map((on, i) => (
        <div key={i} className={cn(
          "h-8 flex-1 rounded-md grid place-items-center text-xs font-bold",
          on
            ? "bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-[0_0_12px_-2px_rgb(251_146_60/0.6)]"
            : "bg-white/5 text-foreground/30 border border-white/5"
        )}>
          {on ? "🔥" : ""}
        </div>
      ))}
    </div>
  );
}

export function AchievementBadge({
  name, icon, rarity, unlocked,
}: { name: string; icon: string; rarity: string; unlocked: boolean }) {
  const ring: Record<string, string> = {
    common: "ring-zinc-400/40",
    rare: "ring-sky-400/60",
    epic: "ring-fuchsia-400/60",
    legendary: "ring-amber-300/80",
  };
  return (
    <div className={cn(
      "group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
      unlocked
        ? "border-white/10 bg-white/5 hover:bg-white/10 hover:-translate-y-0.5"
        : "border-white/5 bg-white/[0.02] opacity-40 grayscale"
    )}>
      <div className={cn(
        "size-14 rounded-2xl grid place-items-center text-3xl ring-2 ring-offset-2 ring-offset-background",
        ring[rarity] ?? "ring-white/10",
        unlocked ? "bg-gradient-to-br from-white/10 to-white/0" : "bg-white/5"
      )}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-xs font-bold truncate max-w-[88px]">{name}</p>
        <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{rarity}</p>
      </div>
    </div>
  );
}
