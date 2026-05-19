import type { SearchResult } from "@/types/content";
import { GET_CATEGORIES_QUERY, GET_SEARCH_POSTS_QUERY, GET_TAGS_QUERY } from "@/graphql/queries";
import {
  getWordPressConfigurationError,
  handleWordPressError,
  isWordPressConfigured,
} from "@/lib/wp-mode";
import { wpFetch } from "@/lib/wp-client";
import type { WpCategoriesQuery, WpPostsQuery, WpTagsQuery } from "@/types/wp";

export type SearchPageData = {
  query: string;
  results: SearchResult[];
};

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function dedupeResults(results: SearchResult[]) {
  const seen = new Set<string>();

  return results.filter((result) => {
    const key = `${result.type}:${result.href}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function getSearchPageData(query: string): Promise<SearchPageData> {
  const trimmedQuery = query.trim() || "IA";

  if (!isWordPressConfigured()) {
    throw getWordPressConfigurationError(`search query "${trimmedQuery}"`);
  }

  try {
    const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
      wpFetch<WpPostsQuery>({
        query: GET_SEARCH_POSTS_QUERY,
        variables: {
          search: trimmedQuery,
          first: 24,
        },
        tags: ["wp:posts", `wp:search:${trimmedQuery}`],
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
      wpFetch<WpTagsQuery>({
        query: GET_TAGS_QUERY,
        variables: {
          first: 50,
        },
        tags: ["wp:tags"],
        revalidate: 30,
      }),
    ]);

    const normalized = normalizeText(trimmedQuery);

    const postResults: SearchResult[] = (postsResponse.posts?.nodes ?? [])
      .filter((post) => post.slug && post.title)
      .map((post) => {
        const authorName = post.author?.node?.name?.trim() || "SMZ";
        const categoryName = post.categories?.nodes?.[0]?.name?.trim() || "Blog";

        return {
          id: post.id,
          type: post.slug?.includes("case") ? "case" : "post",
          title: stripHtml(post.title!),
          href: `/blog/${post.slug}`,
          snippet: stripHtml(post.excerpt ?? post.content ?? ""),
          breadcrumb: ["smz.agency", "blog", post.slug!],
          meta: [
            post.date ? new Date(post.date).toLocaleDateString("pt-BR") : "Sem data",
            authorName,
            categoryName,
          ],
        } satisfies SearchResult;
      });

    const categoryResults: SearchResult[] = (categoriesResponse.categories?.nodes ?? [])
      .filter((category) => category.slug && category.name)
      .filter((category) =>
        normalizeText(
          `${category.name} ${category.description ?? ""} ${category.slug ?? ""}`,
        ).includes(normalized),
      )
      .map((category) => ({
        id: category.id,
        type: "categoria",
        title: category.name!,
        href: `/blog/categoria/${category.slug}`,
        snippet: stripHtml(category.description ?? ""),
        breadcrumb: ["smz.agency", "blog", "categoria", category.slug!],
        meta: ["Categoria editorial"],
      }));

    const tagResults: SearchResult[] = (tagsResponse.tags?.nodes ?? [])
      .filter((tag) => tag.slug && tag.name)
      .filter((tag) =>
        normalizeText(`${tag.name} ${tag.description ?? ""} ${tag.slug ?? ""}`).includes(
          normalized,
        ),
      )
      .map((tag) => ({
        id: tag.id,
        type: "categoria",
        title: `#${tag.name!}`,
        href: `/blog/tag/${tag.slug}`,
        snippet: stripHtml(tag.description ?? ""),
        breadcrumb: ["smz.agency", "blog", "tag", tag.slug!],
        meta: ["Tag editorial"],
      }));

    return {
      query: trimmedQuery,
      results: dedupeResults([...postResults, ...categoryResults, ...tagResults]),
    };
  } catch (error) {
    handleWordPressError(`search data (${trimmedQuery})`, error);
    throw error;
  }
}
