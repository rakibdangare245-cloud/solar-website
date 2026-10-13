import { useEffect, useRef, useState, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ConsultationProps { reducedMotion: boolean; }

interface FormState {
  name: string; email: string; phone: string;
  property: 'residential' | 'commercial' | '';
  location: string; message: string;
}

const EMPTY: FormState = { name: '', email: '', phone: '', property: '', location: '', message: '' };

function validate(v: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Please enter a valid email.';
  if (v.phone.trim().length < 6) e.phone = 'Please enter a contact number.';
  if (!v.property) e.property = 'Select residential or commercial.';
  if (v.location.trim().length < 2) e.location = 'Please enter your location.';
  if (v.message.trim().length < 10) e.message = 'Tell us a little about the project.';
  return e;
}

export function Consultation({ reducedMotion }: ConsultationProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelectorAll('.consult__field, .consult__submit'),
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setSubmitted(true);
      // Integration point: wire this to your backend / CRM / email service.
      // eslint-disable-next-line no-console
      console.log('[consultation] payload ready:', values);
    }
  };

  return (
    <section className="consult" id="consultation" ref={rootRef}>
      <div className="container consult__grid">
        <aside className="consult__aside">
          <span className="consult__eyebrow">Consultation</span>
          <h2 className="consult__title">Start with a conversation.</h2>
          <p className="consult__lede">
            Tell us about your property and what you would like solar to do. We will follow up
            to arrange a site assessment.
          </p>
        </aside>

        {submitted ? (
          <div className="consult__success" role="status">
            <h3>Request received.</h3>
            <p>Thanks — we will be in touch to arrange the next step.</p>
          </div>
        ) : (
          <form className="consult__form" onSubmit={onSubmit} noValidate>
            <div className="consult__field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" type="text" value={values.name}
                onChange={(e) => set('name', e.target.value)} aria-invalid={Boolean(errors.name)} />
              {errors.name && <span className="consult__err">{errors.name}</span>}
            </div>

            <div className="consult__field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" type="email" value={values.email}
                onChange={(e) => set('email', e.target.value)} aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="consult__err">{errors.email}</span>}
            </div>

            <div className="consult__field">
              <label htmlFor="c-phone">Phone</label>
              <input id="c-phone" type="tel" value={values.phone}
                onChange={(e) => set('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} />
              {errors.phone && <span className="consult__err">{errors.phone}</span>}
            </div>

            <div className="consult__field">
              <label htmlFor="c-location">Location</label>
              <input id="c-location" type="text" value={values.location}
                onChange={(e) => set('location', e.target.value)} aria-invalid={Boolean(errors.location)} />
              {errors.location && <span className="consult__err">{errors.location}</span>}
            </div>

            <fieldset className="consult__field consult__field--full">
              <legend>Property type</legend>
              <div className="consult__radios">
                {(['residential', 'commercial'] as const).map((opt) => (
                  <label key={opt} className="consult__radio">
                    <input type="radio" name="property" value={opt}
                      checked={values.property === opt}
                      onChange={() => set('property', opt)} />
                    <span>{opt === 'residential' ? 'Residential' : 'Commercial'}</span>
                  </label>
                ))}
              </div>
              {errors.property && <span className="consult__err">{errors.property}</span>}
            </fieldset>

            <div className="consult__field consult__field--full">
              <label htmlFor="c-message">Message</label>
              <textarea id="c-message" rows={5} value={values.message}
                onChange={(e) => set('message', e.target.value)} aria-invalid={Boolean(errors.message)} />
              {errors.message && <span className="consult__err">{errors.message}</span>}
            </div>

            <button className="consult__submit" type="submit">Request a site assessment</button>
          </form>
        )}
      </div>
    </section>
  );
}