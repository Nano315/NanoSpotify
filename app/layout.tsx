import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals.css";
import Providers from "./providers";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueShuffle | True Shuffle for Spotify",
  description: "Redécouvrez votre musique. Générez des playlists 100% aléatoires sans l'algorithme répétitif de Spotify. Simple, mathématique, efficace.",
  authors: [{ name: "TrueShuffle Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TrueShuffle",
    description: "Redécouvrez votre musique. Générez des playlists 100% aléatoires.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505]`}
      >
        <Providers>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
