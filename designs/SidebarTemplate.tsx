import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PanelLeftIcon,
  LayoutDashboard,
  Settings,
  UserCircle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { Database, GitMerge, LayoutList, ShieldCheck, Tag } from "lucide-react";
import { NavSection } from "./NavSection";

export const appLinks = [
  {
    href: "/dev/sections",
    label: "Manage Sections",
    icon: LayoutList,
  },
  { href: "/offers", label: "Offers", icon: Database },
  { href: "/calculator", label: "Calculator", icon: UserCircle },
  { href: "/history", label: "History", icon: GitMerge },
  { href: "/promotions", label: "Promotions", icon: Tag },
  { href: "/profile", label: "Roles", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: ShieldCheck },
];

export const devLinks = [
  { href: "/dev/sections", label: "Manage Sections", icon: LayoutList },
  { href: "/dev/cruds", label: "CRUD Builder", icon: Database },
  { href: "/dev/roles", label: "Roles", icon: ShieldCheck },
  { href: "/dev/role-map", label: "Map Roles", icon: GitMerge },
  { href: "/dev/promotions", label: "Promotions Config", icon: Tag },
];

const isDev = process.env.NODE_ENV === "development";

export function SidebarTemplate() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed left-4 top-4">
          <PanelLeftIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-75 sm:w-100">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            <span>App Name</span>
          </SheetTitle>
          <SheetDescription>
            Access various sections of the application.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          <NavSection links={appLinks} />

          {isDev && (
            <>
              <div className="mt-4 mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t pt-4">
                Dev / Admin
              </div>
              <NavSection links={devLinks} />
            </>
          )}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Version 1.0.2
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
