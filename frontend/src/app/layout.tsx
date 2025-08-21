"use client";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Provider } from "@/components/provider";

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


