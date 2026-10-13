export interface SequenceSource {
  readonly basePath: string;
  readonly frameCount: number;
  readonly prefix: string;
  readonly extension: 'webp' | 'jpg';
  readonly pad: number;
}

export const DESKTOP_SEQUENCE: SequenceSource = {
  basePath: '/solar-sequence/desktop/',
  frameCount: 300,
  prefix: 'frame-',
  extension: 'jpg',
  pad: 3,
};

export const MOBILE_SEQUENCE: SequenceSource = {
  basePath: '/solar-sequence/mobile/',
  frameCount: 150,
  prefix: 'frame-',
  extension: 'jpg',
  pad: 3,
};

export const frameUrl = (source: SequenceSource, index: number): string =>
  `${source.basePath}${source.prefix}${String(index + 1).padStart(source.pad, '0')}.${source.extension}`;

export const frameUrls = (source: SequenceSource): string[] =>
  Array.from({ length: source.frameCount }, (_, index) => frameUrl(source, index));

export const HERO = {
  playbackDurationMs: 9000,
  autoplayDelayMs: 600,
  dprCap: 2,
  focalX: 0.5,
  focalY: 0.5,
  parallaxMaxY: 70,
} as const;