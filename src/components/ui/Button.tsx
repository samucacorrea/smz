import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "dark";
type ButtonSize = "default" | "sm";

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type LinkButtonProps = BaseButtonProps & {
  href: string;
  target?: string;
  rel?: string;
};

type NativeButtonProps = BaseButtonProps & {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

function getButtonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
  className?: string,
) {
  const sizeClassName = size === "sm" ? "btn-sm" : "";
  return ["btn", `btn-${variant}`, sizeClassName, className].filter(Boolean).join(" ");
}

export function ButtonLink({
  children,
  className,
  href,
  rel,
  size = "default",
  target,
  variant = "primary",
}: LinkButtonProps) {
  const buttonClassName = getButtonClassName(variant, size, className);
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (isExternal) {
    return (
      <a href={href} target={target} rel={rel} className={buttonClassName}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClassName}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  className,
  disabled,
  onClick,
  size = "default",
  type = "button",
  variant = "primary",
}: NativeButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassName(variant, size, className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
