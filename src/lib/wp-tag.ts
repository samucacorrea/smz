import type { SeoData } from "@/types/content";
import {
  GET_POSTS_BY_TAG_SLUG_QUERY,
  GET_TAG_BY_SLUG_QUERY,
  GET_TAGS_QUERY,
} from "@/graphql/queries";
import { buildSiteUrl } from "@/lib/site";
import {
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type {
  WpPost,
  WpPostsQuery,
  WpTag,
  WpTagBySlugQuery,
  WpTagsQuery,
} from "@/types/wp";

type TagArchivePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  authorName: string;
  categoryName: string;
  tags: Array<{
    slug: string;
    name: string;
  }>;
};

type TagCloudItem = {
  slug: string;
  name: string;
  articleCount: number;
};

export type BlogTagData = {
  tag: {
    slug: string;
    name: string;
    description: string;
    articleCount: number;
    seo: SeoData;
  };
  posts: TagArchivePost[];
  relatedTags: TagCloudItem[];
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

function mapTagSeo(tag: WpTag): SeoData {
  return {
    title: tag.seo?.title || `#${tag.name ?? "Tag"} · Blog SMZ`,
    description: tag.seo?.metaDesc || tag.description?.trim() || "",
    canonical: tag.seo?.canonical || buildSiteUrl(`/blog/tag/${tag.slug ?? ""}`),
    ogImage: tag.seo?.opengraphImage?.sourceUrl ?? undefined,
  };
}

function mapWpPost(post: WpPost): TagArchivePost | null {
  if (!post.slug || !post.title || !post.date) {
    return null;
  }

  return {
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? post.content ?? ""),
    date: post.date,
    readingTime: estimateReadingTime(post.content),
    authorName: post.author?.node?.name?.trim() || "SMZ",
    categoryName: post.categories?.nodes?.[0]?.name?.trim() || "Blog",
    tags: (post.tags?.nodes ?? [])
      .filter((tag): tag is WpTag => Boolean(tag?.slug && tag?.name))
      .map((tag) => ({
        slug: tag.slug!,
        name: tag.name!,
      })),
  };
}

export async function getBlogTagStaticParams() {
  if (!isWordPressConfigured()) {
    return [];
  }

  try {
    const response = await wpFetch<WpTagsQuery>({
      query: GET_TAGS_QUERY,
      variables: {
        first: 50,
      },
      tags: ["wp:tags"],
      revalidate: 30,
    });

    const slugs = (response.tags?.nodes ?? []).flatMap((tag) =>
      tag.slug ? [{ slug: tag.slug }] : [],
    );

    return slugs;
  } catch (error) {
    handleWordPressError("tag static params", error);
    return [];
  }
}

export async function getBlogTagData(slug: string): Promise<BlogTagData | null> {
  if (!isWordPressConfigured()) {
    throw getWordPressConfigurationError(`tag ${slug}`);
  }

  try {
    const [tagResponse, postsResponse, tagsResponse] = await Promise.all([
      wpFetch<WpTagBySlugQuery>({
        query: GET_TAG_BY_SLUG_QUERY,
        variables: {
          slug,
        },
        tags: [`wp:tag:${slug}`],
        revalidate: 30,
      }),
      wpFetch<WpPostsQuery>({
        query: GET_POSTS_BY_TAG_SLUG_QUERY,
        variables: {
          slug,
          first: 24,
        },
        tags: [`wp:tag:${slug}`, "wp:posts"],
        revalidate: 30,
      }),
      wpFetch<WpTagsQuery>({
        query: GET_TAGS_QUERY,
        variables: {
          first: 50,
        },
        tags: ["wp:tags"],
        revalidate: 30,
      }),
    ]);

    const tag = tagResponse.tag;

    if (!tag?.slug || !tag.name) {
      throw new Error(`WordPress returned no tag for slug "${slug}".`);
    }

    const posts = (postsResponse.posts?.nodes ?? [])
      .map(mapWpPost)
      .filter((post): post is TagArchivePost => Boolean(post));

    return {
      tag: {
        slug: tag.slug,
        name: tag.name,
        description: tag.description?.trim() || "",
        articleCount: tag.count ?? posts.length,
        seo: mapTagSeo(tag),
      },
      posts,
      relatedTags: (tagsResponse.tags?.nodes ?? [])
        .filter((item): item is WpTag => Boolean(item?.slug && item?.name && item.slug !== slug))
        .slice(0, 6)
        .map((item) => ({
          slug: item.slug!,
          name: item.name!,
          articleCount: item.count ?? 0,
        })),
      authorCount: new Set(
        (postsResponse.posts?.nodes ?? []).map((post) => post.author?.node?.slug ?? post.id),
      ).size,
    };
  } catch (error) {
    handleWordPressError(`tag data (${slug})`, error);
    throw error;
  }
}
