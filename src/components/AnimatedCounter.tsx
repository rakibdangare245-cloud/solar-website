import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  to,
  from = 0,
  duration = 1800,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const animate = () => {
            const elapsed = performance.now() - start;
            const t = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(from + (to - from) * eased);
            if (t < 1) requestAnimationFrame(animate);
            else setValue(to);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
