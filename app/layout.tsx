import type { Metadata } from "next";
import { Cairo, Outfit, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import CustomEffects from "@/components/ui/custom-effects";
import PwaRegister from "./PwaRegister";
import "./globals.css";

const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alihaggag.me"),
  title: "Ali Haggag | Full-Stack Developer",
  description: "Portfolio of Ali Haggag, a Full-Stack Developer specializing in the MERN stack — React, Node.js, Express, and MongoDB.",
  keywords: ["Full-Stack Developer", "MERN Stack", "React", "Node.js", "Portfolio"],
  authors: [{ name: "Ali Haggag" }],
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ali Haggag",
  },
  openGraph: {
    title: "Ali Haggag | Full-Stack Developer",
    description: "Full-Stack Developer specializing in the MERN stack.",
    url: "https://alihaggag.me",
    siteName: "Ali Haggag Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ali Haggag Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Haggag | Full-Stack Developer",
    description: "Full-Stack Developer specializing in the MERN stack.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is intentional — next-themes adds the theme class
    // client-side, which always differs from the server render. This is expected.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * No inline theme script needed — globals.css already defaults :root to dark,
         * so the browser paints dark on frame 1 before any JS runs.
         * next-themes handles class toggling after hydration via ThemeProvider.
         */}
      </head>
      <body className={`${cairo.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <PwaRegister />
          {children}
          <CustomEffects />
        </ThemeProvider>
      </body>
    </html>
  );
}