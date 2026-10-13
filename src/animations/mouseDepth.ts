import gsap from 'gsap';

export interface DepthLayer {
  readonly element: HTMLElement;
  readonly depth: number;
}

export function createMouseDepth(layers: DepthLayer[]): () => void {
  if (layers.length === 0) return () => undefined;

  const setters = layers.map(({ element, depth }) => ({
    depth,
    x: gsap.quickTo(element, 'x', { duration: 0.9, ease: 'power3.out' }),
    y: gsap.quickTo(element, 'y', { duration: 0.9, ease: 'power3.out' }),
    rotX: gsap.quickTo(element, 'rotationX', { duration: 1.1, ease: 'power3.out' }),
    rotY: gsap.quickTo(element, 'rotationY', { duration: 1.1, ease: 'power3.out' }),
  }));

  const onPointerMove = (event: PointerEvent) => {
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = (event.clientY / window.innerHeight) * 2 - 1;

    for (const setter of setters) {
      setter.x(nx * setter.depth);
      setter.y(ny * setter.depth);
      setter.rotX(-ny * 1.2);
      setter.rotY(nx * 1.2);
    }
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  return () => window.removeEventListener('pointermove', onPointerMove);
}
