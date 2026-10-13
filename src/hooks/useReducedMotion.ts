import { useMediaQuery } from './useMediaQuery';

/**
 * Playback gate.
 *
 * The OS-level "reduce motion" preference currently blocks the hero
 * autoplay on some Windows installs where the setting is on by default.
 * Until we have a UI toggle, this returns false so the sequence always plays.
 *
 * To restore OS-preference respect later, replace the body with:
 *     export const useReducedMotion = (): boolean =>
 *       useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export const useReducedMotion = (): boolean => {
  void useMediaQuery;
  return false;
};