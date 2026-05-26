type Props = {
  title: string;
  coverUrl?: string;
  badge?: string;
  className?: string;
  imageClassName?: string;
};

function initials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "C";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function CourseCoverImage({
  title,
  coverUrl,
  badge,
  className = "",
  imageClassName = "object-cover",
}: Props) {
  if (coverUrl) {
    return (
      <div className={`relative overflow-hidden bg-gray-light ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverUrl} alt="" className={`w-full h-full ${imageClassName}`} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-purple/90 to-black flex items-center justify-center ${className}`}
      aria-hidden
    >
      <span className="text-white/90 text-2xl font-semibold tracking-wide">
        {badge || initials(title)}
      </span>
    </div>
  );
}
