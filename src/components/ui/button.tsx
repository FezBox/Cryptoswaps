import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 shadow-sm",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "bg-primary-100 text-primary-dark hover:bg-primary-200 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600",
        accent: "bg-accent text-white hover:bg-accent-dark",
        outline: "border border-primary text-primary hover:bg-primary-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-700",
        ghost: "hover:bg-primary-50 text-text-primary dark:hover:bg-zinc-700 dark:text-zinc-100",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const MotionButton = motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, onClick, ...props }, ref) => {
    return (
      <MotionButton
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        onClick={onClick as any}
        {...(props as any)}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
