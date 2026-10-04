import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/cn";

export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    className={cn("h-2 w-full overflow-hidden rounded-full bg-stone-200", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full bg-accent-600 transition-all"
      style={{ width: `${value ?? 0}%` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";
