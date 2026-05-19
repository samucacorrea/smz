import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServicePage } from "@/components/services/ServicePage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildOrganizationSchema,
  buildServiceSchema,
} from "@/lib/seo/schema";
import { getServiceBySlug, getServiceStaticParams } from "@/lib/services";
import { buildSiteUrl } from "@/lib/site";

type ServiceSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getServiceStaticParams();
}

export async function generateMetadata({ params }: ServiceSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return {
    ...buildPageMetadata({
      title: service.pageTitle.replace(/\s+\|\s+SMZ$/, ""),
      description: service.description,
      canonical: service.canonical,
      ogImage: service.ogImage,
    }),
    keywords: service.keywords,
    category: "Marketing Services",
    other: {
      "geo.region": "BR",
      "geo.country": "Brasil",
      "llm:intent": "service-landing-page",
    },
  };
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbListSchema([
          { name: "Início", url: buildSiteUrl("/") },
          { name: "Serviços", url: buildSiteUrl("/servicos") },
          { name: service.navLabel, url: service.canonical },
        ])}
      />
      <JsonLd
        data={buildServiceSchema({
          id: `${service.canonical}#service`,
          name: service.navLabel,
          description: service.description,
          serviceType: service.serviceType,
          url: service.canonical,
          image: service.ogImage,
        })}
      />
      <JsonLd
        data={buildFaqPageSchema(
          service.faq.map((item) => ({
            question: item.question,
            answer: item.answerHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
          })),
        )}
      />
      <ServicePage service={service} />
    </>
  );
}
