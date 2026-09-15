import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { notifications as initial, type Notif } from "@/lib/mock-data";
import { Bell, Swords, Trophy, UserPlus, Clock, Check } from "lucide-react";
import { toast } from "sonner";

const iconMap = { battle: Swords, achievement: Trophy, friend: UserPlus, reminder: Clock };
const accentMap = {
  battle: "bg-brand-primary/15 text-brand-primary",
  achievement: "bg-amber-500/15 text-amber-400",
  friend: "bg-brand-accent/15 text-brand-accent",
  reminder: "bg-brand-violet/15 text-brand-violet",
};

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — CUBA BOARD" }, { name: "description", content: "Battle invites, achievements, and friend requests." }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [list, setList] = useState<Notif[]>(initial);
  const today = list.filter((n) => ["5m", "1h", "3h", "6h"].includes(n.time));
  const earlier = list.filter((n) => !["5m", "1h", "3h", "6h"].includes(n.time));

  function markAll() {
    setList(list.map((n) => ({ ...n, read: true })));
    toast.success("Marked all as read");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
        <div className="min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">Inbox</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Notifications</h1>
        </div>
        <Button variant="outline" size="sm" onClick={markAll} className="border-white/10 bg-white/5 shrink-0">
          <Check className="size-3.5 mr-1" />Mark all read
        </Button>
      </header>

      {[{ label: "Today", items: today }, { label: "Earlier", items: earlier }].map((g) => (
        g.items.length > 0 && (
          <section key={g.label} className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">{g.label}</p>
            <div className="space-y-2">
              {g.items.map((n, i) => {
                const Icon = iconMap[n.type];
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <GlassCard className={`p-4 flex items-start gap-3 ${!n.read ? "border-brand-primary/30" : ""}`}>
                      <div className={`size-10 rounded-lg grid place-items-center shrink-0 ${accentMap[n.type]}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-3">
                          <p className="font-bold truncate">{n.title}</p>
                          <span className="text-xs text-foreground/40 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-sm text-foreground/60">{n.body}</p>
                        {n.type === "battle" && !n.read && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90" onClick={() => { toast.success("Battle accepted!"); setList((l) => l.map((x) => x.id === n.id ? { ...x, read: true } : x)); }}>Accept</Button>
                            <Button size="sm" variant="ghost" onClick={() => setList((l) => l.filter((x) => x.id !== n.id))}>Decline</Button>
                          </div>
                        )}
                        {n.type === "friend" && !n.read && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="bg-brand-accent hover:bg-brand-accent/90 text-black" onClick={() => { toast.success("Friend added!"); setList((l) => l.map((x) => x.id === n.id ? { ...x, read: true } : x)); }}>Add</Button>
                          </div>
                        )}
                      </div>
                      {!n.read && <span className="size-2 rounded-full bg-brand-accent shrink-0 mt-2" />}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )
      ))}

      {list.length === 0 && (
        <div className="text-center py-16 text-foreground/40">
          <Bell className="size-10 mx-auto mb-2 opacity-50" />
          You're all caught up.
        </div>
      )}
    </div>
  );
}
