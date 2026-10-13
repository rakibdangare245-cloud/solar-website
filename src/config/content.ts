export interface HeroTextState {
  readonly id: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly support?: string;
}

export const HERO_TEXT_STATES: readonly HeroTextState[] = [
  {
    id: 'technology',
    eyebrow: '01 — Solar technology',
    headline: 'Power <em>from</em> the sun.',
    support: 'Solar energy designed for the way modern homes live.',
  },
  {
    id: 'home',
    eyebrow: '02 — Home integration',
    headline: 'Built <em>for</em> your home.',
  },
  {
    id: 'motion',
    eyebrow: '03 — Energy flow',
    headline: 'Energy. <em>In</em> motion.',
  },
  {
    id: 'final',
    eyebrow: '04 — Everyday power',
    headline: 'Turn sunlight <em>into</em> everyday power.',
  },
];

export interface StoryStage {
  readonly index: string;
  readonly title: string;
  readonly description: string;
}

export const STORY_STAGES: readonly StoryStage[] = [
  { index: '01', title: 'Consultation',
    description: 'Understand your property, energy needs and goals before anything is specified.' },
  { index: '02', title: 'Site Assessment',
    description: 'Roof orientation, shading, structural capacity and available area are measured on site.' },
  { index: '03', title: 'System Design',
    description: 'Array layout, inverter selection and expected generation are modelled for your address.' },
  { index: '04', title: 'Rooftop Preparation',
    description: 'Mounting rails, flashing and cable routes are set out before a single panel is lifted.' },
  { index: '05', title: 'Professional Installation',
    description: 'Panels, inverter and isolation are installed and electrically tested by accredited installers.' },
  { index: '06', title: 'System Activation',
    description: 'Commissioning, monitoring setup and handover, so you can see generation from day one.' },
];

export interface SolutionCard {
  readonly index: string;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

export const SOLUTION_CARDS: readonly SolutionCard[] = [
  { index: 'R-01', title: 'Residential Rooftop',
    summary: 'Grid-tied rooftop systems sized for single-family homes and duplexes.',
    bullets: ['3–15 kW typical', 'Hybrid-ready inverter', 'Monitoring included'] },
  { index: 'C-02', title: 'Commercial & Industrial',
    summary: 'Rooftop and ground-mount arrays for warehouses, retail and light industry.',
    bullets: ['25 kW – 1 MW', 'Three-phase', 'Load-matched design'] },
  { index: 'O-03', title: 'Off-Grid & Backup',
    summary: 'Battery-backed systems for remote sites and grid-outage resilience.',
    bullets: ['Battery storage', 'Automatic transfer', 'Remote diagnostics'] },
  { index: 'S-04', title: 'Solar Carports',
    summary: 'Shaded parking structures that generate power and protect vehicles.',
    bullets: ['Structural engineering', 'EV-charger ready', 'Custom spans'] },
  { index: 'M-05', title: 'Maintenance & O&M',
    summary: 'Panel cleaning, string-level checks and annual performance reporting.',
    bullets: ['Thermal imaging', 'Inverter servicing', 'Yield reports'] },
  { index: 'A-06', title: 'Advisory & Audit',
    summary: 'Independent yield modelling, site survey and tender support.',
    bullets: ['Shadow analysis', 'Financial model', 'Spec review'] },
];

export interface PresentationSlide {
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
}

export const PRESENTATION_SLIDES: readonly PresentationSlide[] = [
  { index: '01 / 06', eyebrow: 'Context', title: 'Why rooftop solar now',
    body: 'Electricity prices are volatile and grid demand is rising. Rooftop generation turns an uncontrollable cost into a predictable, on-site asset.',
    points: ['Volatile tariffs', 'Rising demand', 'Falling hardware costs'] },
  { index: '02 / 06', eyebrow: 'Technology', title: 'How a PV system works',
    body: 'Panels convert photons to DC current. An inverter converts DC to grid-compatible AC, and monitoring reports yield minute by minute.',
    points: ['Photovoltaic effect', 'MPPT tracking', 'String architecture'] },
  { index: '03 / 06', eyebrow: 'Design', title: 'Sized for your roof',
    body: 'Array layout follows the roof planes, not a generic pattern. Shading, tilt and azimuth are modelled before anything is ordered.',
    points: ['Shadow modelling', 'Tilt & azimuth', 'Wind loading'] },
  { index: '04 / 06', eyebrow: 'Installation', title: 'Built to outlast the roof',
    body: 'Rails are flashed, penetrations sealed, and DC cabling routed in UV-rated conduit. Every array is pressure-tested before handover.',
    points: ['Flashing & sealing', 'Cable management', 'Electrical testing'] },
  { index: '05 / 06', eyebrow: 'Performance', title: 'What you actually see',
    body: 'Real generation, not brochure figures. Daily yield, self-consumption and grid export are reported live from the inverter.',
    points: ['Live monitoring', 'Yield history', 'Export tracking'] },
  { index: '06 / 06', eyebrow: 'Aftercare', title: 'Ongoing service',
    body: 'Annual checks, thermal imaging and inverter firmware updates keep the array producing at specification for its full service life.',
    points: ['Annual service', 'Thermal scan', 'Firmware updates'] },
];

export interface Testimonial {
  readonly quote: string;
  readonly author: string;
  readonly role: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  { quote: 'Clear scope, clean install, and the monitoring dashboard makes generation obvious from day one.',
    author: 'Homeowner', role: 'Residential — South-facing roof' },
  { quote: 'They modelled the shading before quoting. The array performs exactly as the model predicted.',
    author: 'Facilities Manager', role: 'Commercial — Distribution centre' },
  { quote: 'Battery backup carried us through two grid outages without a flicker on the office systems.',
    author: 'Operations Lead', role: 'Off-grid — Regional office' },
];