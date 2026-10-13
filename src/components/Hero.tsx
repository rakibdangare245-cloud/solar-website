import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HERO_TEXT_STATES } from '../config/content';
import type { FrameLoader } from '../utils/frameLoader';

const DURATION_MS = 9000;
const DELAY_MS = 600;

interface HeroProps {
  loader: FrameLoader;
  ready: boolean;
  reducedMotion: boolean;
}

export function Hero({ loader, ready, reducedMotion }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const chaptersRef = useRef<HTMLDivElement[]>([]);
  const [complete, setComplete] = useState(false);
  const restartRef = useRef<(() => void) | null>(null);
  const rafRef = useRef<number | null>(null);

  // The video has exactly this many "virtual frames" "â€ used for the HUD counter
  const frameCount = 768; // matches source: 32s @ 24fps

  const forcePlay = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('play') === '1';
  const motionEnabled = forcePlay || !reducedMotion;

  useLayoutEffect(() => {
    const els = chaptersRef.current.filter(Boolean);
    if (!els.length) return;
    gsap.set(els.slice(1), { autoAlpha: 0, y: 28 });
    gsap.set(els[0], { autoAlpha: 1, y: 0 });
  }, []);

  useEffect(() => {
    console.log('[hero] mount | motionEnabled =', motionEnabled);

    const video = videoRef.current;
    if (!video) return;

    // Video is always muted + playsinline so autoplay works everywhere
    video.muted = true;
    video.playsInline = true;

    // Wait for metadata so we know duration
    const onMeta = () => {
      console.log('[hero] video metadata | duration =', video.duration);
    };
    if (video.readyState >= 1) onMeta();
    else video.addEventListener('loadedmetadata', onMeta, { once: true });

    // Refresh ScrollTrigger once the video has real dimensions
    const onLoaded = () => ScrollTrigger.refresh();
    video.addEventListener('loadeddata', onLoaded, { once: true });

    // Pause at start
    video.pause();
    video.currentTime = 0;

    if (!motionEnabled) {
      console.log('[hero] motion disabled "â€ static frame');
      return;
    }

    let activeChapter = 0;
    const swapChapter = (next: number) => {
      if (next === activeChapter) return;
      const els = chaptersRef.current.filter(Boolean);
      if (!els[next]) return;
      const prevEl = els[activeChapter];
      activeChapter = next;
      if (prevEl) gsap.to(prevEl, { autoAlpha: 0, y: -22, duration: 0.5, ease: 'power2.inOut' });
      gsap.fromTo(els[next], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    };

    // Use requestVideoFrameCallback for frame-perfect HUD updates if available
    let rvfcId: number | null = null;
    const useRvfc = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    const updateHud = () => {
      const dur = video.duration || 10;
      const t = video.currentTime / dur;
      const idx = Math.min(frameCount - 1, Math.round(t * (frameCount - 1)));

      if (counterRef.current) counterRef.current.textContent = String(idx + 1).padStart(3, '0');
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${t})`;

      // Chapter swap thresholds (same as before)
      const total = frameCount - 1;
      if (idx >= total * 0.78) swapChapter(3);
      else if (idx >= total * 0.52) swapChapter(2);
      else if (idx >= total * 0.25) swapChapter(1);
    };

    const play = () => {
      console.log('[hero] PLAYBACK START');
      video.currentTime = 0;
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch((err) => console.warn('[hero] play() rejected:', err));
      }
    };

    const onTimeUpdate = () => updateHud();

    const onEnded = () => {
      console.log('[hero] COMPLETE');
      setComplete(true);
      cancelAnimationFrame(rafRef.current ?? 0);
      if (rvfcId !== null) {
        (video as any).cancelVideoFrameCallback(rvfcId);
        rvfcId = null;
      }
    };

    const startRvfc = () => {
      if (!useRvfc) return;
      const loop = (_now: number, _meta: any) => {
        updateHud();
        rvfcId = (video as any).requestVideoFrameCallback(loop);
      };
      rvfcId = (video as any).requestVideoFrameCallback(loop);
    };

    video.addEventListener('ended', onEnded);
    if (useRvfc) startRvfc();
    else video.addEventListener('timeupdate', onTimeUpdate);

    // Restart handler for the Replay button
    restartRef.current = () => {
      setComplete(false);
      activeChapter = 0;
      const els = chaptersRef.current.filter(Boolean);
      gsap.set(els.slice(1), { autoAlpha: 0, y: 28 });
      gsap.set(els[0], { autoAlpha: 1, y: 0 });
      if (counterRef.current) counterRef.current.textContent = '001';
      if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)';
      video.currentTime = 0;
      window.setTimeout(play, 80);
    };

    // Auto-start with delay
    let started = false;
    const waitForCanPlay = () => {
      if (started) return;
      if (video.readyState >= 3) {
        started = true;
        window.setTimeout(play, DELAY_MS);
      } else {
        requestAnimationFrame(waitForCanPlay);
      }
    };
    requestAnimationFrame(waitForCanPlay);

    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onMeta);
      if (rvfcId !== null && useRvfc) {
        (video as any).cancelVideoFrameCallback(rvfcId);
      }
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      video.pause();
    };
  }, [reducedMotion, motionEnabled, frameCount]);

  useEffect(() => {
    const btn = replayRef.current;
    if (!btn) return;
    if (complete && motionEnabled) {
      gsap.to(btn, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' });
    } else {
      gsap.to(btn, { autoAlpha: 0, y: 12, duration: 0.3, ease: 'power2.in' });
    }
  }, [complete, motionEnabled]);

  const handleReplay = useCallback(() => {
    setComplete(false);
    restartRef.current?.();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="hero" aria-label="Solar energy">
      <div className="hero__media">
        <video
          ref={videoRef}
          className="hero__canvas"       // keep same class "â€ CSS targets it
          src="/videos/hero.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hero__vignette" aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />
      </div>

      <div className="hero__copy">
        {HERO_TEXT_STATES.map((state, i) => (
          <div key={state.id} className="hero__chapter"
            ref={(el) => { if (el) chaptersRef.current[i] = el; }}>
            <span className="hero__eyebrow">{state.eyebrow}</span>
            {i === 0
              ? <h1 className="hero__headline" dangerouslySetInnerHTML={{ __html: state.headline }} />
              : <h2 className="hero__headline" dangerouslySetInnerHTML={{ __html: state.headline }} />}
            {state.support ? <p className="hero__support">{state.support}</p> : null}
          </div>
        ))}
      </div>

      <div className="hero__hud">
        <div className="hero__meta">
          <span ref={counterRef} className="hero__counter">001</span>
          <span className="hero__counter-total">/ {String(frameCount).padStart(3, '0')}</span>
        </div>
        <div className="hero__progress">
          <span ref={progressRef} className="hero__progress-fill" />
        </div>
        <button ref={replayRef} type="button" className="hero__replay"
          onClick={handleReplay} aria-label="Replay sequence" data-cursor="cta">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8a5 5 0 1 0 1.5-3.5M3 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Replay sequence</span>
        </button>
      </div>
    </section>
  );
}

