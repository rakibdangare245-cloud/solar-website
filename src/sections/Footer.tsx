import { siteConfig } from '../config/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-mark">{siteConfig.brand}</span>
          <p className="footer__brand-note">
            Rooftop and ground-mount solar, designed for the way modern buildings use power.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {siteConfig.nav.map((item) => (
            <a key={item.label} className="footer__link" href={item.href} data-cursor="link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer__meta">
          <span>© {year} {siteConfig.brand}</span>
          <span>Placeholder site — swap brand and copy before launch.</span>
        </div>
      </div>
    </footer>
  );
}
