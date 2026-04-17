"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function StickyTopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
    </header>
  );
}
