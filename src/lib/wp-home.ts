import { getHomeSeo } from "@/lib/site";
import { getBlogArchiveData } from "@/lib/wp-blog";

export type HomePageData = {
  featuredPosts: Awaited<ReturnType<typeof getBlogArchiveData>>["posts"];
  stats: {
    postCount: number;
    categoryCount: number;
  };
  seo: ReturnType<typeof getHomeSeo>;
};

export async function getHomePageData(): Promise<HomePageData> {
  const archive = await getBlogArchiveData();

  return {
    featuredPosts: archive.posts.slice(0, 3),
    stats: {
      postCount: archive.posts.length,
      categoryCount: archive.categoryCount,
    },
    seo: getHomeSeo(),
  };
}
