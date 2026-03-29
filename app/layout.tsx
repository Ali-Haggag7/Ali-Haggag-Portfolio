import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import CustomEffects from "@/components/ui/custom-effects";
import PwaRegister from "./PwaRegister";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali Haggag | Full-Stack Developer",
  description: "Portfolio of Ali Haggag, a Full-Stack Developer specializing in the MERN stack — React, Node.js, Express, and MongoDB.",
  keywords: ["Full-Stack Developer", "MERN Stack", "React", "Node.js", "Portfolio"],
  authors: [{ name: "Ali Haggag" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ali Haggag | Full-Stack Developer",
    description: "Full-Stack Developer specializing in the MERN stack.",
    url: "https://alihaggag.me",
    siteName: "Ali Haggag Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Haggag | Full-Stack Developer",
    description: "Full-Stack Developer specializing in the MERN stack.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PwaRegister />
          {children}
          <CustomEffects />
        </ThemeProvider>
      </body>
    </html>
  );
}