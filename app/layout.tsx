"use client";
import "./globals.css";
import Navbar from "@/designs/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <html>
        <body>{children}</body>
      </html>
    </>
  );
}
