import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

type AuthorBioProps = {
  initials: string;
  name: string;
  avatarUrl?: string;
  roleLabel?: string;
  bio: string;
  href: string;
  buttonLabel?: string;
};

function truncateBio(value: string, maxLength = 30) {
  const normalized = value.trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function AuthorBio({
  avatarUrl,
  bio,
  buttonLabel = "Ver perfil & artigos",
  href,
  initials,
  name,
  roleLabel = "Autor",
}: AuthorBioProps) {
  return (
    <aside className="author-bio" aria-label={`Sobre ${roleLabel.toLowerCase()}`}>
      <div className="avatar-big">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="avatar-photo"
            sizes="80px"
            unoptimized
          />
        ) : (
          initials
        )}
      </div>
      <div>
        <p className="who-label">{roleLabel}</p>
        <p className="who-name">{name}</p>
        <p className="who-bio">{truncateBio(bio)}</p>
      </div>
      <ButtonLink href={href} variant="ghost">
        {buttonLabel}
      </ButtonLink>
    </aside>
  );
}
