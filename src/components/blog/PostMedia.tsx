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

export function PostMedia({
  artKey,
  imageAlt,
  imageUrl,
  label,
  priority = false,
  variant = "cover",
}: PostMediaProps) {
  if (variant === "bare") {
    if (imageUrl) {
      return (
        <div className="post-media post-media-bare">
          <Image
            src={imageUrl}
            alt={imageAlt || label || "Imagem do artigo"}
            fill
            className="post-media-image"
            sizes="(max-width: 800px) 100vw, 50vw"
            priority={priority}
          />
        </div>
      );
    }

    return <PostArtwork artKey={artKey} label={label} variant="bare" />;
  }

  if (imageUrl) {
    return (
      <div className="cover-art post-media">
        <Image
          src={imageUrl}
          alt={imageAlt || label || "Imagem do artigo"}
          fill
          className="post-media-image"
          sizes="(max-width: 900px) 100vw, 33vw"
          priority={priority}
        />
      </div>
    );
  }

  return <PostArtwork artKey={artKey} label={label} />;
}
