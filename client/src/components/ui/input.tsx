import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "light" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "dark", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-lg border border-[hsl(var(--mc-accent))] bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-md autofill:bg-[hsl(var(--mc-background))] autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--mc-background))]",
            variant === "dark"
              ? "text-white caret-white placeholder-white/60"
              : "text-black caret-black placeholder-gray-400",
            isPassword ? "pr-12" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 hover:text-[hsl(var(--mc-accent))] focus:outline-none",
              variant === "dark" ? "text-white" : "text-black"
            )}
            onClick={() => setShowPassword((v) => !v)}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
