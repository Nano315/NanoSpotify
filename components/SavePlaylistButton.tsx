"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { saveTopTracksAsPlaylist } from "@/actions/save-playlist";
import { toast } from "sonner";

interface SavePlaylistButtonProps {
  timeRange: "long_term" | "medium_term" | "short_term";
}

export default function SavePlaylistButton({ timeRange }: SavePlaylistButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveTopTracksAsPlaylist(timeRange);
      if (result.success) {
        toast.success(result.message, {
            description: "Vous pouvez retrouver cette playlist dans votre bibliothèque Spotify."
        });
      } else {
        toast.error("Échec de la sauvegarde", {
            description: result.message
        });
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className={`
        inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm
        ${isPending 
            ? "bg-white/10 text-white/50 cursor-not-allowed border border-white/5" 
            : "bg-green-500 text-black hover:bg-green-400 hover:scale-[1.02] border border-green-400/50"}
      `}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>{isPending ? "Sauvegarde..." : "Sauvegarder"}</span>
    </button>
  );
}
