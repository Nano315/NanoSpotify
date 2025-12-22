import LoginButton from "@/components/LoginButton";
import HowItWorks from "@/components/HowItWorks";
import { getUserPlaylists } from "@/actions/spotify";
import PlaylistGrid from "@/components/PlaylistGrid";

export default async function Home() {
  const playlists = await getUserPlaylists();
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-7xl pt-8 pb-12 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 md:text-6xl">
            TrueShuffle
          </h1>
          <p className="mt-2 text-lg text-white/40">Le compagnon minimaliste pour votre musique.</p>
      </div>
      
      <HowItWorks />

      <div className="mt-8 w-full">
        {playlists.length > 0 ? (
            <>
                <h2 className="mb-6 text-2xl font-bold text-white tracking-tight">Vos Playlists</h2>
                <PlaylistGrid playlists={playlists} />
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
