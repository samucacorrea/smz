import type { Metadata } from "next";
import { HomeLanding } from "@/components/home/HomeLanding";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePageData } from "@/lib/wp-home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildItemListSchema, buildWebPageSchema } from "@/lib/seo/schema";
import { buildSiteUrl, getHomeSeo } from "@/lib/site";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata(getHomeSeo());
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <MainLayout>
      <JsonLd
        data={buildWebPageSchema({
          seo: data.seo,
          name: data.seo.title,
          description: data.seo.description,
        })}
      />
      <JsonLd
        data={buildItemListSchema({
          id: `${data.seo.canonical}#featured-posts`,
          name: "Posts em destaque",
          items: data.featuredPosts.map((post) => ({
            name: post.title,
            url: buildSiteUrl(`/blog/${post.slug}`),
          })),
        })}
      />
      <HomeLanding data={data} />
    </MainLayout>
  );
}
