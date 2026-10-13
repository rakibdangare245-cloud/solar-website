import type { ReactElement } from 'react';

const STROKE = {
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.25,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
};
const DASHED = { ...STROKE, strokeDasharray: '4 5' };

const ILLUSTRATIONS: Record<string, ReactElement> = {
  '01': (<>
    <rect x="64" y="18" width="76" height="100" rx="3" {...STROKE} />
    <path d="M78 42h48M78 58h48M78 74h30" {...STROKE} />
    <circle cx="42" cy="106" r="11" {...STROKE} />
    <path d="M37 106l4 4 7-8" {...STROKE} />
  </>),
  '02': (<>
    <path d="M52 70l48-34 48 34" {...STROKE} />
    <path d="M66 66v52h68V66" {...STROKE} />
    <path d="M92 118V92h16v26" {...STROKE} />
    <circle cx="160" cy="34" r="11" {...STROKE} />
    <path d="M160 14v-6M160 60v-6M140 34h-6M186 34h-6" {...STROKE} />
    <path d="M28 24v96" {...DASHED} />
  </>),
  '03': (<>
    <rect x="30" y="24" width="140" height="88" rx="2" {...STROKE} />
    <path d="M30 52h140M30 84h140M78 24v88M126 24v88" {...STROKE} strokeOpacity="0.45" />
    <rect x="42" y="36" width="24" height="10" rx="1" {...STROKE} />
    <rect x="90" y="36" width="24" height="10" rx="1" {...STROKE} />
    <rect x="138" y="36" width="24" height="10" rx="1" {...STROKE} />
  </>),
  '04': (<>
    <path d="M28 96l72-52 72 52" {...STROKE} />
    <path d="M56 74l10 12M86 53l10 12M116 53l10 12M146 74l10 12" {...STROKE} strokeOpacity="0.5" />
    <rect x="60" y="80" width="18" height="6" rx="1" {...STROKE} />
    <rect x="92" y="60" width="18" height="6" rx="1" {...STROKE} />
  </>),
  '05': (<>
    <path d="M28 92l72-50 72 50" {...STROKE} />
    <rect x="52" y="62" width="30" height="20" rx="1" {...STROKE} />
    <rect x="88" y="38" width="30" height="20" rx="1" {...STROKE} />
    <rect x="124" y="62" width="30" height="20" rx="1" {...STROKE} />
    <path d="M100 96v22M84 118h32" {...STROKE} />
  </>),
  '06': (<>
    <path d="M40 84l50-34 50 34" {...STROKE} />
    <path d="M52 80v44h76V80" {...STROKE} />
    <rect x="66" y="60" width="20" height="13" rx="1" {...STROKE} />
    <rect x="94" y="60" width="20" height="13" rx="1" {...STROKE} />
    <circle cx="164" cy="32" r="9" {...STROKE} />
    <path d="M148 54c12 10 8 24-2 30" {...DASHED} />
  </>),
};

interface StageIllustrationProps { readonly stage: string; }

export function StageIllustration({ stage }: StageIllustrationProps) {
  const art = ILLUSTRATIONS[stage];
  if (!art) return null;

  return (
    <svg className="stage__art" viewBox="0 0 200 140" role="presentation" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
