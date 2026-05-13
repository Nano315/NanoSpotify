import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import { refreshSpotifyAccessToken } from "@/lib/spotify-refresh";

const SCOPES = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-top-read",
].join(" ");

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
  const refreshed = await refreshSpotifyAccessToken(token.refreshToken);
  if (!refreshed) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
  return {
    ...token,
    accessToken: refreshed.access_token,
    expiresAt: Date.now() + refreshed.expires_in * 1000,
    // Fall back to old refresh token if Spotify doesn't rotate it.
    refreshToken: refreshed.refresh_token ?? token.refreshToken,
    error: undefined,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SCOPES,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      // Buffer of 1 minute just to be safe
      if (token.expiresAt && Date.now() < token.expiresAt - 60000) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // SECURITY: never expose accessToken / refreshToken here. The
      // session callback runs server-side but its output is shipped to
      // every client via /api/auth/session. Server actions read the JWT
      // directly via getSpotifyClient() instead.
      session.error = token.error;

      if (token.user) {
        session.user.name = token.user.name ?? null;
        session.user.image = token.user.image ?? null;
        session.user.email = token.user.email ?? null;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
