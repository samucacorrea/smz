import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type NewsletterCtaProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  formTitle?: string;
};

export function NewsletterCta({
  description,
  eyebrow = "Newsletter quinzenal",
  formTitle = "Receber a newsletter",
  title,
}: NewsletterCtaProps) {
  return (
    <Section className="newsletter" aria-label="Newsletter">
      <Container>
        <div className="newsletter-grid">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 style={{ marginTop: 22 }}>{title}</h2>
            <p>{description}</p>
          </div>

          <form className="form-card" style={{ background: "var(--bg)" }}>
            <div className="field">
              <label htmlFor="newsletter-name">Nome</label>
              <input
                id="newsletter-name"
                type="text"
                placeholder="Como te chamamos?"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="newsletter-email">E-mail profissional</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="voce@empresa.com"
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="newsletter-submit"
            >
              {formTitle}
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
            </Button>
            <p className="newsletter-foot">
              Sem spam, sem listas de terceiros. So conteudo do time da SMZ.
            </p>
          </form>
        </div>
      </Container>
    </Section>
  );
}
