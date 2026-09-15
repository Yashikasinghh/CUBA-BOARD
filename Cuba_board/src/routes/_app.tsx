import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute top-[-20%] left-[20%] w-[800px] h-[500px] rounded-full bg-brand-primary/10 blur-[140px] -z-10" />
            <div aria-hidden className="pointer-events-none absolute bottom-[-10%] right-[-5%] w-[600px] h-[500px] rounded-full bg-brand-violet/10 blur-[140px] -z-10" />
            <motion.div
              key="route"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 sm:px-6 lg:px-8 py-6"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
