"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Menu, X, Music, Radio, Shuffle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Bibliothèque", icon: Music, href: "/" },
    { label: "Vibe Echo", icon: Radio, href: "/vibe" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30">
      {/* Top Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-[0_0_15px_rgba(30,215,96,0.3)]">
              <Shuffle className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight">NanoSpotify</span>
          </div>

          {session?.user && (
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-3 sm:flex">
                <span className="text-sm font-medium text-white/80">{session.user.name}</span>
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full ring-2 ring-white/10" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <button onClick={() => signOut()} className="ml-2 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
              <button className="sm:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto min-h-screen max-w-7xl pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Mobile Nav / Desktop Sidebar Replacement for MVP */}
      {/* For this MVP, we use a bottom bar on mobile and simple top nav for desktop implicitly via header above, 
          but requested specific BottomNav. Let's add a fixed BottomNav for mobile. */}
      
      {session && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#050505]/90 pb-safe backdrop-blur-xl sm:hidden">
          <div className="flex justify-around p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-green-500" : "text-white/50"}`}>
                  <item.icon className={`h-6 w-6 ${isActive && "drop-shadow-[0_0_8px_rgba(30,215,96,0.5)]"}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
