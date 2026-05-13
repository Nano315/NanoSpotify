export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * Exchange a Spotify refresh token for a fresh access token.
 * Returns null if the refresh fails (network, revoked token, etc.).
 *
 * Shared between the NextAuth jwt callback (lib/auth.ts) and the
 * per-request fallback inside getSpotifyClient (lib/spotify-client.ts).
 */
export async function refreshSpotifyAccessToken(
  refreshToken: string
): Promise<SpotifyTokenResponse | null> {
  try {
    const basicAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      console.error(
        "Spotify token refresh failed:",
        response.status,
        await response.text()
      );
      return null;
    }

    return (await response.json()) as SpotifyTokenResponse;
  } catch (error) {
    console.error("Error refreshing Spotify access token", error);
    return null;
  }
}
