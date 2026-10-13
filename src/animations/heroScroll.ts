import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ENTER_FROM = { autoAlpha: 0, yPercent: 55, clipPath: 'inset(0% 0% 100% 0%)' };
const ENTER_TO   = { autoAlpha: 1, yPercent: 0,  clipPath: 'inset(0% 0% 0% 0%)' };
const EXIT_TO    = { autoAlpha: 0, yPercent: -40, clipPath: 'inset(100% 0% 0% 0%)' };

export interface HeroScrollConfig {
  hero: HTMLElement;
  canvasWrap: HTMLElement;
  copyBlocks: readonly HTMLElement[];
  energy: HTMLElement | null;
  scrollCue: HTMLElement | null;
  onProgress: (progress: number) => void;
  scrollLengthVh: number;
  scrub: number;
}

export function createHeroScroll(config: HeroScrollConfig): () => void {
  const state = { progress: 0 };

  // Pre-hide every text block so the first frame renders clean.
  config.copyBlocks.forEach((block, i) => {
    gsap.set(block, i === 0 ? { autoAlpha: 1, yPercent: 0 } : { autoAlpha: 0, yPercent: 40 });
  });
  gsap.set(config.copyBlocks[0], { autoAlpha: 0, yPercent: 55 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: config.hero,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * config.scrollLengthVh)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: config.scrub,
      invalidateOnRefresh: true,
      refreshPriority: 1,
    },
  });

  // Frame progress drives the canvas through the FULL timeline.
  tl.to(state, {
    progress: 1,
    duration: 100,
    ease: 'none',
    onUpdate: () => config.onProgress(state.progress),
  }, 0);

  const [tech, home, motion, final] = config.copyBlocks;

  const enter = (el: HTMLElement | undefined, at: number, duration = 5) => {
    if (!el) return;
    tl.fromTo(el, ENTER_FROM, { ...ENTER_TO, duration }, at);
  };
  const exit = (el: HTMLElement | undefined, at: number, duration = 6) => {
    if (!el) return;
    tl.to(el, { ...EXIT_TO, duration }, at);
  };

  // Chapter 1 (0-35%): solar technology
  enter(tech, 0, 6);
  exit(tech, 26, 6);
  // Chapter 2 (35-65%): powering the home
  enter(home, 35, 5);
  exit(home, 56, 6);
  // Chapter 3a (65-88%): energy in motion
  enter(motion, 65, 5);
  exit(motion, 80, 6);
  // Chapter 3b (88-100%): final locked state
  enter(final, 88, 6);

  if (config.scrollCue) {
    tl.to(config.scrollCue, { autoAlpha: 0, y: -14, duration: 4 }, 2);
  }
  if (config.energy) {
    tl.fromTo(config.energy, { autoAlpha: 0 }, { autoAlpha: 1, duration: 8 }, 66);
    tl.to(config.energy, { autoAlpha: 0, duration: 6 }, 92);
  }
  tl.to(config.canvasWrap, { scale: 1.04, duration: 10 }, 90);

  return () => {
    tl.scrollTrigger?.kill(true);
    tl.kill();
  };
}

export function playHeroIntro(scope: HTMLElement, opts: { reducedMotion: boolean }): void {
  const targets = scope.querySelectorAll<HTMLElement>('[data-intro]');
  if (!targets.length) return;
  if (opts.reducedMotion) { gsap.set(targets, { autoAlpha: 1, y: 0 }); return; }
  gsap.fromTo(targets,
    { autoAlpha: 0, y: 26 },
    { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.15 },
  );
}