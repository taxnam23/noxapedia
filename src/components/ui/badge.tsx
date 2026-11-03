import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
        secondary:
          "border-slate-700 bg-slate-800/80 text-slate-300",
        outline:
          "border-border text-foreground",
        low:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        moderate:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
        high:
          "border-orange-500/30 bg-orange-500/10 text-orange-300",
        critical:
          "border-rose-500/40 bg-rose-500/15 text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

