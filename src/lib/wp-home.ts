import { mockContent } from "@/lib/mock-data";
import { getBlogArchiveData } from "@/lib/wp-blog";

export type HomePageData = {
  home: typeof mockContent.home;
  seo: typeof mockContent.home.seo;
  featuredPosts: Awaited<ReturnType<typeof getBlogArchiveData>>["posts"];
  stats: {
    postCount: number;
    categoryCount: number;
  };
};

export async function getHomePageData(): Promise<HomePageData> {
  const archive = await getBlogArchiveData();

  return {
    home: mockContent.home,
    seo: mockContent.home.seo,
    featuredPosts: archive.posts.slice(0, 3),
    stats: {
      postCount: archive.posts.length,
      categoryCount: archive.categoryCount,
    },
  };
}
