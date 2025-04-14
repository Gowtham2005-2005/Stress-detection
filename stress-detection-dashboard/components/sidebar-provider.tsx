"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type DetectionMode = "text" | "voice" | "signal" | "combined"

interface SidebarContextType {
  activeMode: DetectionMode
  setActiveMode: (mode: DetectionMode) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  results: any | null
  setResults: (results: any) => void
  text: string
  setText: (text: string) => void
  error: string | null
  setError: (error: string | null) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [activeMode, setActiveMode] = useState<DetectionMode>("text")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any | null>(null)
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)

  return (
    <SidebarContext.Provider
      value={{
        activeMode,
        setActiveMode,
        isLoading,
        setIsLoading,
        results,
        setResults,
        text,
        setText,
        error,
        setError,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
