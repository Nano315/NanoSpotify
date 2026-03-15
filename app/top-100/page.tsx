import { getTopTracks } from "@/actions/top-tracks";
import TrackList from "@/components/TrackList";
import LoginButton from "@/components/LoginButton";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import SavePlaylistButton from "@/components/SavePlaylistButton";

export const metadata = {
  title: "Top 100 - TrueShuffle",
  description: "Vos titres les plus écoutés.",
};

export default async function Top100Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const timeRange = (range as "long_term" | "medium_term" | "short_term") || "long_term";
  const tracks = await getTopTracks(timeRange);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-7xl pt-8 pb-12">
        <div className="mb-6">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 md:text-5xl">
            Top 100
          </h1>
          <p className="mt-2 text-lg text-white/40">Vos titres favoris.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TimeRangeFilter />
          <SavePlaylistButton timeRange={timeRange} />
        </div>
        {tracks.length > 0 ? (
          <TrackList key={timeRange} tracks={tracks} />
        ) : (
          <div className="text-center mt-20">
            <p className="text-white/50 mb-4">Impossible de récupérer vos top titres. Connectez-vous.</p>
             <LoginButton />
          </div>
        )}
      </div>
    </main>
  );
}
