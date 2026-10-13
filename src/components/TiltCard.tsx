import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;         // max tilt degrees
  glare?: boolean;      // enable glare highlight
  scale?: number;       // hover scale
}

/**
 * Lightweight 3D tilt card.
 * No external deps — pure pointer math.
 */
export function TiltCard({
  children,
  className = '',
  max = 8,
  glare = true,
  scale = 1.015,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * max * 2;
    const ry = (x - 0.5) * max * 2;

    setStyle({
      transform: `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`,
      glareX: x * 100,
      glareY: y * 100,
      glareOpacity: 0.15,
    });
  };

  const onLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: style.transform,
        transition: 'transform .35s cubic-bezier(.16,1,.3,1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="tilt-card__glare"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, rgba(255,255,255,${style.glareOpacity}), transparent 55%)`,
            transition: 'opacity .3s ease',
            borderRadius: 'inherit',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}
