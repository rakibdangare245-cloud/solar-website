type CursorState = 'default' | 'link' | 'cta' | 'drag' | 'view';

export function createCustomCursor(): () => void {
  // ---- Build DOM ----
  const root = document.createElement('div');
  root.className = 'cursor';
  root.dataset.state = 'default';
  root.innerHTML =
    '<div class="cursor__dot"><span></span></div>' +
    '<div class="cursor__ring"><span></span></div>' +
    '<div class="cursor__label"></div>';

  document.body.appendChild(root);
  document.documentElement.classList.add('has-custom-cursor');

  const dot   = root.querySelector<HTMLElement>('.cursor__dot')!;
  const ring  = root.querySelector<HTMLElement>('.cursor__ring')!;
  const label = root.querySelector<HTMLElement>('.cursor__label')!;

  // ---- State ----
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;
  let pressing = false;
  let raf = 0;
  const LERP = 0.18;

  const clamp = (v: number, min: number, max: number) =>
    v < min ? min : v > max ? max : v;

  // ---- rAF loop ----
  const tick = () => {
    // Ring trails the mouse
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;

    // Clamp to viewport so cursor never escapes
    const cx = clamp(rx, 0, window.innerWidth);
    const cy = clamp(ry, 0, window.innerHeight);

    // Use GPU-friendly translate3d
    dot.style.transform   = `translate3d(${mx}px, ${my}px, 0)`;
    ring.style.transform  = `translate3d(${cx}px, ${cy}px, 0)`;
    label.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;

    // Press pulse
    const pressScale = pressing ? 0.85 : 1;
    ring.style.setProperty('--press-scale', String(pressScale));

    raf = requestAnimationFrame(tick);
  };

  // ---- Visibility ----
  const show = () => {
    if (visible) return;
    visible = true;
    root.style.opacity = '1';
  };
  const hide = () => {
    if (!visible) return;
    visible = false;
    root.style.opacity = '0';
  };

  // ---- Event handlers ----
  const onPointerMove = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
    show();
  };

  const onPointerOver = (e: PointerEvent) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const owner = t.closest<HTMLElement>('[data-cursor]');
    if (!owner) {
      root.dataset.state = 'default';
      label.textContent = '';
      return;
    }
    const value = owner.dataset.cursor;
    const text  = owner.dataset.cursorLabel ?? '';
    if (value === 'cta' || value === 'link' || value === 'drag' || value === 'view') {
      root.dataset.state = value;
      label.textContent = text;
    } else {
      root.dataset.state = 'default';
      label.textContent = '';
    }
  };

  const onPointerDown = () => { pressing = true; };
  const onPointerUp   = () => { pressing = false; };
  const onWindowBlur  = () => { hide(); pressing = false; };

  const onLeaveWindow = (e: MouseEvent) => {
    if (e.relatedTarget === null) hide();
  };

  // ---- Wire up ----
  root.style.opacity = '0';
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerover', onPointerOver, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('blur', onWindowBlur);
  document.addEventListener('mouseleave', onLeaveWindow);

  raf = requestAnimationFrame(tick);

  // ---- Cleanup ----
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerover', onPointerOver);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('blur', onWindowBlur);
    document.removeEventListener('mouseleave', onLeaveWindow);
    document.documentElement.classList.remove('has-custom-cursor');
    root.remove();
  };
}
