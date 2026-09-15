import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { currentUser, notifications } from "@/lib/mock-data";

export function Topbar() {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <header className="sticky top-0 z-40 h-14 flex items-center gap-3 px-3 sm:px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <SidebarTrigger className="shrink-0" />
      <div className="hidden md:flex relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search notes, quizzes, friends…" className="pl-9 bg-muted/40 border-border/50" />
      </div>
      <div className="flex-1 md:hidden" />
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20">
        <span className="size-1.5 rounded-full bg-brand-success animate-pulse" />
        <span className="text-xs font-mono font-bold text-brand-primary">{currentUser.points.toLocaleString()} XP</span>
      </div>
      <ThemeToggle />
      <Button asChild variant="ghost" size="icon" className="relative" aria-label="Notifications">
        <Link to="/notifications">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-accent ring-2 ring-background" />
          )}
        </Link>
      </Button>
      <Link to="/profile" className="size-9 shrink-0 rounded-full bg-gradient-to-br from-brand-primary to-brand-violet grid place-items-center font-bold text-white text-sm">
        {currentUser.avatar}
      </Link>
    </header>
  );
}
