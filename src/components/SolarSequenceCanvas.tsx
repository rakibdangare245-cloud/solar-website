import { forwardRef, useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { CHAPTER_WEIGHTS } from '../config/sequence';
import { drawImageCover, resizeCanvasToDisplaySize, type CanvasMetrics } from '../utils/canvasRenderer';
import type { FrameLoader } from '../utils/frameLoader';
import { progressToFrame } from '../utils/sequenceMapping';

export interface SolarSequenceCanvasHandle {
  setProgress: (progress: number) => void;
  setFrame: (index: number) => void;
}

interface SolarSequenceCanvasProps {
  readonly loader: FrameLoader;
  readonly frameCount: number;
  readonly dprCap?: number;
  readonly focalX?: number;
  readonly focalY?: number;
  readonly smoothing?: number;
  readonly className?: string;
}

const DEFAULT_SMOOTHING = 0.18;

export const SolarSequenceCanvas = forwardRef(function SolarSequenceCanvas(
  {
    loader,
    frameCount,
    dprCap = 2,
    focalX = 0.5,
    focalY = 0.5,
    smoothing = DEFAULT_SMOOTHING,
    className,
  }: SolarSequenceCanvasProps,
  ref: Ref<SolarSequenceCanvasHandle>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const forcedFrameRef = useRef<number | null>(null);
  const lastDrawnRef = useRef(-1);
  const dirtyRef = useRef(true);
  const metricsRef = useRef<CanvasMetrics | null>(null);

  useImperativeHandle(ref, () => ({
    setProgress: (progress: number) => {
      targetRef.current = progress < 0 ? 0 : progress > 1 ? 1 : progress;
    },
    setFrame: (index: number) => {
      forcedFrameRef.current = index;
      dirtyRef.current = true;
    },
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const measure = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      metricsRef.current = resizeCanvasToDisplaySize(canvas, rect.width, rect.height, dprCap);
      dirtyRef.current = true;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);

    loader.onFrameLoaded = () => { dirtyRef.current = true; };

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const target = targetRef.current;
      const current = currentRef.current;

      if (target !== current) {
        let next = current + (target - current) * smoothing;
        if (Math.abs(target - next) < 0.0008) next = target;
        currentRef.current = next;
        dirtyRef.current = true;
      }

      const frameIndex =
        forcedFrameRef.current ??
        progressToFrame(currentRef.current, frameCount, CHAPTER_WEIGHTS);

      if (!dirtyRef.current && frameIndex === lastDrawnRef.current) return;

      const metrics = metricsRef.current;
      if (!metrics) return;

      const image = loader.getNearest(frameIndex);
      if (!image) return;

      drawImageCover(ctx, image, metrics, focalX, focalY);
      lastDrawnRef.current = frameIndex;
      dirtyRef.current = false;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      loader.onFrameLoaded = undefined;
    };
  }, [loader, frameCount, dprCap, focalX, focalY, smoothing]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});
