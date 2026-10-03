"use client";

import { Fragment } from "react";
import { AnimatePresence, motion } from "motion/react";
import ArrowIcon from "./arrow-icon";
import { Frontispiece, PoemLeaf } from "./book/book-pages";
import { useBook } from "./book/use-book";
import poems from "./poems.json";
import "./book/book-reader.css";

export default function PoemReader() {
  const { mountRef, templatesRef, index, ready, busy, wide, reducedMotion, goTo } = useBook(poems.length);
  const poem = poems[index];

  return (
    <div
      className="book-reader"
      role="group"
      aria-label="Bläddra i vansinnehjärta"
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <div className="book-presentation">
        <div
          className="book-frame"
          data-layout={wide ? "spread" : "single"}
          data-ready={ready}
          data-turning={busy}
          aria-hidden="true"
        >
          <div className="book-cast-shadow" />
          <div className="book-cover" />
          <div className="book-paper-edges" />
          <div className="book-mount" ref={mountRef} />
          {!ready && (
            <div className="book-fallback">
              <Frontispiece number={index} />
              <PoemLeaf poem={poem} />
            </div>
          )}
          <div className="book-binding" />
        </div>
      </div>

      <div ref={templatesRef} hidden aria-hidden="true">
        {poems.map((entry, i) => (
          <Fragment key={entry.page}>
            <Frontispiece number={i} />
            <PoemLeaf poem={entry} />
          </Fragment>
        ))}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true" aria-busy={busy}>
        <p>Dikt {index + 1} av {poems.length}. Sida {poem.page}.</p>
        <blockquote>{poem.lines.map((line, i) => <span className="verse-line" key={i}>{line}</span>)}</blockquote>
      </div>

      <div className="book-navigation" aria-label="Bläddra mellan dikter">
        <motion.button
          className="book-direction book-previous"
          type="button"
          disabled={index === 0}
          aria-disabled={busy || index === 0}
          aria-label="Föregående dikt"
          onClick={() => goTo(index - 1)}
          whileHover={reducedMotion ? undefined : { x: -3 }}
          whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        >
          <ArrowIcon direction="left" />
          <span>föregående</span>
        </motion.button>

        <div className="book-position">
          <div className="book-page-tabs" aria-label="Välj dikt">
            {poems.map((entry, i) => (
              <button
                key={entry.page}
                type="button"
                className="book-page-tab"
                aria-label={`Dikt ${i + 1}, sida ${entry.page}`}
                aria-current={i === index ? "page" : undefined}
                aria-disabled={busy}
                onClick={() => goTo(i)}
              >
                <span className="book-tab-line" />
                {i === index && (
                  <motion.span
                    className="book-tab-active"
                    layoutId="current-poem"
                    transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <span className="book-page-label" aria-hidden="true">
            sida{" "}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={poem.page}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -5 }}
                transition={{ duration: reducedMotion ? 0 : 0.25 }}
              >
                {poem.page}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <motion.button
          className="book-direction book-next"
          type="button"
          disabled={index === poems.length - 1}
          aria-disabled={busy || index === poems.length - 1}
          aria-label="Nästa dikt"
          onClick={() => goTo(index + 1)}
          whileHover={reducedMotion ? undefined : { x: 3 }}
          whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        >
          <span>nästa sida</span>
          <ArrowIcon direction="right" />
        </motion.button>
      </div>
      <p className="book-gesture-hint" aria-hidden="true">
        <span className="book-desktop-hint">vänd ett hörn, stanna en stund</span>
        <span className="book-mobile-hint">svep för att bläddra</span>
      </p>
    </div>
  );
}
