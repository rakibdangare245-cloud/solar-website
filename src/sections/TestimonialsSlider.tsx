import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TESTIMONIALS } from '../config/content';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsSliderProps { readonly reducedMotion: boolean; }

export function TestimonialsSlider({ reducedMotion }: TestimonialsSliderProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelector('.testimonials__head'),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="testimonials" id="testimonials" ref={rootRef}>
      <div className="container">
        <header className="testimonials__head">
          <span className="testimonials__eyebrow">Voices</span>
          <h2 className="testimonials__title">From the people running the systems.</h2>
        </header>
      </div>

      <div className="testimonials__slider">
        <Swiper
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          pagination={{ clickable: true }}
          navigation
          autoplay={reducedMotion ? false : { delay: 6500, disableOnInteraction: true }}
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.author + t.role}>
              <figure className="testimonial">
                <blockquote className="testimonial__quote">"{t.quote}"</blockquote>
                <figcaption className="testimonial__caption">
                  <span className="testimonial__author">{t.author}</span>
                  <span className="testimonial__role">{t.role}</span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
