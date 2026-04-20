<<<<<<< Updated upstream
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeftIcon } from "lucide-react";
<<<<<<< Updated upstream
=======
import { Home, Menu, X, LucideIcon } from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavigationItem[] = [{ name: "Home", href: "/", icon: Home }];

interface SidebarTemplateProps {
  currentPath?: string; 
}

export function SidebarTemplate({ currentPath = "/" }: SidebarTemplateProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
>>>>>>> Stashed changes

export default function Sidebar() {
=======
import Link from "next/link";

export function SidebarTemplate() {
>>>>>>> Stashed changes
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelLeftIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Access various sections of the application.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-6">
<<<<<<< Updated upstream
          <a
            href="#"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Dashboard
          </a>
=======
          <Link href="/Analytics">Dashboard</Link>
>>>>>>> Stashed changes
          <a
            href="#"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Settings
          </a>
          <a
            href="#"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Profile
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
