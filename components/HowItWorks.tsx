"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Library, Shuffle, Disc, Play, X } from "lucide-react";

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const steps = [
    {
      icon: Library,
      title: "Sélectionner",
      description: "Choisis une playlist dans ta bibliothèque ci-dessous.",
    },
    {
      icon: Shuffle,
      title: "Générer",
      description: "Clique sur le bouton Shuffle et attends la confirmation.",
    },
    {
      icon: Disc,
      title: "Retrouver",
      description: "Ouvre Spotify. Une nouvelle playlist [Nom] - Alter a été créée.",
    },
    {
      icon: Play,
      title: "Écouter",
      description: "Lance la lecture sans le mode aléatoire de Spotify pour profiter du vrai mélange.",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto mb-12"
        >
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Comment ça marche ?</h3>
                <p className="text-white/50 text-sm">Le guide rapide pour une expérience aléatoire parfaite.</p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center md:items-start md:text-left group">
                  <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 text-[var(--primary)] group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_20px_rgba(30,215,96,0.2)]">
                    <step.icon size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-[10px] font-bold text-white/70">
                      {index + 1}
                    </span>
                    {step.title}
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Connector Line (Desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-[3.5rem] left-[calc(25%*${index+1}-1rem)] w-[calc(25%-4rem)] h-[1px] bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  )}
                </div>
              ))}
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
