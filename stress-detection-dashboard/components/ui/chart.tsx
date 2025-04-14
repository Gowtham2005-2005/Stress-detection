"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("rounded-md border bg-card text-card-foreground p-4", className)} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    formatter?: (value: number, name: string, props: any) => React.ReactNode[]
    labelFormatter?: (value: number | string) => React.ReactNode
  }
>(({ className, formatter, labelFormatter, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-md border bg-secondary text-secondary-foreground p-2 text-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

export { ChartContainer, ChartTooltipContent, ChartTooltip }
