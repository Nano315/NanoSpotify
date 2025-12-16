"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-white/80">
          Connecté en tant que <span className="font-bold text-green-400">{session.user?.email}</span>
        </p>
        <button
          onClick={() => signOut()}
          className="rounded-full bg-red-500/10 px-6 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("spotify")}
      className="rounded-full bg-[#1DB954] px-8 py-3 font-bold text-black transition-transform hover:scale-105 active:scale-95"
    >
      Se connecter avec Spotify
    </button>
  );
}
