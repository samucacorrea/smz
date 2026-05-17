import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterCta } from "@/components/blog/NewsletterCta";
import { PostArtwork } from "@/components/blog/PostArtwork";
import { PostCard } from "@/components/blog/PostCard";
import { PostGrid } from "@/components/blog/PostGrid";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePageData } from "@/lib/wp-home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/schema";
import { formatDateLabel } from "@/utils/format";
import { mockContent } from "@/lib/mock-data";

export function generateMetadata(): Metadata {
  return buildPageMetadata(mockContent.home.seo);
}

export default async function HomePage() {
  const data = await getHomePageData();
  const { featuredPosts, home, stats } = data;

  return (
    <MainLayout>
      <main>
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebSiteSchema()} />
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">SMZ · Headless WordPress</span>
              <h1 className="hero-headline">
                Marketing focado em
                <br />
                <span className="accent">resultado.</span>
              </h1>
              <p className="hero-sub">{home.heroSubtitle}</p>
              <div className="hero-cta-row">
                <a href={home.heroButtonUrl} className="btn btn-primary">
                  {home.heroButtonText}
                </a>
                <Link href="/blog" className="btn btn-ghost">
                  Ler o blog
                </Link>
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-stat-card">
                <p className="stat-label">Artigos publicados</p>
                <p className="stat-value">
                  {stats.postCount}
                  <span className="stat-suffix">.</span>
                </p>
                <p className="stat-foot">
                  Conteúdo sobre tráfego, SEO, IA, CRM, CRO e operação em{" "}
                  {stats.categoryCount} frentes editoriais.
                </p>
              </div>
              <div className="hero-chip-row">
                {home.services.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="listing" id="blog">
          <div className="container">
            <div className="head-row">
              <h2>Últimas leituras do blog.</h2>
              <Link href="/blog" className="inline-link">
                Ver todos <span className="arrow">→</span>
              </Link>
            </div>

            <PostGrid>
              {featuredPosts.map((post) => {
                return (
                  <PostCard
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    category={post.categoryName}
                    categoryKey={post.categorySlug}
                    date={formatDateLabel(post.date)}
                    dateTime={post.date}
                    readingTime={post.readingTime}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={post.authorName}
                    cover={<PostArtwork artKey={post.featuredArtKey} label={post.categoryName} />}
                    readMoreLabel={post.slug.includes("case") ? "Ler case" : "Ler artigo"}
                  />
                );
              })}
            </PostGrid>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="head-row">
              <h2>Perguntas frequentes.</h2>
            </div>
            <div className="services-grid">
              {home.faq.map((item) => (
                <article key={item.question} className="service-card">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <NewsletterCta
          title={
            <>
              O que a gente aprende
              <br />
              <em>operando, não opinando.</em>
              <br />
              <span className="accent">Direto na sua caixa.</span>
            </>
          }
          description={home.finalCtaText}
          formTitle={home.finalCtaButtonText}
        />
      </main>
    </MainLayout>
  );
}
