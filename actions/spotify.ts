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
    const response = await spotify.getUserPlaylists({ limit: 50 });
    
    return response.body.items
      .filter((playlist: any) => !playlist.name.endsWith(" - Alter"))
      .map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images?.[0]?.url ?? null,
        tracks: playlist.tracks.total,
      }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}
