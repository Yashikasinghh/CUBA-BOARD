import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme";
import { currentUser } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — CUBA BOARD" }, { name: "description", content: "Manage your account, theme, and notifications." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({ battle: true, achievement: true, friend: true, marketing: false });
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">Preferences</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Settings</h1>
      </header>

      <GlassCard className="p-6 space-y-4">
        <div>
          <h2 className="font-bold mb-1">Account</h2>
          <p className="text-sm text-foreground/50">Public info shown on your profile.</p>
        </div>
        <Separator />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Display name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <Button onClick={() => toast.success("Account saved")} className="bg-brand-primary hover:bg-brand-primary/90">Save changes</Button>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <div>
          <h2 className="font-bold mb-1">Appearance</h2>
          <p className="text-sm text-foreground/50">Customize how CUBA BOARD looks.</p>
        </div>
        <Separator />
        <div>
          <Label className="mb-2 block">Theme</Label>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${theme === t ? "bg-brand-primary text-white" : "bg-white/5 hover:bg-white/10"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <div>
          <h2 className="font-bold mb-1">Notifications</h2>
          <p className="text-sm text-foreground/50">Choose what you want to hear about.</p>
        </div>
        <Separator />
        {[
          { key: "battle", label: "Battle invites" },
          { key: "achievement", label: "Achievement unlocks" },
          { key: "friend", label: "Friend requests" },
          { key: "marketing", label: "Product updates & tips" },
        ].map((row) => (
          <div key={row.key} className="flex items-center justify-between py-2">
            <Label htmlFor={row.key}>{row.label}</Label>
            <Switch id={row.key} checked={(notif as any)[row.key]} onCheckedChange={(v) => setNotif({ ...notif, [row.key]: v })} />
          </div>
        ))}
      </GlassCard>

      <GlassCard className="p-6 space-y-4 border-red-500/20">
        <div>
          <h2 className="font-bold mb-1 text-red-400">Danger zone</h2>
          <p className="text-sm text-foreground/50">Permanently delete your account and all data.</p>
        </div>
        <Separator />
        <Button variant="destructive" onClick={() => toast.error("This is a demo — no account was deleted.")}>
          Delete account
        </Button>
      </GlassCard>
    </div>
  );
}
