import gsap from 'gsap';

export interface MagneticOptions {
  readonly strength?: number;
  readonly maxOffset?: number;
}

export function createMagnetic(
  element: HTMLElement,
  options: MagneticOptions = {},
): () => void {
  const strength = options.strength ?? 0.28;
  const maxOffset = options.maxOffset ?? 9;

  const xTo = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });

  const onPointerMove = (event: PointerEvent) => {
    const rect = element.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    xTo(gsap.utils.clamp(-1, 1, relX) * strength * maxOffset * 2);
    yTo(gsap.utils.clamp(-1, 1, relY) * strength * maxOffset * 2);
  };

  const onPointerLeave = () => { xTo(0); yTo(0); };

  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerleave', onPointerLeave);

  return () => {
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerleave', onPointerLeave);
    gsap.killTweensOf(element);
  };
}
