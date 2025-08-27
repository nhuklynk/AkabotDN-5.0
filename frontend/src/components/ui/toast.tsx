"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

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

const getToastIcon = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "destructive":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-600" />
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />
    default:
      return null
  }
}

const getToastStyles = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return "border-green-200 bg-green-50 text-green-900"
    case "destructive":
      return "border-red-200 bg-red-50 text-red-900"
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900"
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-900"
    default:
      return "border-gray-200 bg-white text-gray-900"
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    const duration = toast.durationMs ?? 5000
    setToasts((prev) => [...prev, { id, ...toast }])
    window.setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "min-w-[320px] max-w-[420px] rounded-lg border p-4 shadow-lg backdrop-blur-sm",
              "transform transition-all duration-300 ease-in-out",
              "animate-in slide-in-from-right-full",
              getToastStyles(t.variant || "default")
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              {getToastIcon(t.variant || "default")}
              <div className="flex-1 space-y-1">
                {t.title && (
                  <div className="font-semibold leading-tight">{t.title}</div>
                )}
                {t.description && (
                  <div className="text-sm leading-relaxed opacity-90">{t.description}</div>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-2 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}