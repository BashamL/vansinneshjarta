import ArrowIcon from "./arrow-icon";
import PoemReader from "./poem-reader";
import { checkoutConfigured } from "@/lib/stripe";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#innehall">
        Hoppa till innehållet
      </a>
      <header className="site-header">
        <a className="author-name" href="#hem">
          irma tegge
        </a>
        <nav aria-label="Huvudmeny">
          <a href="#om-boken">om boken</a>
          {checkoutConfigured() && <a href="/bestall">beställ boken</a>}
          <a href="#dikter">
            några dikter <ArrowIcon direction="up-right" />
          </a>
        </nav>
      </header>
      <main id="innehall">
        <section className="title-page" id="hem" aria-labelledby="boktitel">
          <p className="small-caps">poesi av irma tegge</p>
          <h1 id="boktitel">vansinnehjärta</h1>
          <p className="subtitle">en diktsamling</p>
          <span className="fine-line" aria-hidden="true" />
          <figure className="opening-quote">
            <blockquote>
              all ångest, sorg, skuld, bottenlös kärlek
              <br />
              ska en dag få fylla en hel bok
            </blockquote>
            <figcaption>ur min dagbok · s. 69</figcaption>
          </figure>
          <a className="read-link" href="#dikter">
            läs några rader <ArrowIcon direction="down" />
          </a>
          <span className="title-folio" aria-hidden="true">
            i
          </span>
        </section>

        <section
          id="om-boken"
          className="about-section"
          aria-labelledby="om-titel"
        >
          <div className="section-heading">
            <span className="small-caps">om boken</span>
            <span aria-hidden="true">ii</span>
          </div>
          <div className="about-copy">
            <h2 id="om-titel">
              det som känns.
              <br />
              <em>det som blir kvar.</em>
            </h2>
            <div className="about-prose">
              <p>
                I <em>vansinnehjärta</em> skriver Irma Tegge om kärleken som bär
                och kärleken som gör ont. Om saknad, familj, ensamhet och de små
                stunder då livet blir ljust igen.
              </p>
              <p>
                Här finns städer att lämna och platser att komma hem till.
                Årstider som känns i kroppen. Och orden som får hålla det som är
                svårt att säga högt.
              </p>
            </div>
          </div>
        </section>

        <section
          id="dikter"
          className="poems-section"
          aria-labelledby="dikter-titel"
        >
          <div className="section-heading">
            <h2 id="dikter-titel" className="small-caps">
              några sidor ur boken
            </h2>
            <span aria-hidden="true">iii</span>
          </div>
          <PoemReader />
        </section>

        <section className="closing" aria-label="Avslutande rader ur boken">
          <p className="small-caps">irma tegge</p>
          <blockquote>
            mitt modiga
            <br />
            <em>vansinnehjärta</em>
          </blockquote>
          <svg
            className="closing-heart"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M16 27S4 19.5 4 11.5a6.5 6.5 0 0 1 12-3.4 6.5 6.5 0 0 1 12 3.4C28 19.5 16 27 16 27Z" />
          </svg>
          <p className="closing-caption">ur bokens sista dikt</p>
        </section>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Irma Tegge</span>
        <a href="#hem">
          till första sidan <ArrowIcon direction="up" />
        </a>
      </footer>
    </>
  );
}
