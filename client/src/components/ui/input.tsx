import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-lg border border-[hsl(var(--mc-accent))] bg-transparent text-white caret-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-md autofill:bg-[hsl(var(--mc-background))] autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--mc-background))]",
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-[hsl(var(--mc-accent))] focus:outline-none"
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
