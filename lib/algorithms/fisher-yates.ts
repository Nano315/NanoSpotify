export function fisherYatesShuffle<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array
  const shuffled = [...array];
  let m = shuffled.length;
  let t: T;
  let i: number;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }

  return shuffled;
}
