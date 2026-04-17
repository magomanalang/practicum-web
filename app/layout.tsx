"use client";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="shrink-0 flex items-center gap-2">
                <div className="flex justify-start w-full">
                  <Button variant="outline">S</Button>
                </div>
                <span className="font-bold text-xl tracking-tight">BRAND</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a
                  href="#"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Product
                </a>
                <a
                  href="#"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Resources
                </a>
                <a
                  href="#"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Pricing
                </a>
              </div>

              <div>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
