import Link from "next/link";
import type { ReactNode } from "react";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";

type ArticleBodyProps = {
  children: ReactNode;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
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

export function ArticleBody({ children, cta, faq, tags }: ArticleBodyProps) {
  return (
    <div className="prose">
      {children}

      {faq?.length ? (
        <section className="article-faq" aria-label="Perguntas frequentes">
          <h2>Perguntas frequentes</h2>
          <div className="faq-list">
            {faq.map((item, index) => (
              <details key={item.question} className="faq-item" open={index === 0}>
                <summary className="faq-q">
                  <span className="q-num">Q/{String(index + 1).padStart(2, "0")}</span>
                  <span className="q-text">{item.question}</span>
                  <span className="q-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="faq-a">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

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
          <LeadCtaButton className="btn btn-dark" source="single_article_cta">
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
          </LeadCtaButton>
        </aside>
      ) : null}
    </div>
  );
}
