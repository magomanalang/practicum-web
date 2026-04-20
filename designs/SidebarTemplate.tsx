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

export default function Sidebar() {
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
          <a
            href="#"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Dashboard
          </a>
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
