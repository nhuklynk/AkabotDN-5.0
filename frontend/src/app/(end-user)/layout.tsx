import type React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { Header } from "@/layouts/header";
import { Footer } from "@/layouts/footer";

export const metadata: Metadata = {
  title: "Hiệp hội Dữ liệu Quốc gia Việt Nam",
  description: "Trang chủ chính thức của Hiệp hội Dữ liệu Quốc gia Việt Nam",
  generator: "v0.app",
};

export default function EndUserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white">{children}</main>
      <Footer />
    </div>
  );
}
