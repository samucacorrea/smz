import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getWpPageData } from "@/lib/wp-page";

export const dynamic = "force-dynamic";

type WpPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: WpPageRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWpPageData(slug);

  if (!page) {
    notFound();
  }

  return buildPageMetadata(page.seo);
}

export default async function WpPageRoute({ params }: WpPageRouteProps) {
  const { slug } = await params;
  const page = await getWpPageData(slug);

  if (!page) {
    notFound();
  }

  return (
    <MainLayout>
      <JsonLd data={page.breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            url: page.seo.canonical,
            description: page.seo.description,
          }),
        }}
      />
      <main>
        <section className="article-body">
          <div className="container">
            <div className="prose" style={{ maxWidth: "72ch" }}>
              <h1>{page.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
