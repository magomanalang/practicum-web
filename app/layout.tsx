"use client";
import "./globals.css";
import Navbar from "@/app/_navigation/NavBar";
import { SessionProvider } from "next-auth/react";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", "font-sans", inter.variable, geistHeading.variable)}
    >
      <body className="bg-green-950 text-zinc-300 min-h-screen">
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
