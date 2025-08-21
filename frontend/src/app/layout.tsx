import type { Metadata } from "next"
import "./globals.css"
import AppProviders from "./providers"

export const metadata: Metadata = {
  title: "App",
  description: "Application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}


