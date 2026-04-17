import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileNav() {
  return (
    <Sheet>
      <SheetHeader>
        <SheetTitle>Dashboard</SheetTitle>
      </SheetHeader>

      <SheetTrigger>
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 font-bold">LoanFlow</div>
          <nav className="flex-1 px-2">...</nav>
          <div className="p-4 border-t">John Doe</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
