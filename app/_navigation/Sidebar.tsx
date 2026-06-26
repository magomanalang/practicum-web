"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavSection } from "@/app/_navigation/NavSection";
import { PanelLeftIcon, UserCircle, Calculator } from "lucide-react";
import { Database, GitMerge, LayoutList, ShieldCheck, Tag } from "lucide-react";

export const appLinks = [
  { href: "/offers", label: "Offers", icon: Database },
  { href: "/promotions", label: "Promotions", icon: Tag },
  { href: "/profile", label: "Profile", icon: ShieldCheck },
  { href: "/calculator", label: "Loan Calculator", icon: Calculator },
  { href: "/customers", label: "Customers", icon: UserCircle },
];

export const approverLinks = [
  { href: "/approver/loans", label: "Approve/Reject Loans", icon: LayoutList },
  {
    href: "/approver/applicationforms",
    label: "Approve/Reject Application Forms",
    icon: Database,
  },
  {
    href: "/approver/analytics",
    label: "Analytics",
    icon: Database,
  },
  {
    href: "/approver/reports",
    label: "Reports",
    icon: Database,
  },
];

export const devAdminLinks = [
  { href: "/dev/products", label: "Manage Products", icon: LayoutList },
  {
    href: "/dev/products-requests",
    label: "Manage Product Requests",
    icon: Database,
  },
  { href: "/dev/employees", label: "Employees Table", icon: ShieldCheck },
  { href: "/dev/role-map", label: "Employee Roles", icon: GitMerge },
  {
    href: "/dev/role-map-requests",
    label: "Employee Roles Requests",
    icon: GitMerge,
  },

  {
    href: "/dev/register-employees",
    label: "Register Employees",
    icon: UserCircle,
  },
  {
    href: "/dev/register-employees-requests",
    label: "Register Employees Requests",
    icon: UserCircle,
  },
  { href: "/dev/promotions", label: "Promotions Config", icon: Tag },
  { href: "/dev/audit-logs", label: "Audit Logs", icon: GitMerge },
];

const isDev = process.env.NODE_ENV === "development";

export function SidebarTemplate() {
  const { data: session } = useSession();
  console.log("CURRENT ACTIVE SESSION STATE:", session);
  const user = session?.user;
  const displayName = user?.employeeId || "Guest";
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed left-4 top-4">
          <PanelLeftIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-75 sm:w-100 max-h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {" "}
        <SheetHeader className="border-b pb-4 text-left">
          <SheetTitle>{fullName}</SheetTitle>
          <SheetDescription>{displayName}</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          <NavSection links={appLinks} />

          <div className="mt-4 mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t pt-4">
            Employee
          </div>
          <NavSection links={approverLinks} />

          {isDev && (
            <>
              <div className="mt-4 mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t pt-4">
                Dev / Admin
              </div>
              <NavSection links={devAdminLinks} />
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
