"use server";

import { getSpotifyClient } from "@/lib/spotify-client";
import { getAllUserPlaylists } from "@/lib/spotify-pagination";
import { getTopTracks, Track } from "./top-tracks";

export async function saveTopTracksAsPlaylist(timeRange: "long_term" | "medium_term" | "short_term"): Promise<{ success: boolean; message: string; playlistId?: string }> {
  try {
    const spotify = await getSpotifyClient();

    if (!spotify) {
      return { success: false, message: "Non connecté à Spotify." };
    }

    // Determine target playlist name
    let playlistName = "Mon Top 100";
    if (timeRange === "long_term") playlistName += " - Toujours";
    else if (timeRange === "medium_term") playlistName += " - 6 Mois";
    else if (timeRange === "short_term") playlistName += " - 4 Semaines";

    // 1. Get Top 100 tracks
    const tracks: Track[] = await getTopTracks(timeRange);
    
    if (!tracks || tracks.length === 0) {
      return { success: false, message: "Aucun titre trouvé dans le Top 100." };
    }

    const trackUris = tracks.map(track => track.uri);

    // 2. Fetch every existing playlist to see if one matches the exact generated name
    const playlists = await getAllUserPlaylists(spotify);
    let targetPlaylistId = playlists.find((p) => p.name === playlistName)?.id;

    // 3. If it doesn't exist, create it
    if (!targetPlaylistId) {
      const newPlaylist = await spotify.createPlaylist(playlistName, {
        description: `Ma sélection des 100 titres les plus écoutés générée par TrueShuffle.`,
        public: false,
      });
      targetPlaylistId = newPlaylist.body.id;
    }

    // 4. Replace tracks in the playlist with the new 100 tracks
    // Note: The Spotify API replaceTracksInPlaylist allows up to 100 URIs, which is perfect for this use case.
    await spotify.replaceTracksInPlaylist(targetPlaylistId, trackUris);

    return { 
        success: true, 
        message: "Playlist sauvegardée avec succès.",
        playlistId: targetPlaylistId
    };

  } catch (error) {
    console.error("Error saving playlist:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la sauvegarde.",
    };
  }
}
