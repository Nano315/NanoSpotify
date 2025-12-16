"use client";

import { createShufflePlaylist } from "@/actions/shuffle";
import { useState } from "react";
import { Shuffle, Loader2 } from "lucide-react";

interface ShuffleButtonProps {
  playlistId: string;
  sourceName: string;
}

export default function ShuffleButton({ playlistId, sourceName }: ShuffleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleShuffle = async () => {
    setIsLoading(true);
    try {
      const result = await createShufflePlaylist(playlistId, sourceName);
      if (result.success) {
        alert("Playlist créée avec succès !"); // Simple native alert for MVP
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (e) {
      alert("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleShuffle}
      disabled={isLoading}
      className="flex items-center justify-center rounded-full bg-green-500 p-2 text-black transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
      title="Générer True Shuffle"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Shuffle className="h-5 w-5" />
      )}
    </button>
  );
}
