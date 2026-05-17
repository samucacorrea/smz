import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

type AuthorBioProps = {
  initials: string;
  name: string;
  roleLabel?: string;
  bio: string;
  href: string;
  buttonLabel?: string;
};

export function AuthorBio({
  bio,
  buttonLabel = "Ver perfil & artigos",
  href,
  initials,
  name,
  roleLabel = "Autora",
}: AuthorBioProps) {
  return (
    <aside className="author-bio" aria-label="Sobre a autora">
      <div className="avatar-big">{initials}</div>
      <div>
        <p className="who-label">{roleLabel}</p>
        <p className="who-name">{name}</p>
        <p className="who-bio">{bio}</p>
      </div>
      <ButtonLink href={href} variant="ghost">
        {buttonLabel}
      </ButtonLink>
    </aside>
  );
}
