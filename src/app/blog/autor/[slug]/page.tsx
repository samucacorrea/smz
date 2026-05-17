import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { NewsletterCta } from "@/components/blog/NewsletterCta";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema, buildCollectionPageSchema, buildPersonSchema } from "@/lib/seo/schema";
import { PostArtwork } from "@/components/blog/PostArtwork";
import { mockContent } from "@/lib/mock-data";
import { getBlogAuthorData, getBlogAuthorStaticParams } from "@/lib/wp-author";
import { formatDateLabel } from "@/utils/format";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getBlogAuthorStaticParams();
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogAuthorData(slug);

  if (!data) {
    notFound();
  }

  return buildPageMetadata(data.author.seo, { type: "profile" });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const data = await getBlogAuthorData(slug);

  if (!data) {
    notFound();
  }
  const { author, posts, schemaAuthor } = data;

  return (
    <MainLayout>
      <main>
        <JsonLd
          data={buildBreadcrumbListSchema([
            { name: "Início", url: mockContent.home.seo.canonical },
            { name: "Blog", url: mockContent.seo.blog.canonical },
            { name: "Autores" },
            { name: author.name, url: author.seo.canonical },
          ])}
        />
        <JsonLd data={buildPersonSchema(schemaAuthor)} />
        <JsonLd
          data={buildCollectionPageSchema({
            seo: author.seo,
            name: `Artigos de ${author.name}`,
            description: author.shortBio,
          })}
        />
        <section className="author-hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container" style={{ position: "relative" }}>
            <Breadcrumbs
              items={[
                { href: "/", label: "Início" },
                { href: "/blog", label: "Blog" },
                { label: "Autores" },
                { label: author.name },
              ]}
            />

            <div className="author-hero-grid">
              <div className="author-portrait" role="img" aria-label={author.name}>
                <span className="accent-corner" aria-hidden="true" />
                <span className="initials">{author.initials}</span>
                <span className="status-dot">Escrevendo</span>
              </div>

              <div className="author-info">
                <span className="role-label">Autora · {author.role}</span>
                <h1 className="author-name">
                  {author.name.split(" ")[0]} <span className="accent">{author.name.split(" ").slice(1).join(" ")}.</span>
                </h1>
                <p className="author-role">{author.shortBio}</p>

                <div className="author-bio-long">
                  {author.longBio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="author-expertise">
                  <span className="label">Escreve sobre</span>
                  {author.expertise.map((item) => (
                    <span key={item} className="chip-exp">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="author-actions">
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Falar direto com {author.name.split(" ")[0]}
                    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                  {author.socials.map((social) => (
                    <a key={social.href} href={social.href} className="social-btn" aria-label={social.label}>
                      {social.label[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="author-stats">
              {author.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="stat-tag">{stat.label}</p>
                  <p className="stat-num">
                    {stat.value}
                    <span className="unit" />
                  </p>
                  <p className="stat-foot">{stat.footnote}</p>
                </div>
              ))}
            </div>

            {author.quote ? (
              <aside className="author-pinned-quote" aria-label="Frase em destaque">
                <blockquote>{author.quote.text}</blockquote>
                <p className="quote-attr">— {author.quote.attribution}</p>
              </aside>
            ) : null}
          </div>
        </section>

        <section className="author-articles" id="articles">
          <div className="container">
            <div className="head-row">
              <h2>
                Artigos de {author.name.split(" ")[0]} <span className="accent">·</span>
              </h2>
              <span className="head-foot">{posts.length} textos · ordenados por mais recente</span>
            </div>

            <div className="cat-list" id="authorList">
              {posts.map((post) => {
                return (
                  <article key={post.slug} className="cat-row">
                    <div className="row-thumb">
                      <PostArtwork artKey={post.featuredArtKey} label={post.categoryName} />
                    </div>
                    <div className="row-content">
                      <div className="row-meta">
                        <span className="tag-pill">{post.categoryName}</span>
                        <time dateTime={post.date}>{formatDateLabel(post.date)}</time>
                        <span>· {post.readingTime}</span>
                      </div>
                      <h3>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="row-excerpt">{post.excerpt}</p>
                    </div>
                    <div className="row-meta-side">
                      <div>POPULAR</div>
                      <Link href={`/blog/${post.slug}`} className="arrow" aria-label="Ler artigo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <NewsletterCta
          title={
            <>
              Receba as próximas ideias
              <br />
              de <em>{author.name.split(" ")[0]}</em>
              <br />
              <span className="accent">no seu e-mail.</span>
            </>
          }
          description="Um e-mail enxuto com leituras práticas sobre operação, aquisição e crescimento."
        />
      </main>
    </MainLayout>
  );
}
