"use client";

import { Track } from "@/actions/top-tracks";

export default function TrackList({ tracks }: { tracks: Track[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[3rem_3rem_1fr_1fr] gap-4 px-4 py-2 text-sm font-medium text-white/40 uppercase tracking-wider border-b border-white/10 mb-2">
        <div className="text-center">#</div>
        <div></div>
        <div>Titre</div>
        <div className="hidden md:block">Album</div>
      </div>
      
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="group relative grid grid-cols-[3rem_3rem_1fr] md:grid-cols-[3rem_3rem_1fr_1fr] gap-4 items-center rounded-lg p-2 hover:bg-white/5 transition-colors"
        >
          <div className="text-center font-bold text-white/50 group-hover:text-green-400 transition-colors">
            {index + 1}
          </div>
          
          <div className="relative aspect-square w-12 overflow-hidden rounded bg-neutral-800">
            {track.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={track.image}
                alt={track.album}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-neutral-800 text-white/20">
                    🎵
                </div>
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-base font-semibold text-white group-hover:text-white transition-colors">
              {track.name}
            </span>
            <span className="truncate text-sm text-white/60 group-hover:text-white/80 transition-colors">
              {track.artist}
            </span>
          </div>

          <div className="hidden md:flex flex-col justify-center overflow-hidden">
            <span className="truncate text-sm text-white/40 group-hover:text-white/60 transition-colors">
              {track.album}
            </span>
             <span className="text-xs text-white/20">
              {track.releaseYear}
            </span>
          </div>
          
          <a
            href={`https://open.spotify.com/track/${track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label={`Ouvrir ${track.name} sur Spotify`}
          />
        </div>
      ))}
    </div>
  );
}
