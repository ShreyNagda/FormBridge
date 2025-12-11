import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50",
      outline:
        "border-[2px] border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900 disabled:opacity-50",
      ghost:
        "bg-transparent hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 disabled:opacity-50",
      danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
      icon: "h-10 w-10 p-2 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "cursor-pointer pagegap-1 inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
