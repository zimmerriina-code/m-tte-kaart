interface Props {
  className?: string;
  reduced?: boolean;
}

export function FlowingLines({ className, reduced = false }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* back layer */}
      <g className={reduced ? "" : "animate-flow-x-slow"}>
        <path
          d="M -120 520 C 140 320, 340 710, 620 500 S 1080 300, 1720 560"
          stroke="#8E82F0"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.34"
          fill="none"
        />
        <path
          d="M -120 690 C 180 520, 430 820, 760 690 S 1200 520, 1720 700"
          stroke="#9D92F5"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.26"
          fill="none"
        />
      </g>

      {/* middle layer */}
      <g className={reduced ? "" : "animate-flow-x-reverse-slow"}>
        <path
          d="M -120 600 C 180 430, 420 760, 760 600 S 1220 420, 1720 640"
          stroke="#6D60E8"
          strokeWidth="4.6"
          strokeLinecap="round"
          opacity="0.9"
          fill="none"
        />
        <path
          d="M -120 420 C 180 300, 430 560, 760 420 S 1220 300, 1720 490"
          stroke="#B0A7F8"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.32"
          fill="none"
        />
      </g>

      {/* front subtle line */}
      <g className={reduced ? "" : "animate-flow-x-soft"}>
        <path
          d="M -120 760 C 160 610, 420 860, 780 760 S 1240 640, 1720 790"
          stroke="#7A6EEC"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.22"
          fill="none"
        />
      </g>
    </svg>
  );
}
