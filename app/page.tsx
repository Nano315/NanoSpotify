import LoginButton from "@/components/LoginButton";
import { getUserPlaylists } from "@/actions/spotify";
import PlaylistCard from "@/components/PlaylistCard";

export default async function Home() {
  const playlists = await getUserPlaylists();
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-7xl pt-8 pb-12 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 md:text-6xl">
            NanoSpotify
          </h1>
          <p className="mt-2 text-lg text-white/40">Le compagnon minimaliste pour votre musique.</p>
      </div>
      <div className="mt-8 w-full">
        {playlists.length > 0 ? (
            <>
                <h2 className="mb-6 text-2xl font-bold text-white tracking-tight">Vos Playlists</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {playlists.map((playlist: { id: string; name: string; image: string | null; tracks: number }, index: number) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                ))}
                </div>
            </>
        ) : (
            <div className="text-center mt-20">
                <p className="text-white/50 mb-4">Connectez-vous pour voir vos playlists</p>
                <LoginButton />
            </div>
        )}
      </div>
    </main>
  );
}
