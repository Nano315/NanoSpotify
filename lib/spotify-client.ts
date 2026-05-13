import { getToken, encode, type JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import SpotifyWebApi from "spotify-web-api-node";
import { refreshSpotifyAccessToken } from "@/lib/spotify-refresh";

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

// Match NextAuth's default session.maxAge (30 days).
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Reads the NextAuth JWT cookie directly (without going through the
 * `session` callback) so that the access/refresh tokens never reach
 * the client bundle. If the access token is expired we transparently
 * refresh it AND re-encode the cookie so subsequent requests don't
 * have to refresh again with a possibly-rotated refresh token.
 *
 * The cookie write only succeeds when called from a Server Action or
 * Route Handler; in Server Component reads the write throws and we
 * swallow it — the current request still has the freshly-refreshed
 * access token, only the next Server Action would have to re-refresh.
 */
export async function getSpotifyClient(): Promise<SpotifyWebApi | null> {
  const cookieStore = await cookies();
  const cookieMap: Record<string, string> = {};
  for (const c of cookieStore.getAll()) cookieMap[c.name] = c.value;

  const token = await getToken({
    // getToken only reads req.cookies / req.headers — anything else on
    // req is unused, so we forge a minimal shape from next/headers.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: { cookies: cookieMap, headers: {} } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.accessToken) return null;

  let accessToken = token.accessToken;

  if (token.expiresAt && Date.now() > token.expiresAt - 60_000) {
    if (!token.refreshToken) return null;
    const refreshed = await refreshSpotifyAccessToken(token.refreshToken);
    if (!refreshed) return null;
    accessToken = refreshed.access_token;

    const updated: JWT = {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    };
    try {
      const encoded = await encode({
        token: updated,
        secret: process.env.NEXTAUTH_SECRET!,
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
      cookieStore.set(SESSION_COOKIE_NAME, encoded, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
    } catch {
      // cookies().set() throws inside Server Component reads. The
      // refreshed access token is still used for THIS request — the
      // next Server Action will re-refresh, which is wasteful but
      // safe (Spotify accepts repeated refresh calls until it
      // actually rotates the refresh token).
    }
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  spotifyApi.setAccessToken(accessToken);
  return spotifyApi;
}
