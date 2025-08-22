import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import AppProviders from "./providers";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Hiệp hội Dữ liệu Quốc gia Việt Nam",
  description:
    "Xây dựng hệ sinh thái dữ liệu vì một Việt Nam số mạnh mẽ và bền vững",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={robotoCondensed.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
