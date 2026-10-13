import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMagnetic } from '../animations/magnetic';
import { useFinePointer } from '../hooks/useFinePointer';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps { readonly reducedMotion: boolean; }

export function CTASection({ reducedMotion }: CTASectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const finePointer = useFinePointer();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelector('.cta__title'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      );
      gsap.fromTo(root.querySelector('.cta__sub'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      );
      gsap.fromTo(root.querySelector('.cta__actions'),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.28,
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const button = buttonRef.current;
    if (!button) return;
    return createMagnetic(button, { strength: 0.32, maxOffset: 10 });
  }, [finePointer, reducedMotion]);

  return (
    <section className="cta" id="contact" ref={rootRef}>
      <div className="container cta__inner">
        <h2 className="cta__title">Ready when you are.</h2>
        <p className="cta__sub">
          Start with a site assessment. No obligation, and you keep the yield model either way.
        </p>

        <div className="cta__actions">
          <a ref={buttonRef} className="cta__primary" href="#consultation" data-cursor="cta">
            Request a site assessment
          </a>
          <a className="cta__secondary" href="#solutions" data-cursor="link">
            Browse solutions
          </a>
        </div>
      </div>

      <span className="cta__glow" aria-hidden="true" />
    </section>
  );
}

