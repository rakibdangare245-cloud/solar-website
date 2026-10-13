export type ProgressHandler = (loaded: number, total: number, failed: number) => void;

export interface FrameLoaderOptions {
  readonly urls: readonly string[];
  readonly concurrency?: number;
  readonly budget?: number;
  readonly onProgress?: ProgressHandler;
}

export function buildLoadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Uint8Array(count);
  const push = (index: number) => {
    if (index >= 0 && index < count && !seen[index]) {
      seen[index] = 1;
      order.push(index);
    }
  };
  push(0);
  const early = Math.min(count, 32);
  for (let i = 1; i < early; i += 1) push(i);
  const tail = Math.min(count, 8);
  for (let i = count - tail; i < count; i += 1) push(i);
  const stride = Math.max(1, Math.floor(count / 48));
  for (let i = early; i < count; i += stride) push(i);
  for (let i = 0; i < count; i += 1) push(i);
  return order;
}

export class FrameLoader {
  readonly total: number;
  readonly budget: number;

  private readonly urls: readonly string[];
  private readonly frames: (HTMLImageElement | undefined)[];
  private readonly order: number[];
  private readonly concurrency: number;

  private next = 0;
  private active = 0;
  private disposed = false;

  loadedCount = 0;
  failedCount = 0;

  onProgress: ProgressHandler | undefined;
  onFrameLoaded: ((index: number) => void) | undefined;

  constructor(options: FrameLoaderOptions) {
    this.urls = options.urls;
    this.total = options.urls.length;
    this.frames = new Array<HTMLImageElement | undefined>(this.total);
    this.order = buildLoadOrder(this.total);
    this.concurrency = Math.max(1, Math.min(12, options.concurrency ?? 6));
    this.budget = Math.max(1, Math.min(this.total, options.budget ?? this.total));
    this.onProgress = options.onProgress;
  }

  start(): void {
    if (this.disposed) return;
    this.pump();
  }

  get(index: number): HTMLImageElement | undefined {
    return this.frames[index];
  }

  getNearest(index: number): HTMLImageElement | undefined {
    if (this.total === 0) return undefined;
    const target = Math.max(0, Math.min(this.total - 1, index));
    const direct = this.frames[target];
    if (direct) return direct;
    for (let offset = 1; offset < this.total; offset += 1) {
      const before = this.frames[target - offset];
      if (before) return before;
      const after = this.frames[target + offset];
      if (after) return after;
    }
    return undefined;
  }

  dispose(): void {
    this.disposed = true;
    this.onFrameLoaded = undefined;
    this.onProgress = undefined;
  }

  private pump(): void {
    while (!this.disposed && this.active < this.concurrency && this.next < this.budget) {
      const frameIndex = this.order[this.next];
      this.next += 1;
      if (frameIndex === undefined || this.frames[frameIndex]) continue;
      this.request(frameIndex);
    }
  }

  private request(index: number): void {
    this.active += 1;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => this.settle(index, image, true);
    image.onerror = () => this.settle(index, undefined, false);
    image.src = this.urls[index];
  }

  private settle(index: number, image: HTMLImageElement | undefined, ok: boolean): void {
    if (this.disposed) return;
    this.active -= 1;
    if (ok && image) {
      this.frames[index] = image;
      this.loadedCount += 1;
      this.onFrameLoaded?.(index);
    } else {
      this.failedCount += 1;
    }
    this.onProgress?.(this.loadedCount, this.total, this.failedCount);
    this.pump();
  }
}

// ============== INLINED — always desktop, always 300 frames ==============
const DESKTOP_BASE = '/solar-sequence/desktop/';
const DESKTOP_COUNT = 300;
const DESKTOP_PREFIX = 'frame-';
const DESKTOP_EXT = 'jpg';
const DESKTOP_PAD = 3;

function desktopUrls(): string[] {
  const out: string[] = [];
  for (let i = 0; i < DESKTOP_COUNT; i += 1) {
    const n = String(i + 1).padStart(DESKTOP_PAD, '0');
    out.push(`${DESKTOP_BASE}${DESKTOP_PREFIX}${n}.${DESKTOP_EXT}`);
  }
  return out;
}

export function createSiteFrameLoader(): FrameLoader {
  const urls = desktopUrls();
  console.log('[loader] created — total frames:', urls.length, '| first:', urls[0]);
  return new FrameLoader({
    urls,
    concurrency: 6,
  });
}