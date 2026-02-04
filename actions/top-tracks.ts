"use server";

import { getSpotifyClient } from "@/lib/spotify-client";

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string | null;
  uri: string;
  releaseYear: string;
}

export async function getTopTracks(timeRange: "long_term" | "medium_term" | "short_term" = "long_term"): Promise<Track[]> {
  const spotify = await getSpotifyClient();

  if (!spotify) {
    return [];
  }

  try {
    // Spotify API limit is 50, so we need two calls to get 100
    const [page1, page2] = await Promise.all([
      spotify.getMyTopTracks({ time_range: timeRange, limit: 50, offset: 0 }),
      spotify.getMyTopTracks({ time_range: timeRange, limit: 50, offset: 50 }),
    ]);

    const tracks = [...page1.body.items, ...page2.body.items];

    return tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      image: track.album.images[0]?.url || null,
      uri: track.uri,
      releaseYear: track.album.release_date.substring(0, 4),
    }));
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return [];
  }
}
