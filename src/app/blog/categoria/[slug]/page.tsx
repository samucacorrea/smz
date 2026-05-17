import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { NewsletterCta } from "@/components/blog/NewsletterCta";
import { Pagination } from "@/components/blog/Pagination";
import { PostArtwork } from "@/components/blog/PostArtwork";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema, buildCollectionPageSchema } from "@/lib/seo/schema";
import { mockContent } from "@/lib/mock-data";
import { getBlogCategoryData, getBlogCategoryStaticParams } from "@/lib/wp-category";
import { formatDateLabel } from "@/utils/format";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getBlogCategoryStaticParams();
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogCategoryData(slug);

  if (!data) {
    notFound();
  }

  return buildPageMetadata(data.category.seo);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getBlogCategoryData(slug);

  if (!data) {
    notFound();
  }
  const { category, posts, categories, authorCount } = data;

  return (
    <MainLayout>
      <main>
        <JsonLd
          data={buildBreadcrumbListSchema([
            { name: "Início", url: mockContent.home.seo.canonical },
            { name: "Blog", url: mockContent.seo.blog.canonical },
            { name: category.name, url: category.seo.canonical },
          ])}
        />
        <JsonLd
          data={buildCollectionPageSchema({
            seo: category.seo,
            name: `Categoria ${category.name}`,
            description: category.description,
          })}
        />
        <section className="cat-hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container" style={{ position: "relative" }}>
            <Breadcrumbs
              items={[
                { href: "/", label: "Início" },
                { href: "/blog", label: "Blog" },
                { label: category.name },
              ]}
            />

            <div className="cat-headline-row">
              <div>
                <span className="cat-tag-big">Categoria · {category.name}</span>
                <h1>
                  {category.name} aplicada ao
                  <br />
                  <em>marketing de</em> <span className="accent">verdade.</span>
                </h1>
              </div>

              <p className="cat-desc">{category.description}</p>
            </div>

            <div className="cat-meta">
              <span>
                <strong>{posts.length}</strong> artigos
              </span>
              <span>
                <strong>{authorCount}</strong> autores
              </span>
              <span>
                Tempo médio · <strong>7 min</strong>
              </span>
            </div>
          </div>
        </section>

        <nav className="cat-nav-strip" aria-label="Outras categorias">
          <div className="container">
            <ul className="cat-nav-list">
              <li>
                <Link href="/blog">Todos</Link>
              </li>
              {categories.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/categoria/${item.slug}`}
                    className={item.slug === category.slug ? "active" : undefined}
                    aria-current={item.slug === category.slug ? "page" : undefined}
                  >
                    {item.name} <span className="count">· {item.articleCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <section className="listing" id="listing">
          <div className="container">
            <div className="cat-toolbar">
              <h3>
                Todos os artigos da categoria <span style={{ color: "var(--green)" }}>·</span>{" "}
                {category.name}
              </h3>
              <div className="toolbar-right">
                <span className="small">{posts.length} resultados</span>
              </div>
            </div>

            <div className="cat-list" id="catList">
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
                      <div>{post.authorInitials}</div>
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

            <Pagination
              summary={`Mostrando 1–${posts.length} de ${posts.length} artigos`}
              pages={[{ label: "1", href: `/blog/categoria/${category.slug}`, isCurrent: true }]}
            />
          </div>
        </section>

        <NewsletterCta
          title={
            <>
              Não perca o próximo
              <br />
              texto sobre <em>{category.name}</em>
              <br />
              <span className="accent">na prática.</span>
            </>
          }
          description="Um e-mail a cada duas semanas, com análises honestas, movimentos de mercado e nenhum ruído."
        />
      </main>
    </MainLayout>
  );
}
