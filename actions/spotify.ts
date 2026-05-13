"use server";

import { getSpotifyClient } from "@/lib/spotify-client";
import { getAllUserPlaylists } from "@/lib/spotify-pagination";

export async function getUserPlaylists() {
  const spotify = await getSpotifyClient();

  if (!spotify) {
    console.warn("No Spotify client available (user probably not logged in)");
    return [];
  }

  try {
    // Paginate every playlist + grab Liked Songs count in parallel
    const [items, likedSongsResponse] = await Promise.all([
      getAllUserPlaylists(spotify),
      spotify.getMySavedTracks({ limit: 1 }),
    ]);
    const likedSongsCount = likedSongsResponse.body.total;

    const playlists = items
      .filter((playlist) => !playlist.name.endsWith(" - Shuffle"))
      .map(
        (playlist): {
          id: string;
          name: string;
          image: string | null;
          tracks: number;
        } => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.images?.[0]?.url ?? null,
          tracks: playlist.tracks.total,
        })
      );

    // Add Liked Songs "Virtual" Playlist at the beginning
    if (likedSongsCount > 0) {
        playlists.unshift({
            id: "liked-songs",
            name: "Titres Likés",
            image: null, // UI will handle this with a heart icon or static image
            tracks: likedSongsCount,
        });
    }

    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}
