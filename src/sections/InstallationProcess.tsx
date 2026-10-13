import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface InstallationProcessProps { reducedMotion: boolean; }

const STEPS = [
  { n: '01', title: 'Consultation',
    text: 'A structured first conversation about your property, energy needs and goals. No specifications yet.' },
  { n: '02', title: 'Site assessment',
    text: 'Roof orientation, shading, structural capacity and available area are measured on site.' },
  { n: '03', title: 'System design',
    text: 'Array layout, inverter selection and expected generation are modelled for your address.' },
  { n: '04', title: 'Installation',
    text: 'Mounting rails, flashing and cable routes are set out before a single panel is lifted.' },
  { n: '05', title: 'Electrical integration',
    text: 'Inverter, isolation and protections are installed and electrically tested by accredited installers.' },
  { n: '06', title: 'Activation',
    text: 'Commissioning, monitoring setup and handover, so generation is visible from day one.' },
];

export function InstallationProcess({ reducedMotion }: InstallationProcessProps) {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      const steps = Array.from(root.querySelectorAll<HTMLElement>('.proc__step'));
      steps.forEach((step) => {
        gsap.fromTo(step,
          { autoAlpha: 0, x: -20 },
          {
            autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 82%', once: true },
          });
      });
      const line = lineRef.current;
      if (line) {
        gsap.fromTo(line,
          { scaleY: 0 },
          {
            scaleY: 1, ease: 'none', transformOrigin: 'top center',
            scrollTrigger: { trigger: root, start: 'top 60%', end: 'bottom 85%', scrub: 0.4 },
          });
      }
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="proc" id="process" ref={rootRef}>
      <div className="container proc__grid">
        <aside className="proc__aside">
          <span className="proc__eyebrow">Installation process</span>
          <h2 className="proc__title">Six stages, each documented before the next.</h2>
          <p className="proc__lede">
            Every project follows the same sequence. Nothing is improvised on the roof.
          </p>
        </aside>

        <ol className="proc__list">
          <span className="proc__rail" aria-hidden="true">
            <span className="proc__rail-fill" ref={lineRef} />
          </span>

          {STEPS.map((step) => (
            <li className="proc__step" key={step.n}>
              <span className="proc__num">{step.n}</span>
              <div className="proc__body">
                <h3 className="proc__step-title">{step.title}</h3>
                <p className="proc__step-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}