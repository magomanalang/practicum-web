"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function StickyTopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="text-sm text-muted-foreground">
        Friday, April 17, 2026
      </div>
    </header>
  );
}
