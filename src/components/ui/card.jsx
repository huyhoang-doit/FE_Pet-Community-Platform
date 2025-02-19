/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

const cardVariants = cva("rounded-lg shadow-sm border transition-all", {
  variants: {
    variant: {
      default:
        "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800",
      outlined: "border border-slate-300 bg-transparent dark:border-slate-700",
      shadow: "shadow-lg border-none",
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-4 text-base",
      lg: "p-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const Card = forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants };
