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
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircle className="h-4 w-4" />
            Profile
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircle className="h-4 w-4" />
            Offers
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircle className="h-4 w-4" />
            Special Promotions
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircle className="h-4 w-4" />
            Apply for Loan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <UserCircle className="h-4 w-4" />
            Calculator
          </Link>
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
