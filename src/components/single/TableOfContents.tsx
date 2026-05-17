"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TableOfContentsItem = {
  href: string;
  label: string;
};

type TableOfContentsProps = {
  items: TableOfContentsItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href);

  useEffect(() => {
    const sections = items
      .map((item) => {
        const id = item.href.replace("#", "");
        return document.getElementById(id);
      })
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY + 160;
      let currentHref = items[0]?.href;

      sections.forEach((section, index) => {
        if (section.offsetTop <= scrollY) {
          currentHref = items[index]?.href;
        }
      });

      setActiveHref(currentHref);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="Sumário do artigo">
      <p className="toc-title">Neste artigo</p>
      <ol>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={item.href === activeHref ? "active" : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
