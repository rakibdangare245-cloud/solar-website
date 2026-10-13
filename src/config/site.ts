export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export const siteConfig = {
  brand: 'SOLAR COMPANY',
  nav: [
    { label: 'Solutions', href: '#solutions' },
    { label: 'How It Works', href: '#installation-story' },
    { label: 'Why Solar', href: '#why' },
    { label: 'Overview', href: '#presentation' },
    { label: 'Voices', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ] as readonly NavItem[],
  cta: { label: 'Get Started', href: '#contact' } as NavItem,
} as const;
