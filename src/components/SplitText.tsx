import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  duration?: number;
  delay?: number;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function SplitText({
  text,
  className = '',
  as: Tag = 'span',
  duration = 1200,
  delay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setTimeout(() => {
            const start = performance.now();
            const animate = () => {
              const elapsed = performance.now() - start;
              const progress = Math.min(1, elapsed / duration);
              const revealed = Math.floor(progress * text.length);
              const result = text
                .split('')
                .map((c, i) => {
                  if (i < revealed) return c;
                  if (c === ' ') return ' ';
                  return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');
              setDisplay(result);
              if (progress < 1) requestAnimationFrame(animate);
              else setDisplay(text);
            };
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, duration, delay]);

  const Component = Tag as any;
  return (
    <Component ref={ref} className={className}>
      {display}
    </Component>
  );
}
