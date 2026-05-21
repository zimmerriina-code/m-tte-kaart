interface Props {
  className?: string;
  reduced?: boolean; // simpler on mobile
}

// Abstract flowing thought-lines. Tangled left → clearer right.
// Lines breathe softly and drift; one path briefly forms the logo-like loop.
export function FlowingLines({ className, reduced = false }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 700"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="line-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="oklch(0.55 0.13 285)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.45 0.13 285)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="line-fade-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.55 0.13 285)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Tangled, loose strokes on the left */}
      <g className="animate-drift-slow" style={{ transformOrigin: "center" }}>
        <path
          d="M -20 380 C 80 300, 60 460, 160 400 C 230 360, 180 280, 260 320 C 320 350, 280 420, 340 400"
          stroke="url(#line-fade)" strokeWidth="1.2" opacity="0.55" strokeLinecap="round"
        />
        <path
          d="M 40 320 C 120 280, 90 400, 200 360 C 260 340, 220 260, 300 290"
          stroke="oklch(0.74 0.09 285)" strokeWidth="0.9" opacity="0.4" strokeLinecap="round"
        />
        {!reduced && (
          <path
            d="M 0 440 C 80 420, 70 480, 180 460 C 240 450, 210 510, 320 480"
            stroke="oklch(0.74 0.09 285)" strokeWidth="0.8" opacity="0.35" strokeLinecap="round"
          />
        )}
      </g>

      {/* Main flowing thought-line — forms a brief logo-like loop mid-way */}
      <g className="animate-drift" style={{ transformOrigin: "center" }}>
        <path
          d="M -40 360
             C 120 320, 140 420, 280 380
             C 420 340, 400 260, 540 280
             C 640 295, 620 360, 720 340
             C 820 320, 820 240, 920 260
             C 1020 280, 1080 320, 1240 300"
          stroke="url(#line-fade)" strokeWidth="2" strokeLinecap="round"
          className="animate-breathe"
        />
      </g>

      {/* Clearer stroke on the right — thought becoming structured */}
      <g>
        <path
          d="M 600 420 C 740 410, 820 380, 960 380 C 1080 380, 1140 400, 1240 390"
          stroke="oklch(0.45 0.13 285)" strokeWidth="1.6" opacity="0.7" strokeLinecap="round"
          className="animate-breathe"
        />
        {!reduced && (
          <path
            d="M 680 470 C 800 460, 880 445, 1000 450 C 1100 454, 1160 470, 1240 462"
            stroke="oklch(0.55 0.13 285)" strokeWidth="1.1" opacity="0.5" strokeLinecap="round"
          />
        )}
      </g>

      {/* Downward continuation into next section */}
      {!reduced && (
        <g opacity="0.5">
          <path
            d="M 300 700 C 360 640, 320 580, 420 560"
            stroke="url(#line-fade-2)" strokeWidth="1" strokeLinecap="round"
          />
          <path
            d="M 900 700 C 860 640, 940 600, 880 540"
            stroke="url(#line-fade-2)" strokeWidth="1" strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
