"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";

import StickyTopBar from "@/designs/StickyTopBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <Sidebar>
            <SidebarContent></SidebarContent>
          </Sidebar>

          <main className="flex flex-col flex-1">
            <StickyTopBar />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
