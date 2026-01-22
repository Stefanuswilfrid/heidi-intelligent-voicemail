import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Heidi Calls — Intelligent Voicemail",
  description: "AI-powered voicemail triage for clinical teams: urgent flags, review queues, and safe auto-resolution.",
  icons: {
    icon: [{ url: "/logo/heidi-logo.png", type: "image/png" }],
    apple: [{ url: "/logo/heidi-logo.png", type: "image/png" }],
    shortcut: ["/logo/heidi-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
