"use client";

import ArrowIcon from "./arrow-icon";

import { useState } from "react";
import poems from "./poems.json";

export default function PoemReader() {
  const [index, setIndex] = useState(0);
  const poem = poems[index];

  return (
    <div className="reader">
      <div className="poem-page" aria-live="polite" aria-atomic="true">
        <figure className="poem" key={poem.page}>
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
      </div>
      <div className="reader-controls" aria-label="Bläddra mellan dikter">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
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
          onClick={() => setIndex(index + 1)}
          aria-label="Nästa dikt"
        >
          <span>nästa sida</span>
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}
