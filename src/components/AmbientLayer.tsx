import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; radius: number; alpha: number;
  speed: number; phase: number; drift: number;
}

const PARTICLE_COUNT = 26;

const createParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  radius: 0.4 + Math.random() * 1.1,
  alpha: 0.05 + Math.random() * 0.13,
  speed: 4 + Math.random() * 10,
  phase: 0.2 + Math.random() * 0.6,
  drift: Math.random() * Math.PI * 2,
});

interface AmbientLayerProps {
  readonly particlesEnabled: boolean;
}

export function AmbientLayer({ particlesEnabled }: AmbientLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!particlesEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const grew = rect.width > width || rect.height > height;
      width = rect.width;
      height = rect.height;

      if (particles.length === 0 || grew) {
        particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height));
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let running = true;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y -= p.speed * delta;
        p.x += Math.sin((now / 2400) * p.phase + p.drift) * 0.12;

        if (p.y < -8) {
          p.y = height + 8;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 226, 178, ${p.alpha})`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!document.hidden && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [particlesEnabled]);

  return (
    <div className="hero__ambient">
      <div className="hero__glow" data-depth="glow" />
      <canvas ref={canvasRef} className="hero__particles" data-depth="particles" aria-hidden="true" />
    </div>
  );
}
