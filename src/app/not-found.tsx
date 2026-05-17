import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Página não encontrada — SMZ",
    description: "A rota acessada não existe ou foi movida dentro do site da SMZ.",
    canonical: "https://ag.smz/404",
  });
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="error-main">
        <div className="error-bg" aria-hidden="true" />
        <div className="container error-wrap">
          <div>
            <p className="error-glyph" aria-hidden="true">
              4<span className="zero">0</span>4
            </p>
            <p
              style={{
                fontFamily: "var(--ff-mono)",
                fontSize: "11.5px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginTop: 12,
              }}
            >
              ERROR · ROTA NÃO ENCONTRADA · HTTP/404
            </p>
          </div>

          <div className="error-side">
            <p className="small-eyebrow">
              <span className="status-code">404</span> Status
            </p>
            <h1>
              Esta página <em>fugiu</em>
              <br />
              do nosso <span className="accent">funil.</span>
            </h1>
            <p className="lede">
              O link que você seguiu não existe, foi movido ou nunca rodou nas nossas
              campanhas.
            </p>

            <div className="error-cta-row">
              <Link href="/" className="btn btn-primary">
                Voltar para o início
                <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Falar com um estrategista
              </a>
            </div>

            <form className="error-search" role="search" action="/busca">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="search" name="q" placeholder="Tente buscar pelo que veio procurar..." aria-label="Buscar no site" />
              <button type="submit">Buscar</button>
            </form>

            <nav className="error-suggestions" aria-label="Sugestões">
              <p className="suggest-label">Atalhos populares</p>
              <ul>
                <li>
                  <Link href="/#servicos">
                    <span>
                      <span className="num">01</span> Conhecer os serviços da SMZ
                    </span>
                    <span className="arrow">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <span>
                      <span className="num">02</span> Ler artigos do blog
                    </span>
                    <span className="arrow">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/#contato">
                    <span>
                      <span className="num">03</span> Agendar diagnóstico gratuito
                    </span>
                    <span className="arrow">→</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
