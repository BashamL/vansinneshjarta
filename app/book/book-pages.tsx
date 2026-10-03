import poems from "../poems.json";

export type Poem = (typeof poems)[number];

export function BookMark() {
  return (
    <svg viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <path d="M1 16h12m22 0h12M24 24s-8-5-8-10a4.4 4.4 0 0 1 8-2.5 4.4 4.4 0 0 1 8 2.5c0 5-8 10-8 10Z" />
    </svg>
  );
}

export function Frontispiece({ number }: { number: number }) {
  return (
    <div className="book-leaf book-frontispiece" data-kind="frontispiece">
      <div className="book-leaf-content">
        <span className="book-running-head">irma tegge</span>
        <div className="book-inscription">
          <span className="book-inscription-kicker">ur diktsamlingen</span>
          <p>vansinnehjärta</p>
          <BookMark />
        </div>
        <span className="book-leaf-footer book-roman">{["i", "ii", "iii"][number]}</span>
      </div>
    </div>
  );
}

export function PoemLeaf({ poem }: { poem: Poem }) {
  return (
    <div className="book-leaf book-poem-leaf" data-kind="poem">
      <figure className="book-leaf-content">
        <span className="book-running-head">vansinnehjärta</span>
        <blockquote className="book-verse">
          {poem.lines.map((line, i) => (
            <span className="verse-line" key={i}>{line}</span>
          ))}
        </blockquote>
        <figcaption className="book-leaf-footer">
          <span className="sr-only">Sida </span>{poem.page}
        </figcaption>
      </figure>
    </div>
  );
}
