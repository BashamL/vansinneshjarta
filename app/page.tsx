import Link from "next/link";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#innehall">
        Hoppa till innehållet
      </a>
      <header className="header">
        <Link
          className="wordmark"
          href="/"
          aria-label="Vansinneshjärta, startsida"
        >
          VT<span>Irma Tegge</span>
        </Link>
        <nav aria-label="Huvudmeny">
          <a href="#boken">Boken</a>
          <a href="#forfattaren">Författaren</a>
        </nav>
      </header>
      <main id="innehall">
        <section className="hero" aria-labelledby="titel">
          <div className="hero-copy">
            <p className="eyebrow">En bok av Irma Tegge</p>
            <h1 id="titel">
              Vansinnes
              <span>
                hjärta<span className="dot">.</span>
              </span>
            </h1>
            <p className="intro">Här börjar berättelsen.</p>
            <a className="button" href="#boken">
              Upptäck boken <span aria-hidden="true">↗</span>
            </a>
            <p className="small-note">Mer om boken kommer snart.</p>
          </div>
          <div
            className="art"
            role="img"
            aria-label="Abstrakt hjärta i vinrött mot en varm, ljus bakgrund"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="heart" />
            <span className="art-caption">VANSINNESHJÄRTA / IRMA TEGGE</span>
          </div>
          <div className="hero-bottom">
            <span>Ord. Sidor. Ett hjärta.</span>
            <a href="#boken" aria-label="Läs mer om boken">
              ↓
            </a>
            <span>01 — Början</span>
          </div>
        </section>
        <section id="boken" className="section">
          <p className="eyebrow">01 / Boken</p>
          <div>
            <h2>
              Ett namn.
              <br />
              En början.
            </h2>
            <p>
              <em>Vansinneshjärta</em> är en bok av Irma Tegge. Den här platsen
              växer fram tillsammans med boken.
            </p>
            <p className="muted">
              Här kommer du att kunna läsa mer om boken, ta del av smakprov och
              hitta information om utgivningen.
            </p>
            <span className="status">
              <span aria-hidden="true">●</span> Mer information kommer
            </span>
          </div>
        </section>
        <section id="forfattaren" className="section author">
          <p className="eyebrow">02 / Författaren</p>
          <div>
            <h2>Irma Tegge</h2>
            <p>
              Författare till <em>Vansinneshjärta</em>.
            </p>
            <p className="muted">En närmare presentation kommer snart.</p>
          </div>
        </section>
      </main>
      <footer>
        <a href="#titel">
          Vansinneshjärta<span aria-hidden="true"> ↑</span>
        </a>
        <span>© {new Date().getFullYear()} Irma Tegge</span>
      </footer>
    </>
  );
}
