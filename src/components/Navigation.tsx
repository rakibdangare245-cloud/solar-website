import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { siteConfig } from '../config/site';
import { ThemeToggle } from './ThemeToggle';
import { createMagnetic } from '../animations/magnetic';
import { useFinePointer } from '../hooks/useFinePointer';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NavigationProps {
  readonly ready: boolean;
}

export function Navigation({ ready }: NavigationProps) {
  const headerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);
  const [open, setOpen] = useState(false);

  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let raf = 0;
    const update = () => { raf = 0; header.dataset.scrolled = window.scrollY > 24 ? 'true' : 'false'; };

    update();
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const header = headerRef.current;
    if (!header) return;

    const items = header.querySelectorAll<HTMLElement>('[data-nav-item]');

    if (reducedMotion) { gsap.set(items, { opacity: 1, y: 0 }); return; }

    const tween = gsap.fromTo(items,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05 },
    );

    return () => { tween.kill(); };
  }, [ready, reducedMotion]);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const cta = ctaRef.current;
    if (!cta) return;
    return createMagnetic(cta, { strength: 0.3, maxOffset: 8 });
  }, [finePointer, reducedMotion]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!didMountRef.current) {
      didMountRef.current = true;
      gsap.set(panel, { display: 'none' });
      return;
    }

    if (open) {
      gsap.set(panel, { display: 'flex' });
      gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' });
      gsap.fromTo(panel.querySelectorAll('[data-mobile-item]'),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay: 0.06 },
      );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(panel, {
        opacity: 0, duration: 0.24, ease: 'power2.in',
        onComplete: () => gsap.set(panel, { display: 'none' }),
      });
      document.body.style.overflow = '';
    }

    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="nav" ref={headerRef} data-scrolled="false">
      <div className="nav__inner">
        <a className="nav__brand" href="#hero" data-nav-item data-cursor="link">{siteConfig.brand}</a>

        <nav className="nav__links" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <a key={item.label} className="nav__link" href={item.href} data-nav-item data-cursor="link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <ThemeToggle />
          <a ref={ctaRef} className="nav__cta" href={siteConfig.cta.href} data-nav-item data-cursor="cta">
            {siteConfig.cta.label}
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div className="nav__panel" ref={panelRef}>
        {siteConfig.nav.map((item) => (
          <a key={item.label} className="nav__panel-link" href={item.href} data-mobile-item onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="nav__panel-cta" href={siteConfig.cta.href} data-mobile-item onClick={() => setOpen(false)}>
          {siteConfig.cta.label}
        </a>
      </div>
    </header>
  );
}

