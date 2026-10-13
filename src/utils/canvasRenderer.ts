export function drawImageCover(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  focalX = 0.5,
  focalY = 0.5,
  dprCap = 2,
): boolean {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const bufW = Math.max(1, Math.round(rect.width * dpr));
  const bufH = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width !== bufW || canvas.height !== bufH) {
    canvas.width = bufW;
    canvas.height = bufH;
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return false;

  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  if (!iw || !ih) return false;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const scale = Math.max(rect.width / iw, rect.height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (rect.width - dw) * focalX;
  const dy = (rect.height - dh) * focalY;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, dx, dy, dw, dh);
  return true;
}