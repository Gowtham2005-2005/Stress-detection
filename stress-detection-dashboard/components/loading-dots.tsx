"use client"

import { cn } from "@/lib/utils"

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1 items-center justify-center", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  )
}

// Add a new Instagram-style typing indicator component
export function InstagramTypingIndicator() {
  return (
    <div className="flex mt-2">
      <div className="bg-background border rounded-2xl rounded-tl-sm p-3 shadow-sm">
        <div className="flex space-x-1 items-center h-6">
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  )
}
