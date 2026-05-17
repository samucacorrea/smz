import type { Metadata } from "next";
import { HomeLanding } from "@/components/home/HomeLanding";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePageData } from "@/lib/wp-home";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/schema";
import { getHomeSeo } from "@/lib/site";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata(getHomeSeo());
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <MainLayout>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
      <HomeLanding data={data} />
    </MainLayout>
  );
}
