"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * Detects when the NextAuth jwt callback has marked the session as
 * `RefreshAccessTokenError` (Spotify refresh token revoked / expired)
 * and surfaces an actionable toast instead of letting every server
 * action silently return empty data — which would otherwise look to
 * the user like they had been logged out without warning.
 *
 * Rendered once at the root inside <SessionProvider> in app/providers.tsx.
 */
export default function SessionGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error !== "RefreshAccessTokenError") return;

    toast.error("Votre session Spotify a expiré.", {
      id: "session-expired",
      description: "Veuillez vous reconnecter pour continuer.",
      duration: Infinity,
      action: {
        label: "Se reconnecter",
        onClick: () => {
          toast.dismiss("session-expired");
          signOut({ callbackUrl: "/" });
        },
      },
    });
  }, [session?.error]);

  return null;
}
