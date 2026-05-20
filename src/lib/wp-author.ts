import type { Author, SeoData } from "@/types/content";
import { GET_AUTHORS_QUERY, GET_AUTHOR_BY_SLUG_QUERY, GET_POSTS_QUERY } from "@/graphql/queries";
import { buildSiteUrl } from "@/lib/site";
import {
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type {
  WpAuthor,
  WpAuthorBySlugQuery,
  WpAuthorsQuery,
  WpPost,
  WpPostsQuery,
} from "@/types/wp";

type AuthorArchivePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  categoryName: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  featuredArtKey?: string;
};

type AuthorStatsItem = {
  label: string;
  value: string;
  footnote: string;
};

export type BlogAuthorData = {
  author: {
    slug: string;
    name: string;
    initials: string;
    avatarUrl?: string;
    role: string;
    shortBio: string;
    longBio: string[];
    expertise: string[];
    socials: Array<{
      label: string;
      href: string;
    }>;
    stats: AuthorStatsItem[];
    quote?: {
      text: string;
      attribution: string;
    };
    seo: SeoData;
  };
  posts: AuthorArchivePost[];
  schemaAuthor: Author;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadingTime(content?: string | null) {
  const plainText = stripHtml(content ?? "");
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));

  return `${minutes} min`;
}

function getInitials(name?: string | null) {
  const parts = (name ?? "SMZ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "SMZ";
}

function deriveArtKey(post: WpPost, categorySlug?: string | null) {
  const slug = post.slug ?? "";

  if (slug.includes("ia") || categorySlug === "ia") return "ia-network";
  if (slug.includes("roi") || slug.includes("roas") || categorySlug === "cases") {
    return "roi-bars";
  }
  if (slug.includes("seo") || categorySlug === "seo") return "seo-bars";
  if (slug.includes("cro") || slug.includes("checkout") || categorySlug === "cro") {
    return "checkout";
  }
  if (slug.includes("crm") || slug.includes("hubspot")) return "crm";
  if (slug.includes("automacao") || slug.includes("n8n")) return "n8n";
  if (slug.includes("planejamento") || categorySlug === "estrategia") return "quarters";
  if (slug.includes("google-ads") || slug.includes("meta-ads")) return "trend-line";

  return undefined;
}

function mapWpPost(post: WpPost): AuthorArchivePost | null {
  if (!post.slug || !post.title || !post.date) {
    return null;
  }

  const primaryCategory = post.categories?.nodes?.[0];

  return {
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    date: post.date,
    readingTime: estimateReadingTime(post.content),
    categoryName: primaryCategory?.name?.trim() || "Blog",
    featuredImageUrl: post.featuredImage?.node?.sourceUrl ?? undefined,
    featuredImageAlt: post.featuredImage?.node?.altText ?? undefined,
    featuredArtKey: deriveArtKey(post, primaryCategory?.slug),
  };
}

function buildSeo(author: WpAuthor): SeoData {
  const slug = author.slug ?? "autor";
  const name = author.name ?? "Autor SMZ";
  const description = author.description?.trim() || "Autor da equipe editorial da SMZ.";

  return {
    title: `${name} · SMZ`,
    description,
    canonical: buildSiteUrl(`/blog/autor/${slug}`),
  };
}

function buildStats(posts: AuthorArchivePost[]): AuthorStatsItem[] {
  const latest = posts[0]?.date;

  return [
    {
      label: "Artigos publicados",
      value: `${posts.length}.`,
      footnote: "conteudo editorial",
    },
    {
      label: "Tempo medio",
      value: posts[0]?.readingTime.replace(/\s+/g, "").toUpperCase() || "5MIN",
      footnote: "estimado automaticamente",
    },
    {
      label: "Ultima publicacao",
      value: latest ? latest.slice(5, 10).replace("-", "").toUpperCase() : "N/A",
      footnote: latest ? latest.slice(0, 4) : "sem data",
    },
  ];
}

function splitAuthorBio(rawDescription?: string | null) {
  const normalized = (rawDescription ?? "")
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (normalized.length > 1) {
    return {
      shortBio: normalized[0],
      longBio: normalized.slice(1),
    };
  }

  const singleParagraph = normalized[0] ?? "";
  const sentenceMatches = singleParagraph.match(/[^.!?]+[.!?]+/g)?.map((item) => item.trim()) ?? [];

  if (sentenceMatches.length > 1) {
    return {
      shortBio: sentenceMatches[0],
      longBio: [sentenceMatches.slice(1).join(" ")],
    };
  }

  return {
    shortBio: singleParagraph || "Autor da equipe editorial da SMZ.",
    longBio: [],
  };
}

function deriveExpertise(posts: AuthorArchivePost[]) {
  return [...new Set(posts.map((post) => post.categoryName).filter(Boolean))].slice(0, 6);
}

export async function getBlogAuthorStaticParams() {
  if (!isWordPressConfigured()) {
    return [];
  }

  try {
    const response = await wpFetch<WpAuthorsQuery>({
      query: GET_AUTHORS_QUERY,
      variables: {
        first: 50,
      },
      tags: ["wp:authors"],
      revalidate: 30,
    });

    const slugs = (response.users?.nodes ?? []).flatMap((author) =>
      author.slug ? [{ slug: author.slug }] : [],
    );

    return slugs;
  } catch (error) {
    handleWordPressError("author static params", error);
    return [];
  }
}

export async function getBlogAuthorData(slug: string): Promise<BlogAuthorData | null> {
  if (!isWordPressConfigured()) {
    throw getWordPressConfigurationError(`author ${slug}`);
  }

  try {
    const [authorResponse, postsResponse] = await Promise.all([
      wpFetch<WpAuthorBySlugQuery>({
        query: GET_AUTHOR_BY_SLUG_QUERY,
        variables: {
          slug,
        },
        tags: [`wp:author:${slug}`],
        revalidate: 30,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: {
          first: 50,
        },
        tags: ["wp:posts"],
        revalidate: 30,
      }),
    ]);

    const author = authorResponse.user;

    if (!author?.slug || !author.name) {
      throw new Error(`WordPress returned no author for slug "${slug}".`);
    }

    const posts = (postsResponse.posts?.nodes ?? [])
      .filter((post) => post.author?.node?.slug === author.slug)
      .map(mapWpPost)
      .filter((post): post is AuthorArchivePost => Boolean(post));

    const { shortBio, longBio } = splitAuthorBio(author.description);
    const expertise = deriveExpertise(posts);

    const authorData = {
      slug: author.slug,
      name: author.name,
      initials: getInitials(author.name),
      avatarUrl: author.avatar?.url ?? undefined,
      role: "Equipe editorial",
      shortBio,
      longBio,
      expertise,
      socials: [],
      stats: buildStats(posts),
      seo: buildSeo(author),
    };

    const schemaAuthor: Author = {
      id: author.id,
      slug: authorData.slug,
      name: authorData.name,
      initials: authorData.initials,
      role: authorData.role,
      shortBio: authorData.shortBio,
      longBio: authorData.longBio,
      expertise,
      stats: authorData.stats,
      quote: undefined,
      socials: authorData.socials,
      seo: authorData.seo,
      avatarUrl: authorData.avatarUrl,
    };

    return {
      author: authorData,
      posts,
      schemaAuthor,
    };
  } catch (error) {
    handleWordPressError(`author data (${slug})`, error);
    throw error;
  }
}
