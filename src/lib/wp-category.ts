import type { Category, SeoData } from "@/types/content";
import {
  canUseWordPressMockFallback,
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import {
  GET_CATEGORIES_QUERY,
  GET_CATEGORY_BY_SLUG_QUERY,
  GET_POSTS_BY_CATEGORY_SLUG_QUERY,
} from "@/graphql/queries";
import { getCategoryBySlug, getPostsByCategorySlug, mockContent } from "@/lib/mock-data";
import { buildSiteUrl } from "@/lib/site";
import { wpFetch } from "@/lib/wp-client";
import type {
  WpCategoriesQuery,
  WpCategory,
  WpCategoryBySlugQuery,
  WpPost,
  WpPostsQuery,
} from "@/types/wp";

type CategoryArchivePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  authorInitials: string;
  categoryName: string;
  featuredArtKey?: string;
};

type CategoryNavItem = {
  slug: string;
  name: string;
  articleCount: number;
};

export type BlogCategoryData = {
  category: {
    slug: string;
    name: string;
    description: string;
    articleCount: number;
    seo: SeoData;
  };
  posts: CategoryArchivePost[];
  categories: CategoryNavItem[];
  authorCount: number;
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

function mapWpPost(post: WpPost): CategoryArchivePost | null {
  if (!post.slug || !post.title || !post.date) {
    return null;
  }

  const primaryCategory = post.categories?.nodes?.[0];
  const authorName = post.author?.node?.name?.trim() || "SMZ";

  return {
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    date: post.date,
    readingTime: estimateReadingTime(post.content),
    authorInitials: getInitials(authorName),
    categoryName: primaryCategory?.name?.trim() || "Blog",
    featuredArtKey: deriveArtKey(post, primaryCategory?.slug),
  };
}

function mapMockCategoryData(slug: string): BlogCategoryData | null {
  const category = getCategoryBySlug(slug);

  if (!category) {
    return null;
  }

  const posts = getPostsByCategorySlug(category.slug);

  return {
    category,
    posts: posts.map((post) => {
      const author = mockContent.authors.find((item) => item.slug === post.authorSlug);
      const postCategory = mockContent.categories.find((item) =>
        post.categorySlugs.includes(item.slug),
      );

      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        readingTime: post.readingTime,
        authorInitials: author?.initials ?? "SMZ",
        categoryName: postCategory?.name ?? category.name,
        featuredArtKey: post.featuredArtKey,
      };
    }),
    categories: mockContent.categories.map((item) => ({
      slug: item.slug,
      name: item.name,
      articleCount: item.articleCount,
    })),
    authorCount: new Set(posts.map((post) => post.authorSlug)).size,
  };
}

function mapCategorySeo(category: WpCategory): SeoData {
  return {
    title: category.seo?.title || `${category.name ?? "Categoria"} · Blog SMZ`,
    description: category.seo?.metaDesc || category.description?.trim() || "",
    canonical: category.seo?.canonical || buildSiteUrl(`/blog/categoria/${category.slug ?? ""}`),
    ogImage: category.seo?.opengraphImage?.sourceUrl ?? undefined,
  };
}

export async function getBlogCategoryStaticParams() {
  if (!isWordPressConfigured()) {
    return canUseWordPressMockFallback()
      ? mockContent.categories.map((category) => ({ slug: category.slug }))
      : [];
  }

  try {
    const response = await wpFetch<WpCategoriesQuery>({
      query: GET_CATEGORIES_QUERY,
      variables: {
        first: 50,
      },
      tags: ["wp:categories"],
      revalidate: 300,
    });

    const slugs = (response.categories?.nodes ?? []).flatMap((category) =>
      category.slug ? [{ slug: category.slug }] : [],
    );

    return slugs.length
      ? slugs
      : canUseWordPressMockFallback()
        ? mockContent.categories.map((category) => ({ slug: category.slug }))
        : [];
  } catch (error) {
    handleWordPressError("category static params", error);
    return canUseWordPressMockFallback()
      ? mockContent.categories.map((category) => ({ slug: category.slug }))
      : [];
  }
}

export async function getBlogCategoryData(slug: string): Promise<BlogCategoryData | null> {
  if (!isWordPressConfigured()) {
    if (!canUseWordPressMockFallback()) {
      throw getWordPressConfigurationError(`category ${slug}`);
    }

    return mapMockCategoryData(slug);
  }

  try {
    const [categoryResponse, postsResponse, categoriesResponse] = await Promise.all([
      wpFetch<WpCategoryBySlugQuery>({
        query: GET_CATEGORY_BY_SLUG_QUERY,
        variables: {
          slug,
        },
        tags: [`wp:category:${slug}`],
        revalidate: 300,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_BY_CATEGORY_SLUG_QUERY,
        variables: {
          slug,
          first: 24,
        },
        tags: [`wp:category:${slug}`, "wp:posts"],
        revalidate: 300,
      }),
      wpFetch<WpCategoriesQuery>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          first: 50,
        },
        tags: ["wp:categories"],
        revalidate: 300,
      }),
    ]);

    const category = categoryResponse.category;

    if (!category?.slug || !category.name) {
      if (!canUseWordPressMockFallback()) {
        throw new Error(`WordPress returned no category for slug "${slug}".`);
      }
      return mapMockCategoryData(slug);
    }

    const posts = (postsResponse.posts?.nodes ?? [])
      .map(mapWpPost)
      .filter((post): post is CategoryArchivePost => Boolean(post));

    if (!posts.length) {
      if (!canUseWordPressMockFallback()) {
        throw new Error(`WordPress returned no posts for category "${slug}".`);
      }
      return mapMockCategoryData(slug);
    }

    return {
      category: {
        slug: category.slug,
        name: category.name,
        description: category.description?.trim() || "",
        articleCount: category.count ?? posts.length,
        seo: mapCategorySeo(category),
      },
      posts,
      categories: (categoriesResponse.categories?.nodes ?? [])
        .filter((item): item is WpCategory => Boolean(item?.slug && item?.name))
        .map((item) => ({
          slug: item.slug!,
          name: item.name!,
          articleCount:
            item.count ??
            mockContent.categories.find((mockCategory) => mockCategory.slug === item.slug)
              ?.articleCount ??
            0,
        })),
      authorCount: new Set(
        (postsResponse.posts?.nodes ?? []).map((post) => post.author?.node?.slug ?? post.id),
      ).size,
    };
  } catch (error) {
    handleWordPressError(`category data (${slug})`, error);

    if (!canUseWordPressMockFallback()) {
      throw error;
    }

    return mapMockCategoryData(slug);
  }
}
