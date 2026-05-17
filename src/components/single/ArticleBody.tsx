import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";

type ArticleBodyProps = {
  children: ReactNode;
  tags?: Array<{
    href: string;
    label: string;
  }>;
  cta?: {
    title: string;
    description: string;
    href: string;
    label: string;
  };
};

export function ArticleBody({ children, cta, tags }: ArticleBodyProps) {
  return (
    <div className="prose">
      {children}

      {tags?.length ? (
        <div className="article-tags" aria-label="Tags">
          <span className="label">Tags</span>
          {tags.map((tag) => (
            <Link key={tag.href} href={tag.href} rel="tag">
              {tag.label}
            </Link>
          ))}
        </div>
      ) : null}

      {cta ? (
        <aside className="post-cta" aria-label="Chamada para ação">
          <div>
            <h3>{cta.title}</h3>
            <p>{cta.description}</p>
          </div>
          <ButtonLink href={cta.href} variant="dark">
            {cta.label}
            <svg
              className="arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </ButtonLink>
        </aside>
      ) : null}
    </div>
  );
}
