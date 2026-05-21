interface Props {
  className?: string;
  reduced?: boolean;
}

// Abstract flowing thought-lines. Tangled left → clearer right.
// Lines breathe softly, drift slowly, and one path briefly forms the logo-like loop.
export function FlowingLines({ className, reduced = false }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="line-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0.15" />
          <stop offset="45%" stopColor="oklch(0.55 0.13 285)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.45 0.13 285)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="line-fade-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.55 0.13 285)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="line-fade-3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="oklch(0.45 0.13 285)" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Tangled, loose strokes on the left — many overlapping thoughts */}
      <g className="animate-drift-slow">
        <path
          d="M -30 360 C 60 290, 70 460, 170 410 C 240 380, 180 270, 270 310 C 330 340, 280 430, 360 410"
          stroke="url(#line-fade)" strokeWidth="1.3" opacity="0.55" strokeLinecap="round"
        />
        <path
          d="M 30 300 C 110 260, 90 410, 210 360 C 280 330, 220 240, 320 280"
          stroke="oklch(0.74 0.09 285)" strokeWidth="0.9" opacity="0.45" strokeLinecap="round"
        />
        <path
          d="M -10 440 C 80 420, 70 500, 200 470 C 260 458, 230 530, 340 500"
          stroke="oklch(0.74 0.09 285)" strokeWidth="0.8" opacity="0.4" strokeLinecap="round"
        />
        {!reduced && (
          <>
            <path
              d="M 20 240 C 100 220, 130 320, 240 290 C 310 270, 280 210, 360 230"
              stroke="oklch(0.62 0.11 290)" strokeWidth="0.7" opacity="0.35" strokeLinecap="round"
            />
            <path
              d="M 0 520 C 90 500, 100 580, 220 560 C 290 548, 260 600, 360 590"
              stroke="oklch(0.74 0.09 285)" strokeWidth="0.7" opacity="0.3" strokeLinecap="round"
            />
          </>
        )}
      </g>

      {/* Main flowing thought-line — winds across, forms a brief logo-like loop mid-way */}
      <g className="animate-drift">
        <path
          d="M -40 380
             C 120 330, 150 440, 290 390
             C 420 345, 380 250, 530 270
             C 600 280, 600 340, 660 340
             C 720 340, 720 290, 680 270
             C 640 250, 640 320, 700 330
             C 800 345, 820 250, 940 270
             C 1040 285, 1100 320, 1240 305"
          stroke="url(#line-fade)" strokeWidth="2.1" strokeLinecap="round"
          className="animate-breathe"
        />
      </g>

      {/* Clearer strokes on the right — thought becoming structured */}
      <g>
        <path
          d="M 560 430 C 720 420, 820 390, 970 390 C 1080 390, 1150 408, 1240 398"
          stroke="url(#line-fade-3)" strokeWidth="1.7" opacity="0.75" strokeLinecap="round"
          className="animate-breathe-slow"
        />
        {!reduced && (
          <>
            <path
              d="M 640 490 C 780 478, 880 462, 1000 465 C 1100 468, 1160 485, 1240 478"
              stroke="oklch(0.55 0.13 285)" strokeWidth="1.1" opacity="0.5" strokeLinecap="round"
            />
            <path
              d="M 700 200 C 820 220, 900 200, 1020 220 C 1120 236, 1180 220, 1240 232"
              stroke="oklch(0.62 0.11 290)" strokeWidth="0.9" opacity="0.35" strokeLinecap="round"
            />
          </>
        )}
      </g>

      {/* Downward continuation into next section */}
      {!reduced && (
        <g opacity="0.5">
          <path
            d="M 280 800 C 360 720, 320 640, 440 600"
            stroke="url(#line-fade-2)" strokeWidth="1" strokeLinecap="round"
          />
          <path
            d="M 920 800 C 880 720, 960 660, 880 590"
            stroke="url(#line-fade-2)" strokeWidth="1" strokeLinecap="round"
          />
          <path
            d="M 600 800 C 620 720, 580 660, 620 580"
            stroke="url(#line-fade-2)" strokeWidth="0.8" strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
