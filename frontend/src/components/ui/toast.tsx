"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info"

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  durationMs?: number
}

type ToastContextValue = {
  toasts: Toast[]
  show: (toast: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>")
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    const duration = toast.durationMs ?? 3000
    setToasts((prev) => [...prev, { id, ...toast }])
    window.setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "min-w-[240px] rounded-md border p-3 shadow-md bg-card text-card-foreground",
              t.variant === "destructive" && "border-destructive/40 bg-destructive/10",
              t.variant === "success" && "border-green-500/40 bg-green-500/10",
              t.variant === "warning" && "border-amber-500/40 bg-amber-500/10",
              t.variant === "info" && "border-blue-500/40 bg-blue-500/10",
            )}
            role="status"
            aria-live="polite"
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}


