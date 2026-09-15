import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { CircularTimer } from "@/components/circular-timer";
import { generateMockQuestions, currentUser, friends } from "@/lib/mock-data";
import { Crown, Swords, Trophy, X, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/battle/$roomId")({
  head: ({ params }) => ({ meta: [{ title: `Room ${params.roomId} — CUBA BOARD` }, { name: "description", content: "Live quiz battle." }] }),
  component: BattleRoom,
});

type Phase = "lobby" | "playing" | "result";

function BattleRoom() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const opponent = friends[0];

  const questions = useMemo(() => generateMockQuestions("Biology", 5), []);
  const [phase, setPhase] = useState<Phase>("lobby");
  const [countdown, setCountdown] = useState(3);
  const [qIdx, setQIdx] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  // Lobby countdown
  useEffect(() => {
    if (phase !== "lobby") return;
    if (countdown <= 0) { setPhase("playing"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const q = questions[qIdx];

  function answer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.correct;
    if (correct) { setMyScore((s) => s + 100 + streak * 10); setStreak((s) => s + 1); }
    else setStreak(0);
    // simulate opponent
    setTimeout(() => {
      if (Math.random() > 0.4) setOppScore((s) => s + 100);
    }, 600);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) setPhase("result");
      else { setQIdx((i) => i + 1); setPicked(null); }
    }, 1400);
  }

  function onTimeout() {
    if (picked === null) answer(-1);
  }

  if (phase === "lobby") {
    return (
      <div className="max-w-3xl mx-auto">
        <GlassCard className="p-10 text-center space-y-6">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span className="font-mono">Room {roomId}</span>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(roomId); toast.success("Code copied"); }}>
              <Copy className="size-3.5 mr-1" />Copy
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <PlayerAvatar name={currentUser.name} avatar={currentUser.avatar} you />
            <div className="text-4xl font-extrabold italic text-foreground/30">VS</div>
            <PlayerAvatar name={opponent.name} avatar={opponent.avatar} />
          </div>
          <motion.div key={countdown} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl font-extrabold text-gradient-brand">
            {countdown > 0 ? countdown : "GO!"}
          </motion.div>
          <p className="text-sm text-foreground/50">{questions.length} questions · 15s each</p>
        </GlassCard>
      </div>
    );
  }

  if (phase === "result") {
    const won = myScore > oppScore;
    return (
      <div className="max-w-3xl mx-auto">
        <GlassCard className="p-10 text-center space-y-6">
          <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <Trophy className={`size-20 mx-auto ${won ? "text-amber-400" : "text-foreground/30"}`} />
          </motion.div>
          <h1 className="text-4xl font-extrabold">{won ? "Victory!" : myScore === oppScore ? "Draw" : "Defeat"}</h1>
          <div className="flex justify-center gap-12">
            <div>
              <p className="text-xs font-mono uppercase text-foreground/40">You</p>
              <p className="text-4xl font-extrabold text-brand-primary">{myScore}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase text-foreground/40">{opponent.name.split(" ")[0]}</p>
              <p className="text-4xl font-extrabold text-foreground/60">{oppScore}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-success/10 text-brand-success">
            <Crown className="size-4" /> +{won ? 350 : 80} XP earned
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => { setPhase("lobby"); setCountdown(3); setQIdx(0); setMyScore(0); setOppScore(0); setPicked(null); }} className="bg-brand-primary hover:bg-brand-primary/90">
              Rematch
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5"><Link to="/battle">Exit</Link></Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Playing
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Live scoreboard */}
      <div className="grid grid-cols-3 items-center gap-3">
        <ScoreCard name="You" avatar={currentUser.avatar} score={myScore} streak={streak} accent="bg-brand-primary" />
        <div className="text-center">
          <p className="text-xs font-mono text-foreground/40">Q {qIdx + 1} / {questions.length}</p>
          <CircularTimer key={qIdx} seconds={15} onElapsed={onTimeout} />
        </div>
        <ScoreCard name={opponent.name.split(" ")[0]} avatar={opponent.avatar} score={oppScore} accent="bg-brand-violet" right />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <GlassCard className="p-6 sm:p-8">
            <p className="text-xs font-mono text-brand-accent mb-2">QUESTION {qIdx + 1}</p>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">{q.q}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {q.options.map((o, i) => {
                const isPicked = picked === i;
                const isCorrect = picked !== null && i === q.correct;
                const isWrong = isPicked && i !== q.correct;
                return (
                  <motion.button
                    key={i}
                    onClick={() => answer(i)}
                    whileHover={picked === null ? { scale: 1.02 } : undefined}
                    whileTap={picked === null ? { scale: 0.98 } : undefined}
                    disabled={picked !== null}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      isCorrect ? "border-brand-success bg-brand-success/15" :
                      isWrong ? "border-red-500 bg-red-500/15" :
                      picked !== null && i === q.correct ? "border-brand-success bg-brand-success/15" :
                      "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-md bg-white/5 grid place-items-center font-mono text-xs font-bold">{String.fromCharCode(65 + i)}</div>
                      <span className="flex-1 font-medium">{o}</span>
                      {isCorrect && <Check className="size-4 text-brand-success" />}
                      {isWrong && <X className="size-4 text-red-500" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PlayerAvatar({ name, avatar, you }: { name: string; avatar: string; you?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`size-20 rounded-full grid place-items-center text-2xl font-extrabold text-white ring-4 ring-background bg-gradient-to-br ${you ? "from-brand-primary to-brand-accent" : "from-brand-violet to-rose-500"}`}>
        {avatar}
      </div>
      <p className="font-bold text-sm">{name}</p>
      {you && <span className="text-[10px] font-mono uppercase text-brand-accent">You</span>}
    </div>
  );
}

function ScoreCard({ name, avatar, score, streak, accent, right }: { name: string; avatar: string; score: number; streak?: number; accent: string; right?: boolean }) {
  return (
    <GlassCard className="p-3 flex items-center gap-3">
      <div className={`size-9 rounded-full ${accent} grid place-items-center text-xs font-bold text-white shrink-0`}>{avatar}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground/60 truncate">{name}</p>
        <p className="font-extrabold tabular-nums">{score}</p>
      </div>
      {!!streak && streak > 1 && <span className="text-xs font-mono text-orange-400 shrink-0">🔥 {streak}</span>}
    </GlassCard>
  );
}
