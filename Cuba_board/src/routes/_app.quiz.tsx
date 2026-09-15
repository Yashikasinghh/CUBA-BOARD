import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { notes, generateMockQuestions, type Subject, type Question } from "@/lib/mock-data";
import { Sparkles, ChevronRight, ChevronLeft, Check, FileText, Swords, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/quiz")({
  head: () => ({ meta: [{ title: "AI Quiz Center — CUBA BOARD" }, { name: "description", content: "Generate quizzes from your notes." }] }),
  component: QuizCenter,
});

const difficulties = ["Easy", "Medium", "Hard", "Brutal"] as const;
const types = ["MCQ", "True/False", "Fill-in"] as const;

function QuizCenter() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [noteId, setNoteId] = useState(notes[0].id);
  const [count, setCount] = useState(5);
  const [diff, setDiff] = useState<typeof difficulties[number]>("Medium");
  const [type, setType] = useState<typeof types[number]>("MCQ");
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const note = notes.find((n) => n.id === noteId)!;

  function generate() {
    setGenerating(true);
    setQuestions([]);
    setTimeout(() => {
      setQuestions(generateMockQuestions(note.subject as Subject, count));
      setGenerating(false);
    }, 1500);
  }

  function next() {
    if (step === 1) generate();
    setStep((s) => Math.min(2, s + 1));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">AI Quiz Center</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Generate a quiz</h1>
      </header>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {["Source", "Configure", "Preview"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`size-8 rounded-full grid place-items-center text-xs font-bold shrink-0 ${
              i < step ? "bg-brand-success text-black" : i === step ? "bg-brand-primary text-white" : "bg-white/5 text-foreground/40"
            }`}>
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? "" : "text-foreground/40"}`}>{label}</span>
            {i < 2 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="p-6">
              <h2 className="font-bold mb-4">Pick a source note</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {notes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNoteId(n.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      noteId === n.id ? "border-brand-primary bg-brand-primary/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-foreground/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{n.title}</p>
                        <p className="text-xs text-foreground/40">{n.subject} · {n.pages}p</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="p-6 space-y-6">
              <h2 className="font-bold">Configure</h2>
              <div>
                <Label>Number of questions · <span className="font-mono">{count}</span></Label>
                <Slider value={[count]} onValueChange={([v]) => setCount(v)} min={3} max={20} step={1} className="mt-3" />
              </div>
              <div>
                <Label>Difficulty</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {difficulties.map((d) => (
                    <button key={d} onClick={() => setDiff(d)} className={`px-4 py-2 rounded-lg text-sm font-bold ${diff === d ? "bg-brand-primary text-white" : "bg-white/5 hover:bg-white/10"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Question type</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {types.map((t) => (
                    <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-sm font-bold ${type === t ? "bg-brand-primary text-white" : "bg-white/5 hover:bg-white/10"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Sparkles className="size-4 text-brand-accent" />
                  {generating ? "Generating…" : `${questions.length} questions ready`}
                </h2>
                {!generating && <Button variant="ghost" size="sm" onClick={generate}>Regenerate</Button>}
              </div>
              {generating ? (
                <div className="space-y-3">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {questions.map((q, i) => (
                    <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs font-mono text-brand-accent mb-1">Q{i + 1}</p>
                      <p className="font-medium mb-3">{q.q}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {q.options.map((o, oi) => (
                          <div key={oi} className={`px-3 py-2 rounded-lg border ${oi === q.correct ? "border-brand-success/40 bg-brand-success/10 text-brand-success" : "border-white/5 bg-white/[0.02]"}`}>
                            {o}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {!generating && questions.length > 0 && (
                <div className="flex gap-2 mt-6">
                  <Button onClick={() => { toast.success("Solo quiz started!"); }} className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
                    Start Solo
                  </Button>
                  <Button onClick={() => navigate({ to: "/battle" })} variant="outline" className="flex-1 border-white/10 bg-white/5">
                    <Swords className="size-4 mr-1.5" />Send to Battle
                  </Button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ChevronLeft className="size-4 mr-1" /> Back
        </Button>
        {step < 2 && (
          <Button onClick={next} className="bg-brand-primary hover:bg-brand-primary/90">
            {step === 1 ? <>Generate <Sparkles className="size-4 ml-1" /></> : <>Next <ChevronRight className="size-4 ml-1" /></>}
          </Button>
        )}
      </div>
    </div>
  );
}
