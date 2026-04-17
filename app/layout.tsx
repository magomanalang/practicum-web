import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import "./globals.css";
import StickyTopBar from "@/designs/StickyTopBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SidebarProvider>
          <Sidebar />
          <main>
            <StickyTopBar />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
