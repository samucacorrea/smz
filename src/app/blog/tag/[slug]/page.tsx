import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { NewsletterCta } from "@/components/blog/NewsletterCta";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbListSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { getBlogTagData } from "@/lib/wp-tag";
import { formatDateLabel } from "@/utils/format";

export const dynamic = "force-dynamic";

type TagPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogTagData(slug);

  if (!data) {
    notFound();
  }

  return buildPageMetadata(data.tag.seo);
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const data = await getBlogTagData(slug);

  if (!data) {
    notFound();
  }
  const { tag, posts, relatedTags, authorCount } = data;

  return (
    <MainLayout>
      <main>
        <JsonLd
          data={buildBreadcrumbListSchema([
            { name: "Início", url: getHomeSeo().canonical },
            { name: "Blog", url: getBlogSeo().canonical },
            { name: "Tags" },
            { name: tag.name, url: tag.seo.canonical },
          ])}
        />
        <JsonLd
          data={buildCollectionPageSchema({
            seo: tag.seo,
            name: `Tag ${tag.name}`,
            description: tag.description,
          })}
        />
        <JsonLd
          data={buildWebPageSchema({
            seo: tag.seo,
            name: `Tag ${tag.name}`,
            description: tag.description,
            type: "CollectionPage",
          })}
        />
        <JsonLd
          data={buildItemListSchema({
            id: `${tag.seo.canonical}#post-list`,
            name: `Artigos com a tag ${tag.name}`,
            items: posts.map((post) => ({
              name: post.title,
              url: buildSiteUrl(`/blog/${post.slug}`),
            })),
          })}
        />
        <section className="tag-hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container" style={{ position: "relative" }}>
            <Breadcrumbs
              items={[
                { href: "/", label: "Início" },
                { href: "/blog", label: "Blog" },
                { label: "Tags" },
                { label: tag.name },
              ]}
            />

            <span className="tag-chip-big">
              <span className="hash">#</span> Tag · {posts.length} artigos
            </span>

            <div className="tag-hero-grid">
              <h1>
                <span className="hash">#</span>
                {tag.name}
              </h1>

              <div className="tag-definition">
                <span className="def-label">O que é essa tag</span>
                <p className="def-body">{tag.description}</p>
                <div className="def-foot">
                  <span>Tag · micro-assunto</span>
                </div>
              </div>
            </div>

            <div className="tag-meta-strip">
              <span>
                <strong>{posts.length}</strong> artigos com esta tag
              </span>
              <span>
                <strong>{authorCount}</strong> autores
              </span>
            </div>
          </div>
        </section>

        <nav className="tag-cluster" aria-label={`Tags relacionadas a ${tag.name}`}>
          <div className="container">
            <div className="tag-cluster-content">
              <span className="cluster-label">Costumam aparecer juntas</span>
              <div className="tag-list">
                <Link href={`/blog/tag/${tag.slug}`} className="tag-link active">
                  <span className="hash">#</span>
                  {tag.name} <span className="count">· {tag.articleCount}</span>
                </Link>
                {relatedTags.map((item) => (
                  <Link key={item.slug} href={`/blog/tag/${item.slug}`} className="tag-link">
                    <span className="hash">#</span>
                    {item.name} <span className="count">· {item.articleCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <section className="tag-posts" id="posts">
          <div className="container">
            <div className="head-row">
              <h2>
                Artigos com <span className="hash">#</span>
                {tag.name}
              </h2>
              <span className="small">{posts.length} artigos · ordenados por mais recente</span>
            </div>

            <div className="tag-grid">
              {posts.map((post) => {
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="tag-card">
                    <div className="tc-meta">
                      <span className="cat-pill">{post.categoryName}</span>
                      <time dateTime={post.date}>{formatDateLabel(post.date)}</time>
                      <span>· {post.readingTime} · {post.authorName}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className="tc-excerpt">{post.excerpt}</p>
                    <div className="tc-tags">
                      {post.tags.map((item) => {
                        return (
                          <span
                            key={item.slug}
                            className={[
                              "tc-mini-tag",
                              item.slug === tag.slug ? "this" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <span className="hash">#</span>
                            {item.name}
                          </span>
                        );
                      })}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <NewsletterCta
          title={
            <>
              Nao perca o próximo texto
              <br />
              sobre <em>{tag.name}</em>
              <br />
              <span className="accent">na prática.</span>
            </>
          }
          description="Leituras práticas sobre mídia, aquisição e operação, sem ruído."
        />
      </main>
    </MainLayout>
  );
}
