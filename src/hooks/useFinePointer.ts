import { useMediaQuery } from './useMediaQuery';

export const useFinePointer = (): boolean =>
  useMediaQuery('(hover: hover) and (pointer: fine)');
