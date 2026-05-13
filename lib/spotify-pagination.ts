import type SpotifyWebApi from "spotify-web-api-node";

export type SpotifyPlaylistItem = Awaited<
  ReturnType<SpotifyWebApi["getUserPlaylists"]>
>["body"]["items"][number];

/**
 * Spotify's `getUserPlaylists` endpoint is capped at 50 items per page.
 * Several places need every playlist the user owns (to dedupe by name,
 * or to render the complete library), so this helper walks the `next`
 * cursor until the response stops paging.
 *
 * Accepts an optional `callWrapper` so callers that already wrap Spotify
 * calls with retry / logging (e.g. callSpotify in actions/shuffle.ts)
 * can keep using it.
 */
export async function getAllUserPlaylists(
  spotify: SpotifyWebApi,
  callWrapper?: <T>(op: () => Promise<T>) => Promise<T>
): Promise<SpotifyPlaylistItem[]> {
  const all: SpotifyPlaylistItem[] = [];
  const limit = 50;
  let offset = 0;

  const call = callWrapper ?? (<T>(op: () => Promise<T>) => op());

  // Hard cap to guard against an infinite loop if Spotify ever lies about
  // `next`. A user with >2500 playlists is firmly out of scope.
  const HARD_CAP = 50;
  for (let i = 0; i < HARD_CAP; i++) {
    const response = await call(() =>
      spotify.getUserPlaylists({ limit, offset })
    );
    all.push(...response.body.items);
    if (!response.body.next) break;
    offset += limit;
  }

  return all;
}
