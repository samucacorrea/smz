import { GET_CATEGORIES_QUERY, GET_POSTS_QUERY } from "@/graphql/queries";
import {
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpCategoriesQuery, WpCategory, WpPost, WpPostsQuery } from "@/types/wp";

export type BlogArchivePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  categoryName: string;
  categorySlug?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  featuredArtKey?: string;
};

export type BlogArchiveData = {
  posts: BlogArchivePost[];
  categoryCount: number;
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

function deriveArtKey(post: WpPost, primaryCategory?: WpCategory) {
  const slug = post.slug ?? "";
  const categorySlug = primaryCategory?.slug ?? "";

  if (slug.includes("ia") || categorySlug === "ia") return "ia-network";
  if (slug.includes("roi") || slug.includes("roas")) return "roi-bars";
  if (slug.includes("seo") || categorySlug === "seo") return "seo-bars";
  if (slug.includes("cro") || slug.includes("checkout") || categorySlug === "cro") {
    return "checkout";
  }
  if (slug.includes("crm") || slug.includes("hubspot")) return "crm";
  if (slug.includes("automacao") || slug.includes("n8n")) return "n8n";
  if (slug.includes("planejamento") || categorySlug === "estrategia") return "quarters";
  if (slug.includes("google-ads") || slug.includes("meta-ads")) return "trend-line";
  if (categorySlug === "cases" || slug.includes("case")) return "roi-bars";

  return undefined;
}

function mapWpPostToArchivePost(post: WpPost): BlogArchivePost | null {
  if (!post.id || !post.slug || !post.title || !post.date) {
    return null;
  }

  const primaryCategory = post.categories?.nodes?.[0] ?? null;
  const authorName = post.author?.node?.name?.trim() || "SMZ";

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    date: post.date,
    readingTime: estimateReadingTime(post.content),
    authorName,
    authorRole: "Equipe editorial",
    authorInitials: getInitials(authorName),
    categoryName: primaryCategory?.name?.trim() || "Blog",
    categorySlug: primaryCategory?.slug ?? undefined,
    featuredImageUrl: post.featuredImage?.node?.sourceUrl ?? undefined,
    featuredImageAlt: post.featuredImage?.node?.altText ?? undefined,
    featuredArtKey: deriveArtKey(post, primaryCategory ?? undefined),
  };
}

export async function getBlogArchiveData(): Promise<BlogArchiveData> {
  if (!isWordPressConfigured()) {
    throw getWordPressConfigurationError("blog archive");
  }

  try {
    const [postsResponse, categoriesResponse] = await Promise.all([
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_QUERY,
        variables: {
          first: 12,
        },
        tags: ["wp:posts"],
        revalidate: 30,
      }),
      wpFetch<WpCategoriesQuery>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          first: 50,
        },
        tags: ["wp:categories"],
        revalidate: 30,
      }),
    ]);

    const posts = (postsResponse.posts?.nodes ?? [])
      .map(mapWpPostToArchivePost)
      .filter((post): post is BlogArchivePost => Boolean(post));

    if (!posts.length) {
      throw new Error("WordPress returned no posts for the blog archive.");
    }

    return {
      posts,
      categoryCount: (categoriesResponse.categories?.nodes ?? []).length,
    };
  } catch (error) {
    handleWordPressError("blog archive", error);
    throw error;
  }
}
