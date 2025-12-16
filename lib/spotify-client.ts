import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SpotifyWebApi from "spotify-web-api-node";

export async function getSpotifyClient() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    return null;
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(session.user.accessToken);

  return spotifyApi;
}
