import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { id: 'hero', label: 'Sequence' },
  { id: 'installation-story', label: 'Process' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'why', label: 'Advantages' },
  { id: 'presentation', label: 'Overview' },
  { id: 'testimonials', label: 'Voices' },
  { id: 'contact', label: 'Contact' },
];

export function ChapterIndicator() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const triggers = CHAPTERS.map((chapter, index) =>
      ScrollTrigger.create({
        trigger: `#${chapter.id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      }),
    );

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="chapter-indicator" ref={railRef} aria-hidden="true">
      <span className="chapter-indicator__num">
        {String(active + 1).padStart(2, '0')}
      </span>
      <span className="chapter-indicator__rail">
        {CHAPTERS.map((c, i) => (
          <span key={c.id} className={`chapter-indicator__dot${i === active ? ' is-active' : ''}`} />
        ))}
      </span>
      <span className="chapter-indicator__label">{CHAPTERS[active].label}</span>
    </div>
  );
}