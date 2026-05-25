import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

const variants = {
  primary:
    "bg-gold text-black hover:bg-gold-hover shadow-lg shadow-gold/25 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold",
  secondary:
    "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
    "bg-transparent text-purple border-2 border-purple hover:bg-purple hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  children,
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !disabled) {
    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} aria-label={ariaLabel}>
          {children}
        </a>
      );
    }

    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}