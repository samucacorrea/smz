import Image from "next/image";
import Link from "next/link";

type ArticleHeaderProps = {
  category: {
    href: string;
    label: string;
  };
  date: string;
  dateTime: string;
  description: string;
  readingTime: string;
  title: string;
  author: {
    href: string;
    initials: string;
    name: string;
    avatarUrl?: string;
    role: string;
  };
  editedAt?: string;
};

export function ArticleHeader({
  author,
  category,
  date,
  dateTime,
  description,
  editedAt,
  readingTime,
  title,
}: ArticleHeaderProps) {
  return (
    <header className="article-header">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Início</Link>
          <span className="sep">/</span>
          <Link href="/blog">Blog</Link>
          <span className="sep">/</span>
          <Link href={category.href} style={{ color: "var(--green)" }}>
            {category.label}
          </Link>
        </nav>

        <div className="meta-row">
          <span className="tag-pill">{category.label}</span>
          <time dateTime={dateTime}>{date}</time>
          <span>· {readingTime}</span>
        </div>

        <h1>{title}</h1>
        <p className="deck">{description}</p>

        <div className="byline">
          <div className="author-mini">
            <div className="avatar">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  fill
                  className="avatar-photo"
                  sizes="40px"
                  unoptimized
                />
              ) : (
                author.initials
              )}
            </div>
            <div>
              <div className="name">
                <Link
                  href={author.href}
                  style={{ borderBottom: "1px solid var(--green)", paddingBottom: 1 }}
                >
                  {author.name}
                </Link>
              </div>
              <div className="role">{author.role}</div>
            </div>
          </div>

          <div className="meta-side">
            <span>
              <span className="key">Categoria</span>
              {category.label}
            </span>
            {editedAt ? (
              <span className="hide-mobile">
                <span className="key">Editado em</span>
                {editedAt}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
