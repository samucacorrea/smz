import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { SearchExperience } from "@/components/search/SearchExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { mockContent } from "@/lib/mock-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbListSchema, buildCollectionPageSchema } from "@/lib/seo/schema";
import { getSearchPageData } from "@/lib/wp-search";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q ?? "IA").trim();

  return buildPageMetadata({
    title: `Busca por ${query} — SMZ`,
    description: `Resultados de busca por ${query} no conteúdo da SMZ.`,
    canonical: query
      ? `https://ag.smz/busca?q=${encodeURIComponent(query)}`
      : "https://ag.smz/busca",
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q ?? "IA").trim();
  const data = await getSearchPageData(query);
  const canonical = query
    ? `https://ag.smz/busca?q=${encodeURIComponent(query)}`
    : "https://ag.smz/busca";

  return (
    <MainLayout>
      <main>
        <JsonLd
          data={buildBreadcrumbListSchema([
            { name: "Início", url: mockContent.home.seo.canonical },
            { name: "Busca", url: canonical },
          ])}
        />
        <JsonLd
          data={buildCollectionPageSchema({
            seo: {
              title: `Busca por ${data.query} — SMZ`,
              description: `Resultados de busca por ${data.query} no conteúdo da SMZ.`,
              canonical,
            },
            name: `Busca por ${data.query}`,
            description: `Resultados de busca por ${data.query} no conteúdo da SMZ.`,
          })}
        />
        <SearchExperience initialQuery={data.query} results={data.results} />
      </main>
    </MainLayout>
  );
}
