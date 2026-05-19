import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { FeaturedSlider } from "@/components/blog/FeaturedSlider";
import { NewsletterCta } from "@/components/blog/NewsletterCta";
import { Pagination } from "@/components/blog/Pagination";
import { PostCard } from "@/components/blog/PostCard";
import { PostGrid } from "@/components/blog/PostGrid";
import { PostMedia } from "@/components/blog/PostMedia";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogArchiveData } from "@/lib/wp-blog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema, buildCollectionPageSchema } from "@/lib/seo/schema";
import { getBlogSeo, getHomeSeo } from "@/lib/site";
import { formatDateLabel } from "@/utils/format";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata(getBlogSeo());
}

export default async function BlogPage() {
  const archive = await getBlogArchiveData();
  const featuredPosts = archive.posts.slice(0, 3);
  const latestPosts = archive.posts.slice(3, 12);

  const sliderItems = featuredPosts.map((post) => {
    return {
      id: post.id,
      href: `/blog/${post.slug}`,
      tag: post.categoryName,
      date: formatDateLabel(post.date),
      readingTime: post.readingTime,
      title: post.title,
      excerpt: post.excerpt,
      authorName: post.authorName,
      authorRole: post.authorRole,
      authorInitials: post.authorInitials,
      actionLabel: post.slug.includes("case") ? "Ler case" : "Ler artigo",
      artTag:
        post.slug.includes("case")
          ? "Case · ROI 3x"
          : post.slug.includes("agencia")
            ? "Guia · 2026"
            : `Em destaque · ${post.categoryName}`,
      artwork: (
        <PostMedia
          imageUrl={post.featuredImageUrl}
          imageAlt={post.featuredImageAlt}
          artKey={post.featuredArtKey}
          label={post.categoryName}
          variant="bare"
          priority
        />
      ),
    };
  });

  return (
    <MainLayout>
      <main>
        <JsonLd
          data={buildBreadcrumbListSchema([
            { name: "Início", url: getHomeSeo().canonical },
            { name: "Blog", url: getBlogSeo().canonical },
          ])}
        />
        <JsonLd
          data={buildCollectionPageSchema({
            seo: getBlogSeo(),
            name: "Blog SMZ",
            description: getBlogSeo().description,
          })}
        />
        <section className="blog-hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container" style={{ position: "relative" }}>
            <Breadcrumbs items={[{ href: "/", label: "Início" }, { label: "Blog" }]} />

            <div className="lede-row">
              <h1>
                Notas de quem está
                <br />
                <em>dentro da operação.</em>
                <br />
                <span className="accent">Sem manual genérico.</span>
              </h1>
              <div>
                <p className="lede">
                  Artigos escritos pelo time estratégico da SMZ, baseados em contas que
                  gerenciamos. Cobrimos tráfego, SEO, IA, CRO, automação e tudo que move
                  ponteiro no negócio do cliente.
                </p>
                <div className="meta-strip">
                  <span>
                    <strong>{archive.posts.length}</strong> artigos publicados
                  </span>
                  <span>
                    <strong>{archive.categoryCount}</strong> categorias
                  </span>
                  <span>
                    <strong>Atualizado</strong> semanalmente
                  </span>
                </div>
              </div>
            </div>

            <FeaturedSlider items={sliderItems} />
          </div>
        </section>

        <section className="listing" id="listing">
          <div className="container">
            <PostGrid id="listingGrid">
              {latestPosts.map((post) => {
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
                    cover={
                      <PostMedia
                        imageUrl={post.featuredImageUrl}
                        imageAlt={post.featuredImageAlt}
                        artKey={post.featuredArtKey}
                        label={post.categoryName}
                      />
                    }
                    readMoreLabel={post.slug.includes("case") ? "Ler case" : "Ler"}
                  />
                );
              })}
            </PostGrid>

            <Pagination
              summary={`Mostrando 1–${archive.posts.length} de ${archive.posts.length} artigos`}
              pages={[{ label: "1", href: "/blog", isCurrent: true }]}
            />
          </div>
        </section>

        <NewsletterCta
          title={
            <>
              O que a gente aprendeu
              <br />
              <em>operando, não opinando.</em>
              <br />
              <span className="accent">Direto na sua caixa.</span>
            </>
          }
          description="Um e-mail a cada duas semanas, com análises honestas, movimentos de mercado e nenhum ruído."
        />
      </main>
    </MainLayout>
  );
}
