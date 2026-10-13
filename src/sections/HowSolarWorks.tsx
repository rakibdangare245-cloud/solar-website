import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HowSolarWorksProps { reducedMotion: boolean; }

const STAGES = [
  { id: 'sun',        label: 'Sunlight',     x: 70   },
  { id: 'panels',     label: 'Solar panels', x: 305  },
  { id: 'inverter',   label: 'Inverter',     x: 540  },
  { id: 'home',       label: 'Home system',  x: 775  },
  { id: 'appliances', label: 'Appliances',   x: 1010 },
];

const PATH_D =
  'M 70 120 C 180 60, 240 180, 305 120 S 480 60, 540 120 S 720 180, 775 120 S 950 60, 1010 120';

export function HowSolarWorks({ reducedMotion }: HowSolarWorksProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  // Continuous particles along the flow path
  useEffect(() => {
    const path = pathRef.current;
    if (!path || reducedMotion) return;
    const length = path.getTotalLength();
    if (!length) return;

    const tweens: gsap.core.Tween[] = [];
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const state = { t: 0 };
      tweens.push(gsap.to(state, {
        t: 1, duration: 5, ease: 'none', repeat: -1,
        delay: i * (5 / Math.max(1, dotRefs.current.length)),
        onUpdate: () => {
          const pt = path.getPointAtLength(state.t * length);
          dot.setAttribute('cx', pt.x.toFixed(2));
          dot.setAttribute('cy', pt.y.toFixed(2));
        },
      }));
    });
    return () => { tweens.forEach((t) => t.kill()); };
  }, [reducedMotion]);

  // Scroll reveal
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelectorAll('.flow__stage'),
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 68%', once: true },
        });
      const stream = root.querySelector('.flow__path-stream');
      if (stream) {
        gsap.fromTo(stream,
          { strokeDashoffset: 800 },
          {
            strokeDashoffset: 0, duration: 2.2, ease: 'power2.out',
            scrollTrigger: { trigger: root, start: 'top 68%', once: true },
          });
      }
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="flow" id="how-it-works" ref={rootRef}>
      <div className="container">
        <header className="flow__head">
          <span className="flow__eyebrow">How solar works</span>
          <h2 className="flow__title">From sunlight to everyday power.</h2>
          <p className="flow__lede">
            Photons hit the panels. Direct current flows to an inverter. The home receives
            usable alternating current. Every step is measured and visible.
          </p>
        </header>

        <div className="flow__diagram">
          <svg viewBox="0 0 1080 220" preserveAspectRatio="xMidYMid meet" role="img"
               aria-label="Energy flow from sunlight through solar panels, inverter and home">
            <path className="flow__path-base" d={PATH_D} fill="none" />
            <path className="flow__path-stream" d={PATH_D} fill="none" ref={pathRef} />
            {[0, 1, 2].map((i) => (
              <circle key={i} className="flow__dot" r="3"
                ref={(el) => { dotRefs.current[i] = el; }} />
            ))}
            {STAGES.map((s) => (
              <g key={s.id} className="flow__stage">
                <circle cx={s.x} cy={120} r="6" className="flow__node" />
                <text x={s.x} y={170} textAnchor="middle" className="flow__label">
                  {s.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
