import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MotionSection, StatCounter, GlowOrb } from "@/components/motion-primitives";
import { GlassCard } from "@/components/glass-card";
import { ThemeToggle } from "@/components/theme-toggle";
import arenaImg from "@/assets/landing-arena.jpg";
import uploadImg from "@/assets/landing-upload.jpg";
import { Sparkles, Upload, Swords, Trophy, BookOpen, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CUBA BOARD — Upload, Learn, Challenge, and Win." },
      { name: "description", content: "Turn your notes into AI-powered quiz battles. Compete with classmates, climb the leaderboard, master any subject." },
      { property: "og:title", content: "CUBA BOARD — Upload, Learn, Challenge, and Win." },
      { property: "og:description", content: "AI-powered student learning + multiplayer quiz battles." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-accent/30">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center font-extrabold text-white shadow-lg shadow-brand-primary/30">C</div>
          <span className="font-extrabold tracking-tight text-lg">CUBA BOARD</span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-foreground/70">
          <a href="#features" className="hover:text-brand-accent transition-colors">Features</a>
          <a href="#ai" className="hover:text-brand-accent transition-colors">AI Quiz</a>
          <a href="#battles" className="hover:text-brand-accent transition-colors">Battles</a>
          <a href="#stats" className="hover:text-brand-accent transition-colors">Results</a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/auth/login">Sign in</Link>
          </Button>
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full font-bold">
            <Link to="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 sm:pt-20 pb-24 px-4 sm:px-6 overflow-hidden">
        <GlowOrb className="top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-primary/30" />
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="size-2 bg-brand-success rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/60">New · Live Arena V2</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6 text-balance"
          >
            Upload, Learn, <br />
            <span className="text-gradient-brand">Challenge, and Win.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-foreground/60 max-w-2xl mx-auto mb-10"
          >
            The AI-powered arena where your study notes become battlefields. Convert any PDF into competitive quiz battles and outsmart your classmates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-6 rounded-xl font-bold text-base shadow-xl shadow-brand-primary/30">
              <Link to="/auth/signup">Start Your First Battle</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 rounded-xl font-bold text-base border-white/10 bg-white/5 hover:bg-white/10">
              <Link to="/dashboard">Watch a Demo</Link>
            </Button>
          </motion.div>
        </div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl shadow-brand-primary/10">
            <img
              src={arenaImg} alt="CUBA BOARD live battle arena interface"
              width={1280} height={768}
              className="w-full aspect-[16/9] object-cover rounded-lg"
            />
            <div className="absolute -inset-px rounded-2xl ring-1 ring-white/10 pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <MotionSection className="py-20 px-4 sm:px-6" >
        <div id="features" className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Built for the modern scholar.</h2>
            <p className="text-foreground/60">Five tools. One arena. Zero excuses.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Upload, title: "Upload Notes", desc: "PDFs, slides, handwritten — drop it in." },
              { icon: Sparkles, title: "AI Quiz Generator", desc: "Lethal questions in under 10 seconds." },
              { icon: Swords, title: "Live Battles", desc: "1v1 or 4-player. Bring your A-game." },
              { icon: Trophy, title: "Leaderboards", desc: "Climb global, school, and clan ranks." },
              { icon: BookOpen, title: "Smart Library", desc: "Everything you study, indexed." },
              { icon: Brain, title: "Adaptive Difficulty", desc: "We watch you. Then we hunt you." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="size-10 rounded-xl bg-brand-primary/10 grid place-items-center text-brand-primary mb-4">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-foreground/60">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* AI showcase */}
      <MotionSection className="py-24 px-4 sm:px-6 bg-white/[0.02]">
        <div id="ai" className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Instant AI Intelligence</h2>
            <p className="text-foreground/60 text-lg mb-8 italic">"Upload a 50-page thesis, get a lethal 10-question battle in seconds."</p>
            <div className="space-y-4">
              {[
                { n: "01", title: "Deep Context Parsing", desc: "Our LLMs understand diagrams, formulas, and academic nuance." },
                { n: "02", title: "Adaptive Difficulty", desc: "Questions evolve based on your real-time performance." },
                { n: "03", title: "Battle-Ready Format", desc: "Outputs MCQ, T/F, fill-in — instantly playable." },
              ].map((s, i) => (
                <GlassCard key={s.n} className="p-4 flex gap-4">
                  <div className={`size-10 rounded-lg grid place-items-center font-mono font-bold shrink-0 ${i === 0 ? "bg-brand-accent/15 text-brand-accent" : i === 1 ? "bg-brand-primary/15 text-brand-primary" : "bg-brand-violet/15 text-brand-violet"}`}>
                    {s.n}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="text-sm text-foreground/50">{s.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 p-6 sm:p-8 rounded-3xl border border-white/10">
            <img src={uploadImg} alt="Upload module" loading="lazy" width={1024} height={1024} className="w-full aspect-square object-cover rounded-2xl" />
          </div>
        </div>
      </MotionSection>

      {/* Battle showcase */}
      <MotionSection className="py-24 px-4 sm:px-6">
        <div id="battles" className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Multiplayer that hits hard.</h2>
          <p className="text-foreground/60 mb-12 max-w-xl mx-auto">Create a room, invite friends, and battle in real-time across any subject.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Create a Room", desc: "Pick subject, count, timer. Get a shareable code in seconds.", grad: "from-brand-primary/30 to-transparent" },
              { title: "Live Leaderboard", desc: "Watch scores update in real time as the battle unfolds.", grad: "from-brand-accent/30 to-transparent" },
              { title: "XP & Rewards", desc: "Win to climb ranks. Lose to learn faster. Either way: you grow.", grad: "from-brand-violet/30 to-transparent" },
            ].map((c) => (
              <GlassCard key={c.title} className={`p-6 text-left bg-gradient-to-br ${c.grad}`}>
                <h3 className="font-bold text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-foreground/60">{c.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Stats */}
      <MotionSection className="py-20 px-4 sm:px-6">
        <div id="stats" className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: 40, suffix: "%", label: "Grade Increase", color: "text-brand-accent" },
            { v: 1200000, label: "Quizzes Taken", color: "text-brand-success", format: (n: number) => `${(n / 1_000_000).toFixed(1)}M` },
            { v: 25000, suffix: "+", label: "Active Clans", color: "text-brand-primary" },
            { v: 500, suffix: "+", label: "Schools Joined", color: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-4xl sm:text-5xl font-extrabold mb-1 ${s.color}`}>
                <StatCounter value={s.v} suffix={s.suffix} format={s.format as any} />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">{s.label}</p>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* Testimonials */}
      <MotionSection className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-12 text-center">The Hall of Fame</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "Actually turned studying for my MCAT into a competitive hobby. I haven't missed a day since I joined.", name: "Sarah Jenkins", role: "Pre-Med Student", accent: "bg-brand-primary/30" },
              { q: "The multiplayer battles are intense. We use it in our dorm to settle who has to do the laundry this week.", name: "Leo Zhang", role: "CS Major", accent: "bg-brand-accent/30", featured: true },
              { q: "I upload my lecture recordings and CUBA BOARD generates a battle before I even finish my coffee.", name: "Amara Okafor", role: "Law Student", accent: "bg-brand-success/30" },
            ].map((t) => (
              <GlassCard key={t.name} className={`p-8 ${t.featured ? "ring-1 ring-brand-primary/30" : ""}`}>
                <p className="text-foreground/80 mb-6 leading-relaxed">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full ${t.accent}`} />
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-foreground/40">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Final CTA */}
      <MotionSection className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-violet/30" />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Ready to challenge?</h2>
          <p className="text-foreground/60 mb-8">Join 450k+ students turning study sessions into victories.</p>
          <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-10 py-6 rounded-xl font-bold text-base shadow-xl shadow-brand-primary/30">
            <Link to="/auth/signup">Enter the Arena</Link>
          </Button>
        </div>
      </MotionSection>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-brand-primary grid place-items-center font-bold text-xs text-white">C</div>
            <span className="font-extrabold tracking-tight">CUBA BOARD</span>
          </div>
          <div className="flex gap-6 text-sm text-foreground/40">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Discord</a>
            <a href="#" className="hover:text-foreground">Twitter</a>
          </div>
          <p className="text-xs text-foreground/30">© 2026 CUBA BOARD Labs.</p>
        </div>
      </footer>
    </div>
  );
}
