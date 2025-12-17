"use client";

import { motion } from "framer-motion";
import PlaylistCard from "./PlaylistCard";

interface Playlist {
  id: string;
  name: string;
  image: string | null;
  tracks: number;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function PlaylistGrid({ playlists }: { playlists: Playlist[] }) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {playlists.map((playlist, index) => (
        <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
      ))}
    </motion.div>
  );
}
