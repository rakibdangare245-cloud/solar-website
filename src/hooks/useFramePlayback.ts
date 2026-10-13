import { useCallback, useEffect, useRef, useState } from 'react';

export interface FramePlaybackOptions {
  totalFrames: number;
  durationMs: number;
  onFrame: (index: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  autoPlayDelayMs?: number;
}

export interface FramePlaybackApi {
  isPlaying: boolean;
  isComplete: boolean;
  currentFrame: number;
  play: () => void;
  replay: () => void;
}

export function useFramePlayback(options: FramePlaybackOptions): FramePlaybackApi {
  const { totalFrames, durationMs, onFrame, onComplete, autoPlay, autoPlayDelayMs = 0 } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const lastIndexRef = useRef(-1);
  const playingRef = useRef(false);

  const onFrameRef = useRef(onFrame);
  const onCompleteRef = useRef(onComplete);
  const totalRef = useRef(totalFrames);
  const durationRef = useRef(durationMs);
  useEffect(() => { onFrameRef.current = onFrame; }, [onFrame]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { totalRef.current = totalFrames; }, [totalFrames]);
  useEffect(() => { durationRef.current = durationMs; }, [durationMs]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    playingRef.current = false;
    setIsPlaying(false);
  }, []);

  const runLoop = useCallback(() => {
    stop();
    startRef.current = performance.now();
    lastIndexRef.current = -1;
    playingRef.current = true;
    setIsPlaying(true);
    setIsComplete(false);

    const tick = (now: number) => {
      if (!playingRef.current) return;
      const t = Math.min(1, (now - startRef.current) / durationRef.current);
      const total = totalRef.current;
      const index = Math.min(total - 1, Math.floor(t * (total - 1) + 1e-6));

      if (index !== lastIndexRef.current) {
        lastIndexRef.current = index;
        setCurrentFrame(index);
        onFrameRef.current(index);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        playingRef.current = false;
        setIsPlaying(false);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stop]);

  const play = useCallback(() => {
    if (playingRef.current) return;
    setCurrentFrame(0);
    onFrameRef.current(0);
    window.setTimeout(runLoop, 60);
  }, [runLoop]);

  const replay = useCallback(() => {
    stop();
    setIsComplete(false);
    setCurrentFrame(0);
    lastIndexRef.current = -1;
    onFrameRef.current(0);
    window.setTimeout(runLoop, 80);
  }, [stop, runLoop]);

  useEffect(() => {
    if (!autoPlay || totalFrames === 0) return;
    const timer = window.setTimeout(() => {
      setCurrentFrame(0);
      onFrameRef.current(0);
      window.setTimeout(runLoop, 60);
    }, autoPlayDelayMs);
    return () => {
      window.clearTimeout(timer);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayDelayMs, totalFrames]);

  useEffect(() => stop, [stop]);

  return { isPlaying, isComplete, currentFrame, play, replay };
}