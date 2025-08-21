import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import AppProviders from "@/app/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
  description: "Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
