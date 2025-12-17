"use client";

import { createShufflePlaylist } from "@/actions/shuffle";
import { useState } from "react";
import { Shuffle, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#ffffff'] // Green and White
        });
        toast.success("Playlist mélangée avec succès !");
      } else {
        toast.error("Erreur : " + result.message);
      }
    } catch (e) {
      toast.error("Une erreur est survenue.");
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
