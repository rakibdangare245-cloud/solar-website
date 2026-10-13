import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface SectionFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function SectionFade({ children, className, delay = 0, y = 40 }: SectionFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
