"use server";

import { getSpotifyClient } from "@/lib/spotify-client";

export async function getUserPlaylists() {
  const spotify = await getSpotifyClient();

  if (!spotify) {
    console.warn("No Spotify client available (user probably not logged in)");
    return [];
  }

  try {
    // Fetch first 50 playlists
    const playlistsResponse = await spotify.getUserPlaylists({ limit: 50 });
    
    // Fetch Liked Songs count
    const likedSongsResponse = await spotify.getMySavedTracks({ limit: 1 });
    const likedSongsCount = likedSongsResponse.body.total;

    const playlists = playlistsResponse.body.items
      .filter((playlist: any) => !playlist.name.endsWith(" - Shuffle"))
      .map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images?.[0]?.url ?? null,
        tracks: playlist.tracks.total,
      }));

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
