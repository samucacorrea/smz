import Link from "next/link";
import type { ReactNode } from "react";
import { PostCard } from "@/components/blog/PostCard";

type RelatedPostItem = {
  href: string;
  category: string;
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
  author: string;
  cover: ReactNode;
  readMoreLabel?: string;
};

type RelatedPostsProps = {
  items: RelatedPostItem[];
  viewAllHref?: string;
};

export function RelatedPosts({
  items,
  viewAllHref = "/blog",
}: RelatedPostsProps) {
  return (
    <section className="related" aria-label="Artigos relacionados">
      <div className="container">
        <div className="head-row">
          <h2>Continue lendo.</h2>
          <Link href={viewAllHref} className="inline-link">
            Ver todos <span className="arrow">→</span>
          </Link>
        </div>
        <div className="blog-grid">
          {items.map((item) => (
            <PostCard
              key={item.href}
              href={item.href}
              category={item.category}
              date={item.date}
              dateTime={item.date}
              readingTime={item.readingTime}
              title={item.title}
              excerpt={item.excerpt}
              author={item.author}
              cover={item.cover}
              readMoreLabel={item.readMoreLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
