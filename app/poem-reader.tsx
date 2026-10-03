"use client";

import ArrowIcon from "./arrow-icon";

import { useEffect, useState } from "react";
import poems from "./poems.json";

type PageTurn = { target: number; direction: "forward" | "backward" };

function Poem({ poem }: { poem: (typeof poems)[number] }) {
  return (
    <figure className="poem">
      <blockquote>
        {poem.lines.map((line, i) => (
          <span className="verse-line" key={i}>
            {line}
          </span>
        ))}
      </blockquote>
      <figcaption>
        <span className="sr-only">Sida </span>
        {poem.page}
      </figcaption>
    </figure>
  );
}

export default function PoemReader() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<PageTurn | null>(null);
  const visibleIndex = turn?.direction === "forward" ? turn.target : index;

  // Also finish if motion preferences change or an animation is interrupted.
  useEffect(() => {
    if (!turn) return;
    const timeout = window.setTimeout(() => {
      setIndex(turn.target);
      setTurn(null);
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [turn]);

  function turnPage(direction: -1 | 1) {
    const target = index + direction;
    if (turn || target < 0 || target >= poems.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(target);
      return;
    }

    setTurn({ target, direction: direction === 1 ? "forward" : "backward" });
  }

  return (
    <div className="reader">
      <div
        className="poem-page"
        data-turn={turn?.direction}
        aria-live="polite"
        aria-atomic="true"
        aria-busy={Boolean(turn)}
      >
        <div className="poem-stack">
          {poems.map((poem, poemIndex) => (
            <div
              className="poem-sheet"
              key={poem.page}
              data-visible={poemIndex === visibleIndex}
              aria-hidden={poemIndex !== visibleIndex}
            >
              <Poem poem={poem} />
            </div>
          ))}
        </div>
        {turn && (
          <div
            className="page-turn"
            aria-hidden="true"
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget) return;
              setIndex(turn.target);
              setTurn(null);
            }}
          >
            <Poem poem={poems[turn.direction === "forward" ? index : turn.target]} />
          </div>
        )}
      </div>
      <div className="reader-controls" aria-label="Bläddra mellan dikter">
        <button
          type="button"
          disabled={index === 0}
          aria-disabled={Boolean(turn) || index === 0}
          onClick={() => turnPage(-1)}
          aria-label="Föregående dikt"
        >
          <ArrowIcon direction="left" />
          <span>föregående</span>
        </button>
        <span
          className="reader-count"
          aria-label={`Dikt ${index + 1} av ${poems.length}`}
        >
          {index + 1} <span aria-hidden="true">/</span> {poems.length}
        </span>
        <button
          type="button"
          disabled={index === poems.length - 1}
          aria-disabled={Boolean(turn) || index === poems.length - 1}
          onClick={() => turnPage(1)}
          aria-label="Nästa dikt"
        >
          <span>nästa sida</span>
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}
