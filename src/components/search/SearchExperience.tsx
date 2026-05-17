"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { SearchResult, SearchResultType } from "@/types/content";

type SearchTab = "all" | SearchResultType;

type SearchExperienceProps = {
  initialQuery: string;
  results: SearchResult[];
};

const SEARCH_TABS: Array<{
  key: SearchTab;
  label: string;
}> = [
  { key: "all", label: "Todos" },
  { key: "post", label: "Artigos" },
  { key: "case", label: "Cases" },
  { key: "servico", label: "Serviços" },
  { key: "categoria", label: "Categorias" },
];

const POPULAR_SEARCHES = ["IA", "ROAS", "SEO", "CRM"];

const RESULT_TYPE_LABEL: Record<SearchResultType, string> = {
  post: "Artigo",
  case: "Case",
  servico: "Serviço",
  categoria: "Categoria",
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function buildSearchIndex(result: SearchResult) {
  return normalizeText(
    [
      result.title,
      result.snippet,
      result.type,
      result.breadcrumb.join(" "),
      result.meta.join(" "),
    ].join(" "),
  );
}

export function SearchExperience({
  initialQuery,
  results,
}: SearchExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);

  const queryFilteredResults = useMemo(() => {
    if (!normalizedQuery) {
      return results;
    }

    return results.filter((result) => buildSearchIndex(result).includes(normalizedQuery));
  }, [normalizedQuery, results]);

  const counts = useMemo(
    () => ({
      all: queryFilteredResults.length,
      post: queryFilteredResults.filter((result) => result.type === "post").length,
      case: queryFilteredResults.filter((result) => result.type === "case").length,
      servico: queryFilteredResults.filter((result) => result.type === "servico").length,
      categoria: queryFilteredResults.filter((result) => result.type === "categoria").length,
    }),
    [queryFilteredResults],
  );

  const visibleResults = useMemo(() => {
    if (activeTab === "all") {
      return queryFilteredResults;
    }

    return queryFilteredResults.filter((result) => result.type === activeTab);
  }, [activeTab, queryFilteredResults]);

  function syncUrl(nextQuery: string) {
    const params = new URLSearchParams();
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    syncUrl(query);
  }

  function handleClear() {
    setQuery("");
    setActiveTab("all");
    syncUrl("");
  }

  function applyPopularSearch(term: string) {
    setQuery(term);
    setActiveTab("all");
    syncUrl(term);
  }

  return (
    <>
      <section className="search-hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container" style={{ position: "relative" }}>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Início</Link>
            <span className="sep">/</span>
            <span className="current">Busca</span>
          </nav>

          <span className="search-eyebrow">Resultados para a sua busca</span>
          <h1>
            Você procurou por
            <br />
            <em>algo sobre</em>{" "}
            <span className="query-term">{query.trim() || "marketing"}</span>.
          </h1>

          <form className="search-big" role="search" onSubmit={handleSubmit}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="Buscar artigos, cases, serviços..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
                aria-label="Limpar busca"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            ) : null}
            <button type="submit" className="submit-btn">
              Buscar
            </button>
          </form>

          <div className="search-summary">
            <span className="count-big">
              <span className="accent">{visibleResults.length}</span> resultados encontrados
            </span>
            <span>
              {activeTab === "all"
                ? "Ordenado por relevância"
                : `Filtrado em ${SEARCH_TABS.find((tab) => tab.key === activeTab)?.label}`}
            </span>
          </div>

          <div className="search-tabs" role="tablist" aria-label="Filtrar resultados">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.key}
                className={["search-tab", activeTab === tab.key ? "active" : ""]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}{" "}
                <span className="count">
                  {tab.key === "all" ? counts.all : counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="results-list">
        <div className="container">
          <div className="search-grid">
            <div>
              <div id="resultsContainer">
                {visibleResults.map((result) => (
                  <article key={result.id} className="result-item" data-type={result.type}>
                    <div className="result-type">
                      <span
                        className={[
                          "badge",
                          result.type === "case" ? "type-case" : "",
                          result.type === "servico" ? "type-servico" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {RESULT_TYPE_LABEL[result.type]}
                      </span>
                    </div>
                    <div className="result-content">
                      <div className="result-breadcrumb">
                        {result.breadcrumb.map((item, index) => (
                          <span key={`${item}-${index}`}>
                            {item}
                            {index < result.breadcrumb.length - 1 ? (
                              <span className="sep">/</span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                      <h3 className="result-title">
                        <Link href={result.href}>{result.title}</Link>
                      </h3>
                      <p className="result-snippet">{result.snippet}</p>
                      <div className="result-meta">
                        {result.meta.map((item, index) => (
                          <span key={`${item}-${index}`}>
                            {item}
                            {index < result.meta.length - 1 ? (
                              <span className="meta-sep">·</span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href={result.href} className="result-arrow" aria-label="Abrir resultado">
                      <svg
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
                  </article>
                ))}
              </div>

              {!visibleResults.length ? (
                <div className="search-empty">
                  <p className="empty-glyph" aria-hidden="true">
                    0<span className="accent">.</span>
                  </p>
                  <h2>Nenhum resultado encontrado.</h2>
                  <p>Tente buscar por outro assunto, categoria ou serviço.</p>
                  <div className="suggest-row">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => applyPopularSearch(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="search-aside" aria-label="Sugestões">
              <div className="aside-card">
                <p className="label">Buscas populares</p>
                <div className="aside-tag-cloud">
                  {POPULAR_SEARCHES.map((term) => (
                    <button key={term} type="button" onClick={() => applyPopularSearch(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
