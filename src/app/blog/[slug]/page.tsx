import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostMedia } from "@/components/blog/PostMedia";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleBody } from "@/components/single/ArticleBody";
import { ArticleHeader } from "@/components/single/ArticleHeader";
import { AuthorBio } from "@/components/single/AuthorBio";
import { RelatedPosts } from "@/components/single/RelatedPosts";
import { ShareBar } from "@/components/single/ShareBar";
import { TableOfContents } from "@/components/single/TableOfContents";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildPersonSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { getBlogSingleData } from "@/lib/wp-single";
import { formatDateLabel } from "@/utils/format";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogSingleData(slug);

  if (!post) {
    notFound();
  }

  return buildPageMetadata(post.seo, { type: "article" });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogSingleData(slug);

  if (!post) {
    notFound();
  }

  const hasCustomSchema = Boolean(post.customSchema);

  return (
    <MainLayout>
      <main>
        <JsonLd
          data={buildBreadcrumbListSchema([
            { name: "Início", url: getHomeSeo().canonical },
            { name: "Blog", url: getBlogSeo().canonical },
            {
              name: post.primaryCategory.name,
              url: buildSiteUrl(`/blog/categoria/${post.primaryCategory.slug}`),
            },
            { name: post.title, url: post.seo.canonical },
          ])}
        />
        {hasCustomSchema ? <JsonLd data={post.customSchema!} /> : null}
        {!hasCustomSchema ? <JsonLd data={buildPersonSchema(post.schemaAuthor)} /> : null}
        {!hasCustomSchema ? (
          <JsonLd
            data={buildWebPageSchema({
              seo: post.seo,
              name: post.title,
              description: post.excerpt,
              type: "Article",
            })}
          />
        ) : null}
        {!hasCustomSchema ? (
          <JsonLd data={buildArticleSchema(post.schemaPost, post.schemaAuthor, post.schemaCategory)} />
        ) : null}
        {!hasCustomSchema && post.schemaPost.faq?.length ? (
          <JsonLd
            data={buildFaqPageSchema(
              post.schemaPost.faq.map((item) => ({
                question: item.question,
                answer: item.answer,
              })),
              post.seo.canonical,
            )}
          />
        ) : null}
        <article>
          <ArticleHeader
            category={{
              href: post.primaryCategory.href,
              label: post.primaryCategory.name,
            }}
            date={formatDateLabel(post.date)}
            dateTime={post.date}
            description={post.excerpt}
            readingTime={post.readingTime}
            title={post.title}
            editedAt={formatDateLabel(post.modified)}
            author={{
              href: post.author.href,
              initials: post.author.initials,
              name: post.author.name,
              avatarUrl: post.author.avatarUrl,
              role: post.author.role,
            }}
          />

          <div className="article-cover">
            <div className="cover-frame" role="img" aria-label={post.title}>
              <PostMedia
                imageUrl={post.featuredImageUrl}
                imageAlt={post.featuredImageAlt}
                artKey={post.featuredArtKey}
                label={post.primaryCategory.name}
                variant="bare"
                priority
              />
            </div>
          </div>

          <section className="article-body">
            <div className="container">
              <div className="article-grid">
                <aside className="col-left">
                  {post.headings.length ? <TableOfContents items={post.headings} /> : null}
                  <ShareBar
                    title={post.title}
                    url={post.seo.canonical}
                    items={[
                      {
                        platform: "linkedin",
                        label: "Compartilhar no LinkedIn",
                        icon: (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.7v8.6zM7 8.6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11.3 9.7h-2.7v-4.2c0-1-.4-1.7-1.3-1.7s-1.4.6-1.4 1.7v4.2H10.3V9.7h2.6v1.2c.4-.6 1.2-1.4 2.6-1.4 1.9 0 2.8 1.2 2.8 3.4v5.4z" />
                          </svg>
                        ),
                      },
                      {
                        platform: "x",
                        label: "Compartilhar no X",
                        icon: (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.5 3h3l-7 8 8 10h-6l-5-6-5.5 6h-3l7.5-8.5L2 3h6l4.5 5.5L17.5 3zm-1 16h1.5L7.5 5H6l10.5 14z" />
                          </svg>
                        ),
                      },
                      {
                        platform: "whatsapp",
                        label: "Compartilhar no WhatsApp",
                        icon: (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.7 14.2c-.2.7-1.3 1.3-1.8 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.1-.2-1.2-1.6-1.2-3 0-1.5.8-2.2 1-2.5.3-.3.6-.4.9-.4h.6c.2 0 .5-.1.7.5l1 2.3c.1.2.1.4 0 .6l-.3.4-.3.4c-.1.2-.3.3-.1.6.1.3.7 1.1 1.5 1.8 1 .9 1.8 1.2 2.1 1.3.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9 1c.3.2.5.3.6.4.1.2.1.8-.1 1.5z" />
                          </svg>
                        ),
                      },
                      {
                        platform: "copy",
                        label: "Copiar link",
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
                            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19" />
                          </svg>
                        ),
                      },
                    ]}
                  />
                </aside>

                <ArticleBody
                  faq={post.schemaPost.faq}
                  tags={post.tags}
                  cta={{
                    title: "Quer aplicar isso na sua operação?",
                    description:
                      "Diagnóstico de 20 minutos para mapear gargalos de aquisição, operação e conteúdo.",
                    href: "https://wa.me/",
                    label: "Falar no WhatsApp",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

                  <AuthorBio
                    initials={post.author.initials}
                    name={post.author.name}
                    avatarUrl={post.author.avatarUrl}
                    bio={post.author.bio}
                    href={post.author.href}
                    roleLabel={post.author.profileLabel}
                  />
                </ArticleBody>
              </div>
            </div>
          </section>
        </article>

        <RelatedPosts
          items={post.relatedPosts.map((item) => ({
            href: item.href,
            category: item.category,
            date: formatDateLabel(item.date),
            readingTime: item.readingTime,
            title: item.title,
            excerpt: item.excerpt,
            author: item.author,
            cover: (
              <PostMedia
                imageUrl={item.featuredImageUrl}
                imageAlt={item.featuredImageAlt}
                artKey={item.featuredArtKey}
                label={item.category}
              />
            ),
            readMoreLabel: item.slug.includes("case") ? "Ler case" : "Ler artigo",
          }))}
        />
      </main>
    </MainLayout>
  );
}
