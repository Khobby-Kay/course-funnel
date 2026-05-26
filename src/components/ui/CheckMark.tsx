type Props = {
  className?: string;
};

export default function CheckMark({ className = "w-4 h-4" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="8" r="8" className="fill-purple/10" />
      <path
        d="M4.5 8.2 6.8 10.5 11.5 5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple"
      />
    </svg>
  );
}
