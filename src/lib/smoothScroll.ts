import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (instance) return instance;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  instance = lenis;
  return lenis;
}

export function destroySmoothScroll(): void {
  if (!instance) return;
  instance.destroy();
  instance = null;
}

export function scrollToTarget(target: string | HTMLElement | number): void {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
}