import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bouncers on Tips — Your Backup. On Demand.",
  description:
    "Book bouncers and protection professionals around you — exactly when you need them. On-demand security for events, parties, personal protection, and more.",
  keywords: [
    "bouncers",
    "security",
    "on-demand",
    "protection",
    "event security",
    "personal safety",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bot-bg text-bot-text font-sans">
        {children}
      </body>
    </html>
  );
}
