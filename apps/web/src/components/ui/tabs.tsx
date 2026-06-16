"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple functional Tabs implementation since Radix might not be installed or configured
export const Tabs = ({ children, defaultValue, onValueChange, className }: any) => {
  const [value, setValue] = React.useState(defaultValue)
  
  const handleChange = (newVal: string) => {
    setValue(newVal)
    onValueChange?.(newVal)
  }

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { activeValue: value, onValueChange: handleChange })
        }
        return child
      })}
    </div>
  )
}

export const TabsList = ({ children, className, activeValue, onValueChange }: any) => (
  <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as any, { activeValue, onValueChange })
      }
      return child
    })}
  </div>
)

export const TabsTrigger = ({ children, value, className, activeValue, onValueChange }: any) => (
  <button
    onClick={() => onValueChange(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeValue === value ? "bg-background text-foreground shadow" : "",
      className
    )}
  >
    {children}
  </button>
)

export const TabsContent = ({ children, value, activeValue, className }: any) => {
  if (value !== activeValue) return null
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>
}
