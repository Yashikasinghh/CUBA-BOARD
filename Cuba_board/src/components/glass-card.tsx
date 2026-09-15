import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

export const GlassCard = forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { children?: ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "dark:bg-white/[0.03] dark:border-white/10",
        "bg-white/70 border-black/5 shadow-sm",
        "dark:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
GlassCard.displayName = "GlassCard";
