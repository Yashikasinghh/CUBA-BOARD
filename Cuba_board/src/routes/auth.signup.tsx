import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/glass-card";
import { GlowOrb } from "@/components/motion-primitives";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create account — CUBA BOARD" }, { name: "description", content: "Join the arena." }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center px-4 py-10 relative overflow-hidden">
      <GlowOrb className="top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-violet/30" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center font-extrabold text-white">C</div>
          <span className="font-extrabold tracking-tight text-lg">CUBA BOARD</span>
        </Link>
        <GlassCard className="p-8">
          <h1 className="text-2xl font-extrabold mb-1">Join the arena.</h1>
          <p className="text-sm text-foreground/60 mb-6">Free forever for students.</p>
          <form onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => navigate({ to: "/dashboard" }), 600); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first">First name</Label>
                <Input id="first" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last">Last name</Label>
                <Input id="last" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Student email</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-6">
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="text-sm text-center text-foreground/60 mt-6">
            Already a player? <Link to="/auth/login" className="text-brand-accent font-semibold hover:underline">Sign in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
