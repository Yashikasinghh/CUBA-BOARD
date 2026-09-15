import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notes, type Note, type Subject } from "@/lib/mock-data";
import { Search, Upload, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";

const subjects: (Subject | "All")[] = ["All", "Biology", "History", "Math", "Physics", "Law", "CS"];

export const Route = createFileRoute("/_app/library")({
  head: () => ({ meta: [{ title: "Library — CUBA BOARD" }, { name: "description", content: "All your study materials." }] }),
  component: Library,
});

function Library() {
  const [list, setList] = useState<Note[]>(notes);
  const [q, setQ] = useState("");
  const [sub, setSub] = useState<Subject | "All">("All");

  const filtered = list.filter((n) =>
    (sub === "All" || n.subject === sub) &&
    n.title.toLowerCase().includes(q.toLowerCase())
  );

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const newNote: Note = {
      id: `n${Date.now()}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      subject: "Biology",
      pages: Math.floor(Math.random() * 40) + 5,
      updated: "just now",
      color: "from-brand-primary/30 to-brand-accent/30",
    };
    setList([newNote, ...list]);
    toast.success("Note uploaded", { description: `${file.name} ready for quiz generation` });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-foreground/40">Study Material</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight truncate">Library</h1>
        </div>
        <label className="shrink-0">
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.txt,.md,.docx,.pptx" />
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90 cursor-pointer">
            <span><Upload className="size-4 mr-1.5" />Upload</span>
          </Button>
        </label>
      </header>

      {/* Upload zone */}
      <label className="block">
        <input type="file" className="hidden" onChange={handleUpload} />
        <GlassCard className="p-10 border-dashed border-2 border-white/10 hover:border-brand-primary/50 transition-colors cursor-pointer text-center">
          <div className="size-12 mx-auto rounded-2xl bg-brand-primary/10 text-brand-primary grid place-items-center mb-3">
            <Upload className="size-5" />
          </div>
          <p className="font-bold mb-1">Drop a file or click to upload</p>
          <p className="text-sm text-foreground/50">PDF, TXT, DOCX, PPTX · up to 50MB</p>
        </GlassCard>
      </label>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your notes…" className="pl-9 bg-muted/40 border-border/50" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                sub === s ? "bg-brand-primary text-white" : "bg-white/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <GlassCard className="p-5 flex flex-col h-full group hover:-translate-y-0.5 transition-transform">
              <div className={`h-24 rounded-xl bg-gradient-to-br ${n.color} mb-4 grid place-items-center`}>
                <FileText className="size-8 text-white/60" />
              </div>
              <Badge variant="outline" className="self-start mb-2 border-white/10 text-foreground/60">{n.subject}</Badge>
              <h3 className="font-bold mb-1 truncate">{n.title}</h3>
              <p className="text-xs text-foreground/40 mb-4">{n.pages} pages · {n.updated}</p>
              <div className="flex gap-2 mt-auto">
                <Button asChild size="sm" className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
                  <Link to="/quiz"><Sparkles className="size-3.5 mr-1" />Generate Quiz</Link>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-foreground/40">No notes match your filter.</div>
        )}
      </div>
    </div>
  );
}
