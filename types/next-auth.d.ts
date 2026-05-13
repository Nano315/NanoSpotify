import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    // SECURITY: accessToken / refreshToken are intentionally NOT exposed
    // here. They're read server-side via getToken() in lib/spotify-client.ts
    // so the browser bundle never sees them.
    user: {
      username?: string;
    } & DefaultSession["user"];
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
    user?: { name?: string | null; email?: string | null; image?: string | null };
  }
}
