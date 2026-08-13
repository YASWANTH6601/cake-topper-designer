import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { editorFontVariables } from "@/lib/editor-fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cake Topper Designer | Create Beautiful Toppers",
  description:
    "Create print-ready cake topper designs with easy tools, beautiful templates, and custom AI artwork.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${editorFontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
