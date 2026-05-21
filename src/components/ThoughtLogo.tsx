interface Props {
  className?: string;
}

// Single flowing thought-line that loops and clarifies — abstract, not a compass.
export function ThoughtLogo({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 28 C 8 22, 6 14, 14 14 C 22 14, 22 26, 30 24 C 36 22.5, 36 16, 32 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
