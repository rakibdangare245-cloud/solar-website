import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { FrameLoader } from '../utils/frameLoader';

interface LoaderProps {
  readonly loader: FrameLoader;
  readonly onReady: () => void;
  readonly onExited: () => void;
}

const UNLOCK_FRAMES = 0;
const MIN_DISPLAY_MS = 400;
const HARD_TIMEOUT_MS = 800;

export function Loader({ loader, onReady, onExited }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const unlockedRef = useRef(false);
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = performance.now();
    const root = rootRef.current;
    const bar = barRef.current;
    const value = valueRef.current;
    if (!root) return;

    const unlockTarget = Math.min(UNLOCK_FRAMES, loader.budget || UNLOCK_FRAMES);
    const counter = { value: 0 };

    const paint = () => {
      const percent = Math.round(counter.value * 100);
      if (value) value.textContent = String(percent).padStart(2, '0');
      if (bar) bar.style.transform = `scaleX(${counter.value})`;
    };

    const unlock = (reason: string) => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      console.log('[loader] unlocking â€”', reason);
      const elapsed = performance.now() - mountedAtRef.current;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      gsap.delayedCall(wait / 1000, () => {
        onReady();
        gsap.to(root, { opacity: 0, duration: 0.75, ease: 'power2.inOut', onComplete: onExited });
      });
    };

    const handleProgress = (loaded: number) => {
      const ratio = Math.min(1, loaded / unlockTarget);
      gsap.to(counter, { value: ratio, duration: 0.4, ease: 'power2.out', overwrite: true, onUpdate: paint });
      if (loaded >= unlockTarget) unlock('enough frames loaded (' + loaded + ')');
    };

    paint();
    loader.onProgress = handleProgress;
    handleProgress(loader.loadedCount);

    // Hard failsafe: after 3s, unlock no matter what
    const failsafe = window.setTimeout(() => {
      console.warn('[loader] FAILSAFE fired â€” loadedCount =', loader.loadedCount, 'failed =', loader.failedCount);
      unlock('failsafe after ' + HARD_TIMEOUT_MS + 'ms');
    }, HARD_TIMEOUT_MS);

    if (loader.loadedCount >= unlockTarget) unlock('already loaded');

    return () => {
      window.clearTimeout(failsafe);
      loader.onProgress = undefined;
      gsap.killTweensOf(counter);
    };
  }, [loader, onReady, onExited]);

  return (
    <div className="loader" ref={rootRef} role="status" aria-live="polite">
      <div className="loader__inner">
        <span className="loader__system">Solar System</span>
        <span className="loader__label">Loading</span>
        <div className="loader__track"><div className="loader__bar" ref={barRef} /></div>
        <div className="loader__value">
          <span ref={valueRef}>00</span>
          <span className="loader__unit">%</span>
        </div>
      </div>
    </div>
  );
}
