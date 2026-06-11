import type { ReactNode } from "react";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";
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

          <div className="form-card" style={{ background: "var(--bg)" }}>
            <div className="field">
              <label>O que você recebe</label>
              <input type="text" value="Leituras práticas, sem ruído e sem spam" readOnly />
            </div>
            <div className="field">
              <label>Como funciona</label>
              <input type="text" value="Você deixa seus dados e o time envia os próximos conteúdos por esse canal" readOnly />
            </div>
            <LeadCtaButton className="btn btn-primary newsletter-submit" source="newsletter_cta">
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
            </LeadCtaButton>
            <p className="newsletter-foot">
              Sem spam, sem listas de terceiros. So conteudo do time da SMZ.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
