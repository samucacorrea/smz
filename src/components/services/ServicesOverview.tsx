import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import type { ServicePageData } from "@/lib/services";

type ServicesOverviewProps = {
  services: ServicePageData[];
};

export function ServicesOverview({ services }: ServicesOverviewProps) {
  return (
    <MainLayout>
      <main>
        <section className="pillar-hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container" style={{ position: "relative" }}>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Início</Link>
              <span className="sep">/</span>
              <span className="current">Serviços</span>
            </nav>

            <div className="pillar-hero-grid">
              <div>
                <span className="pillar-eyebrow">SERVIÇOS SMZ</span>
                <h1>
                  Serviços pensados como
                  <br />
                  <span className="accent">alavancas de aquisição.</span>
                </h1>
                <p className="pillar-promise">
                  Estratégia, mídia, orgânico, social, páginas, CRM e direção executiva
                  conectados ao mesmo objetivo: gerar demanda e receita com previsibilidade.
                </p>
              </div>

              <aside className="pillar-side" aria-label="Resumo">
                <div className="pillar-kpi">
                  <p className="kpi-label">Frentes ativas</p>
                  <p className="kpi-num">{services.length}</p>
                  <p className="kpi-foot">
                    Serviços estruturados para marketing orientado por resultado.
                  </p>
                </div>
                <div className="pillar-kpi">
                  <p className="kpi-label">Modelo operacional</p>
                  <p className="kpi-num">R/4</p>
                  <p className="kpi-foot">
                    Diagnóstico, estratégia, execução e otimização contínua.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="pillar-subservices">
          <div className="container">
            <div className="section-label">
              <span className="num">01 /</span> Portfólio
            </div>
            <div className="section-head">
              <h2>
                Cada serviço cobre
                <br />
                uma parte crítica <span style={{ color: "var(--green)" }}>do funil.</span>
              </h2>
            </div>

            <div className="services-overview-grid">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicos/${service.slug}`}
                  className="services-overview-card"
                >
                  <p className="services-overview-type">{service.serviceType}</p>
                  <h3>{service.navLabel}</h3>
                  <p>{service.description}</p>
                  <span className="services-overview-link">
                    Ver página do serviço <span className="arrow">→</span>
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
