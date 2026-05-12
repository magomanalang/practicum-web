import Link from "next/link";
import { SidebarTemplate } from "./SidebarTemplate";
import { useSession } from "next-auth/react";

export default function Navbar() {
  useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center gap-2">
            <div className="flex justify-start w-full">
              <SidebarTemplate />
            </div>
            <span className="font-bold text-xl tracking-tight px-8 text-green-950">
              LOANDEX
            </span>
          </div>

          <div className="hidden md:flex space-x-8 text-green-950">
            <a
              href="/application"
              className="text-sm font-medium hover:text-green-700 transition-colors"
            >
              Apply for Loan
            </a>
            <Link
              href="/"
              className="text-sm font-medium hover:text-green-700 transition-colors"
            >
              Home
            </Link>

            <a
              href="#"
              className="text-sm font-medium hover:text-green-700 transition-colors"
            >
              History
            </a>

            <a
              href="#"
              className="text-sm font-medium hover:text-green-700 transition-colors"
            >
              Calculator
            </a>
          </div>

          <div className="flex items-center">
            <Link href="/login">
              <button className="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-50 hover:text-green-950 transition-all">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white hover:bg-green-900 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
