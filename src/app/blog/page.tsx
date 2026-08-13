import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import {
  buildBreadcrumbListSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import { buildSiteUrl, getBlogSeo, getHomeSeo } from "@/lib/site";
import { formatDateLabel } from "@/utils/format";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata(getBlogSeo());
}

const POSTS_PER_PAGE = 12;

type BlogPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

function getPageNumber(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function getPageHref(page: number) {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = getPageNumber(resolvedSearchParams?.page);
  const archive = await getBlogArchiveData();
  const totalPosts = archive.posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));

  if (currentPage > totalPages) {
    notFound();
  }

  const pageStart = (currentPage - 1) * POSTS_PER_PAGE;
  const pageEnd = Math.min(pageStart + POSTS_PER_PAGE, totalPosts);
  const pagePosts = archive.posts.slice(pageStart, pageEnd);
  const featuredPosts = currentPage === 1 ? pagePosts.slice(0, 3) : [];
  const latestPosts = currentPage === 1 ? pagePosts.slice(3) : pagePosts;
  const paginationPages = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;

    return {
      label: String(page),
      href: getPageHref(page),
      isCurrent: page === currentPage,
    };
  });

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
        <JsonLd
          data={buildWebPageSchema({
            seo: getBlogSeo(),
            name: "Blog SMZ",
            description: getBlogSeo().description,
            type: "CollectionPage",
          })}
        />
        <JsonLd
          data={buildItemListSchema({
            id: `${getBlogSeo().canonical}#post-list`,
            name: "Posts do blog SMZ",
            items: pagePosts.map((post) => ({
              name: post.title,
              url: buildSiteUrl(`/blog/${post.slug}`),
            })),
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
                    <strong>{totalPosts}</strong> artigos publicados
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

            {currentPage === 1 ? <FeaturedSlider items={sliderItems} /> : null}
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
              summary={`Mostrando ${pageStart + 1}–${pageEnd} de ${totalPosts} artigos`}
              previousHref={currentPage > 1 ? getPageHref(currentPage - 1) : undefined}
              nextHref={currentPage < totalPages ? getPageHref(currentPage + 1) : undefined}
              pages={paginationPages}
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
