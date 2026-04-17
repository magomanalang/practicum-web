"use client";
import { Outlet } from "react-router-dom";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <div className="flex h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
