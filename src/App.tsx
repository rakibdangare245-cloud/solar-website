import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from './components/Hero';
import { Loader } from './components/Loader';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ChapterIndicator } from './components/ChapterIndicator';
import { Marquee } from './components/Marquee';
import { InstallationStory } from './sections/InstallationStory';
import { HowSolarWorks } from './sections/HowSolarWorks';
import { SolutionsSlider } from './sections/SolutionsSlider';
import { HorizontalWhy } from './sections/HorizontalWhy';
import { InstallationProcess } from './sections/InstallationProcess';
import { PresentationDeck } from './sections/PresentationDeck';
import { TrustQuality } from './sections/TrustQuality';
import { TestimonialsSlider } from './sections/TestimonialsSlider';
import { Consultation } from './sections/Consultation';
import { CTASection } from './sections/CTASection';
import { Footer } from './sections/Footer';
import { createSiteFrameLoader, type FrameLoader } from './utils/frameLoader';
import { attachReveals } from './animations/scrollReveal';
import { useFinePointer } from './hooks/useFinePointer';
import { useReducedMotion } from './hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loader] = useState<FrameLoader>(() => createSiteFrameLoader());
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const mainRef = useRef<HTMLElement>(null);

  const [heroReady, setHeroReady] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    loader.start();
    return () => loader.dispose();
  }, [loader]);

  // Wire the single reveal pass over the whole main
  useEffect(() => {
    const main = mainRef.current;
    if (!main || !heroReady) return;
    const cleanup = attachReveals(main, { reducedMotion });
    return cleanup;
  }, [heroReady, reducedMotion]);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => { if (!cancelled) ScrollTrigger.refresh(); };
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(refresh).catch(() => undefined);
    }
    return () => { cancelled = true; };
  }, []);

  const handleReady = useCallback(() => setHeroReady(true), []);
  const handleExited = useCallback(() => {
    setLoaderVisible(false);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 140);
    });
  }, []);

  return (
    <>
      <Navigation ready={heroReady} />
      <ScrollProgressBar />
      <ChapterIndicator />
      <main ref={mainRef}>
        <Hero loader={loader} ready={heroReady} reducedMotion={reducedMotion} />
        <Marquee
          items={['Rooftop solar','Battery storage','Grid-tied systems','Monitoring','Commercial','Residential','Off-grid','Maintenance']}
        />
        <InstallationStory reducedMotion={reducedMotion} />
        <HowSolarWorks reducedMotion={reducedMotion} />
        <SolutionsSlider reducedMotion={reducedMotion} />
        <HorizontalWhy reducedMotion={reducedMotion} />
        <InstallationProcess reducedMotion={reducedMotion} />
        <PresentationDeck reducedMotion={reducedMotion} />
        <TrustQuality reducedMotion={reducedMotion} />
        <TestimonialsSlider reducedMotion={reducedMotion} />
        <Consultation reducedMotion={reducedMotion} />
        <CTASection reducedMotion={reducedMotion} />
      </main>
      <Footer />
      {finePointer && !reducedMotion ? <CustomCursor /> : null}
      {loaderVisible ? (
        <Loader loader={loader} onReady={handleReady} onExited={handleExited} />
      ) : null}
    </>
  );
}