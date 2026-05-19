import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LeadCtaButton } from "@/components/lead/LeadCtaButton";
import type { ServicePageData } from "@/lib/services";

type ServicePageProps = {
  service: ServicePageData;
};

export function ServicePage({ service }: ServicePageProps) {
  return (
    <MainLayout>
      <main>
        <section className="pillar-hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container" style={{ position: "relative" }}>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Início</Link>
              <span className="sep">/</span>
              <Link href="/servicos">Serviços</Link>
              <span className="sep">/</span>
              <span className="current">{service.navLabel}</span>
            </nav>

            <div className="pillar-hero-grid">
              <div>
                <span className="pillar-eyebrow">{service.heroEyebrow}</span>
                <h1 dangerouslySetInnerHTML={{ __html: service.heroTitleHtml }} />
                <p
                  className="pillar-promise"
                  dangerouslySetInnerHTML={{ __html: service.heroPromiseHtml }}
                />

                <div className="pillar-cta-row">
                  <LeadCtaButton
                    className="btn btn-primary"
                    source={`service_${service.slug}_hero_primary`}
                  >
                    Solicitar diagnóstico gratuito
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
                  <a href="#processo" className="btn btn-ghost">
                    Como trabalhamos
                  </a>
                </div>

                <div className="pillar-trust-row">
                  {service.trustItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <aside className="pillar-side" aria-label="Indicadores">
                {service.kpis.map((kpi) => (
                  <div key={kpi.label} className="pillar-kpi">
                    <p className="kpi-label">{kpi.label}</p>
                    <p className="kpi-num">{kpi.value}</p>
                    <p className="kpi-foot">{kpi.footnote}</p>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </section>

        <section className="pillar-explain" id="o-que-e">
          <div className="container">
            <div className="section-label">
              <span className="num">02 /</span> Explicação
            </div>

            <div className="pillar-explain-grid">
              <h2 dangerouslySetInnerHTML={{ __html: service.explainTitleHtml }} />
              <div className="explain-body">
                {service.explainBodyHtml.map((paragraph) => (
                  <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </div>

            <div className="explain-bullets">
              {service.bullets.map((bullet) => (
                <div key={bullet.title} className="bullet">
                  <p className="b-label">{bullet.label}</p>
                  <h3 className="b-title">{bullet.title}</h3>
                  <p className="b-desc">{bullet.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pillar-subservices" id="servicos">
          <div className="container">
            <div className="section-label">
              <span className="num">03 /</span> O que entregamos
            </div>
            <div className="section-head">
              <h2>
                O escopo do serviço
                <br />
                em blocos <span style={{ color: "var(--green)" }}>operacionais.</span>
              </h2>
              <p className="head-right">
                Cada frente abaixo representa um pacote operacional que a SMZ executa ou
                coordena dentro deste serviço.
              </p>
            </div>

            <div className="pillar-subservices-grid">
              {service.subservices.map((item) => (
                <article key={item.idx} className="sub-service">
                  <span className="ss-idx">{item.idx}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="ss-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="ss-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pillar-process" id="processo">
          <div className="container">
            <div className="section-label">
              <span className="num">04 /</span> Processo
            </div>
            <div className="section-head">
              <h2>
                Como a SMZ conduz
                <br />
                este serviço <em>na prática.</em>
              </h2>
              <p className="head-right">
                Processo claro, leitura frequente de dados e revisão contínua de priorização.
              </p>
            </div>

            <div className="process-timeline">
              {service.process.map((step) => (
                <div key={step.num + step.title} className="pt-step">
                  <p className="pt-num">{step.num}</p>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {service.proof.quoteHtml ? (
          <section className="pillar-proof" id="prova">
            <div className="container">
              <div className="section-label">
                <span className="num">05 /</span> Prova
              </div>
              <div className="section-head">
                <h2>
                  Números antes e depois,
                  <br />
                  de <em>contas reais</em> que gerenciamos.
                </h2>
                <p className="head-right">
                  Um recorte de resultado para ilustrar o impacto típico desse serviço em
                  contas da carteira SMZ.
                </p>
              </div>

              <div className="proof-card">
                <div className="proof-art">
                  <span className="proof-tag">{service.proof.tag}</span>
                  <div className="service-proof-art">
                    <span>{service.navLabel}</span>
                  </div>
                </div>
                <div className="proof-body">
                  <blockquote
                    className="case-quote"
                    dangerouslySetInnerHTML={{ __html: service.proof.quoteHtml }}
                  />
                  <div className="proof-numbers">
                    {service.proof.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="pn-num">{metric.value}</p>
                        <p className="pn-label">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="proof-author">
                    <div className="avatar">{service.proof.initials}</div>
                    <div>
                      <div className="pa-name">{service.proof.authorName}</div>
                      <div className="pa-role">{service.proof.authorRole}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="pillar-faq" id="faq">
          <div className="container">
            <div className="section-label">
              <span className="num">06 /</span> Perguntas frequentes
            </div>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h2>
                As dúvidas que sempre
                <br />
                <em>chegam antes</em> da proposta.
              </h2>
              <p className="head-right">
                Reunimos as perguntas mais comuns deste serviço para reduzir ruído já na
                primeira conversa.
              </p>
            </div>

            <div className="faq-grid">
              <aside className="faq-aside">
                {service.faqAside.map((paragraph) => (
                  <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
                <div className="faq-help">
                  <div className="helper-row">
                    <LeadCtaButton
                      className="btn btn-primary btn-sm"
                      source={`service_${service.slug}_faq`}
                    >
                      Tirar dúvida com a SMZ
                    </LeadCtaButton>
                  </div>
                </div>
              </aside>

              <div className="faq-list">
                {service.faq.map((item, index) => (
                  <details key={item.question} className="faq-item" open={index === 0}>
                    <summary className="faq-q">
                      <span>
                        <span className="q-marker">{`Q/${String(index + 1).padStart(2, "0")}`}</span>
                        {item.question}
                      </span>
                      <span className="q-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <div
                      className="faq-a"
                      dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                    />
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pillar-final-cta" id="contato">
          <div className="container">
            <div className="fcta-grid">
              <div>
                <h2 dangerouslySetInnerHTML={{ __html: service.finalCtaTitleHtml }} />
                <p>{service.finalCtaDescription}</p>
                <div style={{ marginTop: 32 }}>
                  <LeadCtaButton
                    className="btn btn-dark"
                    source={`service_${service.slug}_final_primary`}
                  >
                    Solicitar diagnóstico
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
                </div>
              </div>

              <div className="fcta-cards">
                {service.finalCards.map((card) => (
                  <button
                    key={card.title}
                    type="button"
                    className="fcta-mini service-fcta-button"
                  >
                    <span className="fc-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
                      </svg>
                    </span>
                    <div>
                      <div className="fc-title">{card.title}</div>
                      <div className="fc-sub">{card.subtitle}</div>
                    </div>
                    <span className="fc-arrow">
                      <svg
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
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pillar-related">
          <div className="container">
            <div className="head-row">
              <h2>
                Serviços que <em>andam juntos</em> com {service.navLabel}.
              </h2>
            </div>

            <div className="related-services-grid">
              {service.related.map((item) => (
                <Link key={item.slug} href={`/servicos/${item.slug}`} className="rs-card">
                  <div>
                    <p className="rs-name">{item.name}</p>
                    <p className="rs-tag">{item.tag}</p>
                  </div>
                  <span className="rs-arrow">
                    <svg
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
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
