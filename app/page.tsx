import LoginButton from "@/components/LoginButton";
import { getUserPlaylists } from "@/actions/spotify";
import ShuffleButton from "@/components/ShuffleButton";

export default async function Home() {
  const playlists = await getUserPlaylists();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
        NanoSpotify
      </h1>
      <LoginButton />
      
      <div className="mt-12 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold text-white">Vos Playlists ({playlists.length})</h2>
        <ul className="grid gap-4">
          {playlists.map((playlist: { id: string; name: string; image: string | null; tracks: number }) => (
            <li key={playlist.id} className="flex items-center gap-4 rounded-lg bg-white/5 p-4 transition-colors hover:bg-white/10">
              {playlist.image && (
                <img src={playlist.image} alt={playlist.name} className="h-12 w-12 rounded bg-neutral-800 object-cover" />
              )}
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium text-white">{playlist.name}</p>
                <p className="text-sm text-neutral-400">{playlist.tracks} titres</p>
              </div>
              <ShuffleButton playlistId={playlist.id} sourceName={playlist.name} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
