"use client";

import { motion } from "framer-motion";
import ShuffleButton from "@/components/ShuffleButton";

interface Playlist {
  id: string;
  name: string;
  image: string | null;
  tracks: number;
}

export default function PlaylistCard({ playlist, index }: { playlist: Playlist; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card group relative flex flex-col overflow-hidden p-4"
    >
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-neutral-900 shadow-xl">
        {playlist.image ? (
          <img
            src={playlist.image}
            alt={playlist.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <span className="text-4xl">🎵</span>
          </div>
        )}
        
        {/* Overlay Action Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
             <div className="scale-0 transition-transform duration-300 group-hover:scale-100">
                <ShuffleButton playlistId={playlist.id} sourceName={playlist.name} />
             </div>
        </div>
      </div>

      <h3 className="truncate text-lg font-bold text-white group-hover:text-green-400 transition-colors">{playlist.name}</h3>
      <p className="text-sm font-medium text-white/40">{playlist.tracks} titres</p>
    </motion.div>
  );
}
