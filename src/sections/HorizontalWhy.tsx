import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalWhyProps { readonly reducedMotion: boolean; }

const PANELS = [
  { id: '01', title: 'Predictable cost', text: 'Lock in your energy price for decades. Every kWh generated on site is one you don\'t buy from the grid.' },
  { id: '02', title: 'Real-time visibility', text: 'Live generation, self-consumption and export — reported straight from the inverter, minute by minute.' },
  { id: '03', title: 'Low maintenance', text: 'No moving parts. Panels are cleaned by rain, and annual checks catch the rest before it matters.' },
  { id: '04', title: 'Property value', text: 'A monitored solar asset adds measurable value at resale, with documented yield history.' },
  { id: '05', title: 'Grid resilience', text: 'Battery-ready design means the lights stay on when the grid goes down.' },
] as const;

export function HorizontalWhy({ reducedMotion }: HorizontalWhyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Only enable horizontal scroll on wide screens (>= 1024px)
      // On mobile/tablet: fall through to natural vertical stacking
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const panels = track.querySelectorAll<HTMLElement>('.why__panel');
        const totalScroll = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -totalScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalScroll()}`,
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        panels.forEach((panel) => {
          const content = panel.querySelector('.why__content');
          if (!content) return;
          gsap.fromTo(content,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: 'left center',
                end: 'right center',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });

        return () => { tween.kill(); };
      });

      // Mobile/tablet: fade each panel in as it enters
      mm.add('(max-width: 1023px)', () => {
        const panels = track.querySelectorAll<HTMLElement>('.why__panel');
        panels.forEach((panel) => {
          gsap.fromTo(panel,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 85%',
                once: true,
              },
            },
          );
        });
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="why" id="why" ref={sectionRef}>
      <div className="why__track" ref={trackRef}>
        {PANELS.map((panel) => (
          <article className="why__panel" key={panel.id}>
            <span className="why__id">{panel.id}</span>
            <div className="why__content">
              <h3 className="why__title">{panel.title}</h3>
              <p className="why__text">{panel.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
