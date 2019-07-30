export function random(min: number, max: number, round: boolean = true): number {
  const base = Math.random() * (max - min);

  return (round ? Math.round(base) : base) + min;
}