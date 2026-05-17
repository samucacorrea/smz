import type { SeoData } from "@/types/content";
import { GET_PAGE_BY_SLUG_QUERY, GET_PAGES_QUERY } from "@/graphql/queries";
import { buildBreadcrumbListSchema } from "@/lib/seo/schema";
import { getSiteOrigin } from "@/lib/site";
import {
  canUseWordPressMockFallback,
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpPage, WpPageBySlugQuery, WpPagesQuery } from "@/types/wp";

export type WpPageData = {
  slug: string;
  title: string;
  contentHtml: string;
  seo: SeoData;
  breadcrumbSchema: ReturnType<typeof buildBreadcrumbListSchema>;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildPageSeo(page: WpPage, slug: string): SeoData {
  const title = stripHtml(page.title ?? slug);
  const description = stripHtml(page.content ?? "").slice(0, 160) || `Página ${title} da SMZ.`;
  const canonical = `${getSiteOrigin()}/${slug}`;

  return {
    title: `${title} · SMZ`,
    description,
    canonical,
  };
}

function mapWpPage(page: WpPage): WpPageData | null {
  if (!page.slug || !page.title) {
    return null;
  }

  const title = stripHtml(page.title);
  const seo = buildPageSeo(page, page.slug);

  return {
    slug: page.slug,
    title,
    contentHtml: page.content ?? "",
    seo,
    breadcrumbSchema: buildBreadcrumbListSchema([
      { name: "Início", url: `${getSiteOrigin()}/` },
      { name: title, url: seo.canonical },
    ]),
  };
}

async function fetchPageBySlug(slug: string) {
  const candidates = [`/${slug}/`, slug];

  for (const candidate of candidates) {
    const response = await wpFetch<WpPageBySlugQuery>({
      query: GET_PAGE_BY_SLUG_QUERY,
      variables: {
        slug: candidate,
      },
      tags: [`wp:page:${slug}`],
      revalidate: 300,
    });

    if (response.page) {
      return response.page;
    }
  }

  return null;
}

export async function getWpPageStaticParams() {
  if (!isWordPressConfigured()) {
    return [];
  }

  try {
    const response = await wpFetch<WpPagesQuery>({
      query: GET_PAGES_QUERY,
      variables: {
        first: 100,
      },
      tags: ["wp:pages"],
      revalidate: 300,
    });

    return (response.pages?.nodes ?? [])
      .flatMap((page) => (page.slug ? [{ slug: page.slug }] : []));
  } catch (error) {
    handleWordPressError("page static params", error);
    return [];
  }
}

export async function getWpPageData(slug: string): Promise<WpPageData | null> {
  if (!isWordPressConfigured()) {
    if (!canUseWordPressMockFallback()) {
      throw getWordPressConfigurationError(`page ${slug}`);
    }

    return null;
  }

  try {
    const page = await fetchPageBySlug(slug);

    if (!page) {
      return null;
    }

    return mapWpPage(page);
  } catch (error) {
    handleWordPressError(`page data (${slug})`, error);

    if (!canUseWordPressMockFallback()) {
      throw error;
    }

    return null;
  }
}
