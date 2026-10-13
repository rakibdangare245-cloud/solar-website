import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Applies the Monolith "fadeInUp" reveal to any element in the given scope
 * that carries [data-reveal]. Sibling [data-reveal] children stagger.
 * One IntersectionObserver-style trigger per element. No bespoke per-section
 * animations.
 */
export function attachReveals(scope: HTMLElement, opts?: { reducedMotion?: boolean }): () => void {
  if (opts?.reducedMotion) {
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return () => undefined;
  }

  const ctx = gsap.context(() => {
    // Group siblings under the same parent so they stagger together
    const groups = new Map<HTMLElement, HTMLElement[]>();
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const parent = (el.parentElement ?? scope) as HTMLElement;
      const arr = groups.get(parent) ?? [];
      arr.push(el);
      groups.set(parent, arr);
    });

    groups.forEach((els) => {
      gsap.fromTo(
        els,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: els[0],
            start: 'top 82%',
            once: true,
          },
        },
      );
    });
  }, scope);

  return () => ctx.revert();
}