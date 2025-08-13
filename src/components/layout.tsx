import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle"; // light/dark mode

// Forteller hvilke props Layout-komponenten forventer å få inn
interface LayoutProps {
  children: ReactNode;
}

// Hovedkomponenten Layout
export default function Layout({ children }: LayoutProps) {
  return (
    // Wrapper rundt hele siden, setter minimum høyde til hele skjermen og bakgrunnsfarge
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Link til forsiden */}
              <Link href="/" className="flex items-center text-xl font-bold text-foreground">reisedagboka</Link>
            </div>
            <div className="flex items-center">
              {/* Light/dark mode switch */}
              <ModeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Hovedinnhold */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t"> {/* dempet farge, tynn strek for adskilling */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {/* max bredde, midstilt, padding ulike skjermstørrelser */}
          <p className="text-center text-sm text-muted-foreground leading-relaxed"> {/* midstilt, liten tekst, dempet farge, større linjeavstand */}
            ✍️ <span className="font-semibold">reisedagboka {new Date().getFullYear()}</span><br />
            Nina Flaaten — bygget med Next.js, Vercel &amp; Notion
          </p>
        </div>
      </footer>
    </div>
  );
}
