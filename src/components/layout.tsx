import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center text-xl font-bold text-foreground"
              >
                reisedagboka
              </Link>
            </div>
            <div className="flex items-center">
              <ModeToggle />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <footer className="bg-muted border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            ✍️ <span className="font-semibold">reisedagboka {new Date().getFullYear()}</span><br />
            laget av <span className="relative group cursor-pointer">
              Nina Flaaten
              <span className="absolute -top-8 left-1 -translate-x-1/2 w-64 bg-muted text-foreground text-sm px-4 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Bachelor i Datateknologi fra Universitetet i Bergen
              </span>
            </span> — bygget med Next.js, Vercel &amp; Notion
          </p>
        </div>
      </footer>
    </div>
  );
}
