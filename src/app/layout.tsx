import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css"; // styling
import Layout from "@/components/layout"; // importerer det genrellet sideoppsettet
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] }); // font

// Henter nettsteds-URL fra miljøvariabel, eller bruker standard
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://india-volda-journey.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { // fane-tekst
    default: "Sindres reisedagbok",
    template: `%s | Sindres reise`,
  },
  description: "En personlig blogg om Sindres reiseopplevelser", // meta description i søkeresultater

  openGraph: {
    title: "Sindres reisedagbok",
    description: "En personlig blogg om Sindres reiseopplevelser",
    url: siteUrl,
    siteName: "Sindres reise",
    images: [
      {
        url: `${siteUrl}/opengraph.png`, // opengraph bilde (foreløpig kart over Manipal)
        width: 1200,
        height: 630,
        alt: "Sindres reisedagbok",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Favicon
  icons: {
    icon: "/diary-favicon.ico",
    shortcut: "/diary-favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: `${siteUrl}/site.webmanifest`,
};

// Hoved-layout for hele nettsiden
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrapper innholdet i siden i Layout */}
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
