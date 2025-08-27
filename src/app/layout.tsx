import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SideHustleSnaps - Discover the Best Side Hustles",
  description: "Explore a comprehensive collection of side hustle opportunities to earn extra income, build new skills, and pursue your passions.",
  keywords: "side hustle, earn extra money, freelancing, online business, passive income",
  metadataBase: new URL("https://https://sidehustlesnaps.com/"),
  openGraph: {
    title: "SideHustleSnaps - Discover the Best Side Hustles",
    description: "Explore side hustles to earn extra income and achieve financial freedom.",
    url: "https://https://sidehustlesnaps.com/",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SideHustleSnaps",
            url: "https://https://sidehustlesnaps.com/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://https://sidehustlesnaps.com//sidehustles?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}