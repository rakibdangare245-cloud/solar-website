import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps { items: readonly string[]; }

export function Marquee({ items }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root) return;

    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        // Nudge the marquee speed based on scroll direction
        const dir = self.direction;
        loop.timeScale(1);
      },
    });

    return () => {
      loop.kill();
      st.kill();
    };
  }, []);

  // Duplicate items so the loop is seamless
  const doubled = [...items, ...items];

  return (
    <section className="marquee" ref={rootRef} aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {doubled.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            <span className="marquee__dot" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
