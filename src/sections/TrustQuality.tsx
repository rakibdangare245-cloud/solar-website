import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from '../components/TiltCard';

gsap.registerPlugin(ScrollTrigger);

interface TrustQualityProps { reducedMotion: boolean; }

const ITEMS = [
  { n: '01', title: 'Professional installation',
    text: 'Every array is installed and electrically tested by accredited installers.' },
  { n: '02', title: 'Quality components',
    text: 'Panels, inverters and mounting hardware are specified for service life, not for a price point.' },
  { n: '03', title: 'Engineering approach',
    text: 'Shading, tilt, azimuth and wind loading are modelled before anything is ordered.' },
  { n: '04', title: 'Safety & isolation',
    text: 'DC isolation, surge protection and arc detection are standard, not add-ons.' },
  { n: '05', title: 'Monitoring',
    text: 'Generation, self-consumption and export are reported live from the inverter.' },
  { n: '06', title: 'Ongoing support',
    text: 'Annual checks, thermal imaging and firmware updates keep the system at specification.' },
];

export function TrustQuality({ reducedMotion }: TrustQualityProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelectorAll('.trust__item'),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        });
      const head = root.querySelector('.trust__head');
      if (head) {
        gsap.fromTo(head,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', once: true },
          });
      }
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="trust" id="trust" ref={rootRef}>
      <div className="container">
        <header className="trust__head">
          <span className="trust__eyebrow">Trust &amp; quality</span>
          <h2 className="trust__title">Built once. Built to last the roof.</h2>
        </header>

        <ul className="trust__grid">
          {ITEMS.map((item) => (
            <li key={item.n}>
              <TiltCard className="trust__item" max={6}>
                <span className="trust__num">{item.n}</span>
                <h3 className="trust__item-title">{item.title}</h3>
                <p className="trust__item-text">{item.text}</p>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
