"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

const ranges = [
  { label: "Depuis toujours", value: "long_term" },
  { label: "6 derniers mois", value: "medium_term" },
  { label: "4 dernières semaines", value: "short_term" },
];

export default function TimeRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "long_term";

  const handleRangeChange = (range: string) => {
    router.push(`/top-100?range=${range}`);
  };

  return (
    <div className="flex flex-wrap gap-2 pb-6">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleRangeChange(range.value)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
            currentRange === range.value
              ? "bg-green-500 text-black border-green-500"
              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
