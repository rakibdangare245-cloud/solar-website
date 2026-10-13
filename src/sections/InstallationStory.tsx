import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY_STAGES } from '../config/content';
import { StageIllustration } from '../components/StageIllustration';

gsap.registerPlugin(ScrollTrigger);

interface InstallationStoryProps { readonly reducedMotion: boolean; }

export function InstallationStory({ reducedMotion }: InstallationStoryProps) {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const stages = Array.from(root.querySelectorAll<HTMLElement>('.stage'));
    const progress = progressRef.current;

    const ctx = gsap.context(() => {
      stages.forEach((stage) => {
        gsap.fromTo(stage,
          { opacity: 0, y: 34 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: stage, start: 'top 88%', once: true },
          },
        );
      });

      if (progress) {
        gsap.fromTo(progress,
          { scaleY: 0 },
          {
            scaleY: 1, ease: 'none', transformOrigin: 'top center',
            scrollTrigger: { trigger: root, start: 'top 62%', end: 'bottom 78%', scrub: 0.4 },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="story" id="installation-story" ref={rootRef}>
      <div className="container story__grid">
        <aside className="story__aside">
          <span className="story__eyebrow">How it works</span>
          <h2 className="story__title">Installation Story</h2>
          <p className="story__lede">
            Six stages from first conversation to system activation. Every stage is documented before the next one begins.
          </p>
          <div className="story__progress">
            <span className="story__progress-rail">
              <span className="story__progress-fill" ref={progressRef} />
            </span>
            <span className="story__progress-label">01 — 06</span>
          </div>
        </aside>

        <ol className="story__stages">
          {STORY_STAGES.map((stage) => (
            <li className="stage" key={stage.index}>
              <span className="stage__index">{stage.index}</span>
              <div className="stage__body">
                <h3 className="stage__title">{stage.title}</h3>
                <p className="stage__desc">{stage.description}</p>
              </div>
              <StageIllustration stage={stage.index} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
