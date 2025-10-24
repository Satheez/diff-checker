"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent focus-visible:ring-offset-background",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-accent focus-visible:ring-offset-background",
  ghost:
    "bg-transparent text-foreground hover:bg-muted focus-visible:ring-accent focus-visible:ring-offset-background",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted focus-visible:ring-accent focus-visible:ring-offset-background",
  danger:
    "bg-danger/90 text-white hover:bg-danger focus-visible:ring-danger focus-visible:ring-offset-background",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
          VARIANT_CLASSES[variant],
          className,
        )}
        aria-busy={isLoading}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
