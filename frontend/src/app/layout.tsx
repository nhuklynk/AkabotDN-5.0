"use client";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Provider } from "@/components/provider";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
