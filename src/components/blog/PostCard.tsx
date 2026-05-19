import Link from "next/link";
import type { ReactNode } from "react";

type PostCardProps = {
  href: string;
  category: string;
  date: string;
  dateTime: string;
  readingTime: string;
  title: string;
  excerpt: string;
  author: string;
  cover: ReactNode;
  categoryKey?: string;
  readMoreLabel?: string;
};

export function PostCard({
  author,
  category,
  categoryKey,
  cover,
  date,
  dateTime,
  excerpt,
  href,
  readMoreLabel = "Ler",
  readingTime,
  title,
}: PostCardProps) {
  return (
    <Link href={href} className="post" data-cat={categoryKey}>
      <div className="post-cover">
        {cover}
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span className="tag-pill">{category}</span>
          <time dateTime={dateTime}>{date}</time>
          <span>· {readingTime}</span>
        </div>
        <h3 className="post-title">{title}</h3>
        <p className="post-excerpt">{excerpt}</p>
        <div className="post-foot">
          <span>Por {author}</span>
          <span className="read-more">
            {readMoreLabel} <span className="arrow">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
