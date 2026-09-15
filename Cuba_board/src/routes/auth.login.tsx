import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/glass-card";
import { GlowOrb } from "@/components/motion-primitives";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — CUBA BOARD" }, { name: "description", content: "Welcome back, scholar." }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden">
      <GlowOrb className="top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/30" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center font-extrabold text-white">C</div>
          <span className="font-extrabold tracking-tight text-lg">CUBA BOARD</span>
        </Link>
        <GlassCard className="p-8">
          <h1 className="text-2xl font-extrabold mb-1">Welcome back.</h1>
          <p className="text-sm text-foreground/60 mb-6">Sign in to enter the arena.</p>
          <form onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => navigate({ to: "/dashboard" }), 500); }} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="alex@school.edu" required defaultValue="alex@cuba.board" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-brand-accent hover:underline">Forgot?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required defaultValue="demo1234" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-6">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-foreground/40">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-white/10 bg-white/5">Google</Button>
            <Button variant="outline" className="border-white/10 bg-white/5">GitHub</Button>
          </div>
          <p className="text-sm text-center text-foreground/60 mt-6">
            No account? <Link to="/auth/signup" className="text-brand-accent font-semibold hover:underline">Sign up</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
