import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        {
          "bg-blue-100 text-blue-800 hover:bg-blue-200/80": variant === "default",
          "bg-gray-100 text-gray-900 hover:bg-gray-200/80": variant === "secondary",
          "text-gray-900 border border-gray-200": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
