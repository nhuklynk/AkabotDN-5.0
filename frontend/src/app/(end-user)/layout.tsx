import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";

/* Added Vietnamese-friendly fonts with proper subsets */
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Hiệp hội Dữ liệu Quốc gia Việt Nam",
  description: "Trang chủ chính thức của Hiệp hội Dữ liệu Quốc gia Việt Nam",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
