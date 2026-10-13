import { clamp01 } from './math';

export function progressToFrame(
  progress: number,
  frameCount: number,
  weights: readonly number[],
): number {
  if (frameCount <= 1) return 0;

  const segments = weights.length;
  if (segments === 0) return Math.round(clamp01(progress) * (frameCount - 1));

  const p = clamp01(progress);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1;

  let accumulated = 0;
  let segment = segments - 1;
  let local = 1;

  for (let i = 0; i < segments; i += 1) {
    const share = weights[i] / totalWeight;
    if (p <= accumulated + share || i === segments - 1) {
      segment = i;
      local = share > 0 ? (p - accumulated) / share : 1;
      break;
    }
    accumulated += share;
  }

  const fraction = (segment + clamp01(local)) / segments;
  return Math.round(clamp01(fraction) * (frameCount - 1));
}
