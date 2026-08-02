"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

/**
 * Lightweight checkbox aligned with Switch focus/token treatment.
 * Use with an external Label via htmlFor + id (no wrapping label).
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked = false, onCheckedChange, disabled, id, ...props }, ref) => {
        return (
            <span
                className={cn(
                    "relative inline-flex h-4 w-4 shrink-0 items-center justify-center",
                    disabled && "opacity-50"
                )}
            >
                <input
                    ref={ref}
                    id={id}
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    {...props}
                />
                <span
                    className={cn(
                        "pointer-events-none flex h-4 w-4 items-center justify-center rounded-sm border border-primary shadow transition-colors",
                        "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                        "peer-checked:bg-primary peer-checked:text-primary-foreground",
                        "bg-background",
                        className
                    )}
                    aria-hidden
                >
                    {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                </span>
            </span>
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
