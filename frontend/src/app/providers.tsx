"use client"

import { Provider } from "react-redux"
import { store } from "@/store"
import { I18nextProvider } from "react-i18next"
import { initI18n } from "@/lib/i18n/config"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const i18n = initI18n()
  const [queryClient] = useState(() => new QueryClient())
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}


