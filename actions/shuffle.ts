"use server";

import { getSpotifyClient } from "@/lib/spotify-client";
import { fisherYatesShuffle } from "@/lib/algorithms/fisher-yates";

// Helper for Robustness: Retry logic for 500/502 errors
async function callSpotify<T>(
  operationName: string,
  operation: () => Promise<T>,
  retries = 3
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) console.log(`Retry ${i}/${retries} for ${operationName}...`);
      return await operation();
    } catch (error: any) {
      lastError = error;
      // If it's a server error (5xx) or network error, retry.
      // Spotify 'WebapiRegularError' usually has statusCode.
      const status = error.statusCode || error.body?.error?.status;
      
      console.error(`Attempt ${i + 1} failed for ${operationName}:`, status, error.message);

      if (status >= 500 || error.code === 'ECONNRESET' || error.message === 'Error while loading resource') {
        // Backoff: 500ms, 1000ms, 2000ms
        const delay = 500 * Math.pow(2, i);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      
      // If it's 401/403/400/404, throw immediately (no point retrying)
      throw error;
    }
  }
  throw lastError;
}

export async function createShufflePlaylist(sourcePlaylistId: string, sourceName: string) {
  console.log(`[Shuffle] Starting for: ${sourceName} (${sourcePlaylistId})`);
  const spotify = await getSpotifyClient();

  if (!spotify) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Determine Target Name
    const suffix = " - Alter";
    const targetName = sourceName.endsWith(suffix) ? sourceName : `${sourceName}${suffix}`;

    // 2. Fetch ALL tracks
    console.log("[Shuffle] Fetching tracks...");
    let allTracks: string[] = [];
    let offset = 0;
    let keepFetching = true;

    if (sourcePlaylistId === 'liked-songs') {
        // Handle Liked Songs
        while (keepFetching) {
            console.log(`[Shuffle] Fetching Liked Songs batch offset ${offset}`);
            const response = await callSpotify("getMySavedTracks", () => 
                spotify.getMySavedTracks({ limit: 50, offset: offset })
            );

            const items = response.body.items;
            const uris = items
                .map((item) => item.track?.uri) // Added optional chaining safety
                .filter((uri): uri is string => typeof uri === "string" && uri.startsWith("spotify:track:"));
            
            allTracks = [...allTracks, ...uris];

            if (items.length === 50 && allTracks.length < response.body.total) {
                offset += 50;
            } else {
                keepFetching = false;
            }
        }
    } else {
        // Handle Standard Playlist
        while (keepFetching) {
            console.log(`[Shuffle] Fetching Playlist tracks batch offset ${offset}`);
            const response = await callSpotify("getPlaylistTracks", () => 
                spotify.getPlaylistTracks(sourcePlaylistId, {
                    limit: 100,
                    offset: offset,
                    fields: "items(track(uri)),total,next",
                })
            );
    
            const items = response.body.items;
            const uris = items
                .map((item) => item.track?.uri)
                .filter((uri): uri is string => typeof uri === "string" && uri.startsWith("spotify:track:"));
    
            allTracks = [...allTracks, ...uris];
    
            if (response.body.next) {
                offset += 100;
            } else {
                keepFetching = false;
            }
        }
    }

    if (allTracks.length === 0) {
      console.warn("[Shuffle] No tracks found.");
      return { success: false, message: "No tracks found in this playlist." };
    }
    console.log(`[Shuffle] Fetched ${allTracks.length} tracks. Shuffling...`);

    // 3. Shuffle Tracks
    const shuffledTracks = fisherYatesShuffle(allTracks);

    // 4. Create/Update Target Playlist
    console.log("[Shuffle] Checking for existing target playlist...");
    const userPlaylists = await callSpotify("getUserPlaylists", () => spotify.getUserPlaylists({ limit: 50 }));
    const existingPlaylist = userPlaylists.body.items.find(p => p.name === targetName);

    let targetPlaylistId = existingPlaylist?.id;

    if (targetPlaylistId) {
       console.log(`[Shuffle] Updating existing playlist: ${targetPlaylistId}`);
       
       // REPLACE first 100
       const firstChunk = shuffledTracks.slice(0, 100);
       await callSpotify("replaceTracksInPlaylist", () => spotify.replaceTracksInPlaylist(targetPlaylistId, firstChunk));

       // ADD remaining
       if (shuffledTracks.length > 100) {
          const remainingTracks = shuffledTracks.slice(100);
          const chunkSize = 100;
          for (let i = 0; i < remainingTracks.length; i += chunkSize) {
            const chunk = remainingTracks.slice(i, i + chunkSize);
            console.log(`[Shuffle] Adding chunk ${i / chunkSize + 1}...`);
            await callSpotify("addTracksToPlaylist", () => spotify.addTracksToPlaylist(targetPlaylistId, chunk));
          }
       }

    } else {
      console.log(`[Shuffle] Creating new playlist: ${targetName}`);
      const newPlaylist = await callSpotify("createPlaylist", () => 
          spotify.createPlaylist(targetName, {
            description: `Generated by NanoSpotify. True Random Shuffle of '${sourceName}'.`,
            public: false,
          })
      );
      targetPlaylistId = newPlaylist.body.id;

      // Add Tracks in Batches
      const chunkSize = 100;
      for (let i = 0; i < shuffledTracks.length; i += chunkSize) {
        const chunk = shuffledTracks.slice(i, i + chunkSize);
        console.log(`[Shuffle] Adding chunk ${i / chunkSize + 1} to new playlist...`);
        await callSpotify("addTracksToPlaylist", () => spotify.addTracksToPlaylist(targetPlaylistId, chunk));
      }
    }

    console.log("[Shuffle] Success!");
    return { success: true, playlistId: targetPlaylistId };
  } catch (error: any) {
    console.error("Error creating shuffle playlist:", error);
    return { success: false, message: error.message || "Failed to create shuffle playlist." };
  }
}
