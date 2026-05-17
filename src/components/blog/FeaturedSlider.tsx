"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type FeaturedSlide = {
  id: string;
  href: string;
  tag: string;
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  actionLabel: string;
  artTag: string;
  artwork: ReactNode;
};

type FeaturedSliderProps = {
  items: FeaturedSlide[];
};

const AUTOPLAY_MS = 5000;

export function FeaturedSlider({ items }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    startAutoplay();

    return () => stopAutoplay();
  }, [currentIndex, items.length]);

  function startAutoplay() {
    stopAutoplay();

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % items.length);
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function goTo(index: number) {
    setCurrentIndex(index);
  }

  function goNext() {
    setCurrentIndex((current) => (current + 1) % items.length);
  }

  function goPrevious() {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      goNext();
      startAutoplay();
    }

    if (event.key === "ArrowLeft") {
      goPrevious();
      startAutoplay();
    }
  }

  return (
    <div
      className="slider"
      aria-label="Posts em destaque"
      aria-roledescription="carrossel"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="slider-progress"
        style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
      />

      <div className="slider-viewport">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <article
              key={item.id}
              className="slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${items.length}`}
            >
              <div className="slide-art">
                <span className="art-tag">{item.artTag}</span>
                {item.artwork}
              </div>
              <div className="slide-body">
                <div className="slide-meta">
                  <span className="tag-pill">{item.tag}</span>
                  <time dateTime={item.date}>{item.date}</time>
                  <span>· {item.readingTime}</span>
                </div>
                <h2 className="slide-title">
                  <Link href={item.href}>{item.title}</Link>
                </h2>
                <p className="slide-excerpt">{item.excerpt}</p>
                <div className="slide-foot">
                  <div className="author-mini">
                    <div className="avatar">{item.authorInitials}</div>
                    <div>
                      <div className="name">{item.authorName}</div>
                      <div className="role">{item.authorRole}</div>
                    </div>
                  </div>
                  <Link href={item.href} className="btn btn-primary btn-sm">
                    {item.actionLabel}
                    <svg
                      className="arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="slider-dots" role="tablist" aria-label="Selecionar slide">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={index === currentIndex ? "active" : undefined}
            aria-label={`Ir para slide ${index + 1}`}
            aria-selected={index === currentIndex}
            role="tab"
            type="button"
            onClick={() => {
              goTo(index);
              startAutoplay();
            }}
          />
        ))}
      </div>

      <div className="slider-controls">
        <div className="slider-counter">
          <span className="cur">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span>/ {String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="slider-arrows">
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => {
              goPrevious();
              startAutoplay();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={() => {
              goNext();
              startAutoplay();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
