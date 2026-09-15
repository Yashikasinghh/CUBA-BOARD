import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { battles, friends } from "@/lib/mock-data";
import { Copy, Plus, Swords, Users, Globe, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/battle/")({
  head: () => ({ meta: [{ title: "Battle Lobby — CUBA BOARD" }, { name: "description", content: "Create or join a quiz battle." }] }),
  component: BattleLobby,
});

function BattleLobby() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("Biology");
  const [count, setCount] = useState(10);
  const [timer, setTimer] = useState(15);
  const [pub, setPub] = useState(true);
  const [joinCode, setJoinCode] = useState("");

  function create() {
    const code = `${subject.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    toast.success("Room created", { description: `Code: ${code}` });
    navigate({ to: "/battle/$roomId", params: { roomId: code } });
  }

  function join() {
    if (!joinCode.trim()) return toast.error("Enter a room code");
    navigate({ to: "/battle/$roomId", params: { roomId: joinCode.trim().toUpperCase() } });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">Battle Arena</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Lobby</h1>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Create */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-brand-primary/15 text-brand-primary grid place-items-center"><Plus className="size-5" /></div>
            <div>
              <h2 className="font-bold">Create a room</h2>
              <p className="text-xs text-foreground/50">Host a battle, invite friends.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Biology", "History", "Math", "Physics", "Law", "CS"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Questions</Label>
              <Input type="number" min={3} max={20} value={count} onChange={(e) => setCount(+e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Timer (s/question)</Label>
              <Input type="number" min={5} max={60} value={timer} onChange={(e) => setTimer(+e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <div className="flex items-center gap-2 h-9">
                {pub ? <Globe className="size-4 text-brand-accent" /> : <Lock className="size-4 text-foreground/50" />}
                <Switch checked={pub} onCheckedChange={setPub} />
                <span className="text-xs text-foreground/60">{pub ? "Public" : "Private"}</span>
              </div>
            </div>
          </div>
          <Button onClick={create} className="w-full bg-brand-primary hover:bg-brand-primary/90 font-bold py-6">
            <Swords className="size-4 mr-2" />Create Battle
          </Button>
        </GlassCard>

        {/* Join */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-brand-accent/15 text-brand-accent grid place-items-center"><Users className="size-5" /></div>
            <div>
              <h2 className="font-bold">Join with code</h2>
              <p className="text-xs text-foreground/50">Got an invite? Drop it in.</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Room code</Label>
            <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="BIO-7732" className="font-mono uppercase" />
          </div>
          <Button onClick={join} variant="outline" className="w-full border-brand-accent/30 bg-brand-accent/5 text-brand-accent hover:bg-brand-accent/10 py-6 font-bold">
            Join Battle
          </Button>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">Invite friends</p>
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {friends.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                  <div className="relative size-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center text-xs font-bold text-white">
                    {f.avatar}
                    {f.online && <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-brand-success ring-2 ring-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-foreground/40">{f.online ? "online" : "offline"}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(`cuba.board/battle/INV-${f.id}`); toast.success(`Invite copied for ${f.name}`); }}>
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Public rooms */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Public rooms · Live</h2>
          <span className="text-xs font-mono text-foreground/40">{battles.length} open</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {battles.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-4 space-y-3 hover:-translate-y-0.5 transition-transform">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{b.subject}</p>
                    <p className="text-xs text-foreground/40">by {b.host}</p>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-accent/15 text-brand-accent">{b.code}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground/60">{b.players}/{b.max} players</span>
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: b.players }).map((_, j) => (
                      <div key={j} className="size-5 rounded-full ring-2 ring-background bg-gradient-to-br from-brand-primary to-brand-violet" />
                    ))}
                  </div>
                </div>
                <Button asChild size="sm" className="w-full bg-brand-primary hover:bg-brand-primary/90">
                  <Link to="/battle/$roomId" params={{ roomId: b.code }}>Join</Link>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
