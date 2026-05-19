import Image from "next/image";
import { PostArtwork } from "@/components/blog/PostArtwork";

type PostMediaProps = {
  imageUrl?: string;
  imageAlt?: string;
  artKey?: string;
  label?: string;
  variant?: "cover" | "bare";
  priority?: boolean;
};

function normalizeImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return undefined;
  }

  if (imageUrl.startsWith("//")) {
    return `https:${imageUrl}`;
  }

  try {
    const parsed = new URL(imageUrl);
    const fallbackOrigin =
      process.env.WORDPRESS_SITE_URL?.trim() ||
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      imageUrl;

    const preferredProtocol = new URL(fallbackOrigin).protocol;

    if (preferredProtocol === "https:" && parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }

    return parsed.toString();
  } catch {
    return imageUrl;
  }
}

export function PostMedia({
  artKey,
  imageAlt,
  imageUrl,
  label,
  priority = false,
  variant = "cover",
}: PostMediaProps) {
  const normalizedImageUrl = normalizeImageUrl(imageUrl);

  if (variant === "bare") {
    if (normalizedImageUrl) {
      return (
        <div className="post-media post-media-bare">
          <Image
            src={normalizedImageUrl}
            alt={imageAlt || label || "Imagem do artigo"}
            fill
            className="post-media-image"
            sizes="(max-width: 800px) 100vw, 50vw"
            priority={priority}
            unoptimized
          />
        </div>
      );
    }

    return <PostArtwork artKey={artKey} label={label} variant="bare" />;
  }

  if (normalizedImageUrl) {
    return (
      <div className="cover-art post-media">
        <Image
          src={normalizedImageUrl}
          alt={imageAlt || label || "Imagem do artigo"}
          fill
          className="post-media-image"
          sizes="(max-width: 900px) 100vw, 33vw"
          priority={priority}
          unoptimized
        />
      </div>
    );
  }

  return <PostArtwork artKey={artKey} label={label} />;
}
