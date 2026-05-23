interface Props {
  className?: string;
  reduced?: boolean;
}

// Horizontal flowing thought-lines, tangled in the middle (logo-like loop),
// smoothing out at the edges. Inspired by the homepage mockup.
export function FlowingLines({ className, reduced = false }: Props) {
  // A set of horizontal sinusoidal paths spanning the full width.
  // Each line has its own amplitude, phase, thickness, opacity.
  const lines = [
    { y: 320, amp: 28, k: 1.3, w: 1.0, o: 0.32, hue: 285, phase: 0 },
    { y: 360, amp: 38, k: 1.0, w: 1.4, o: 0.45, hue: 282, phase: 0.4 },
    { y: 400, amp: 24, k: 1.6, w: 0.9, o: 0.28, hue: 290, phase: 1.1 },
    { y: 430, amp: 46, k: 0.9, w: 1.6, o: 0.55, hue: 278, phase: 0.8 },
    { y: 470, amp: 32, k: 1.2, w: 1.1, o: 0.38, hue: 286, phase: 1.5 },
    { y: 500, amp: 22, k: 1.7, w: 0.8, o: 0.25, hue: 290, phase: 2.1 },
    { y: 540, amp: 40, k: 1.0, w: 1.3, o: 0.42, hue: 280, phase: 0.2 },
  ];

  // Extras for richer left/right "siiruviirulised" texture
  const extras = !reduced
    ? [
        { y: 280, amp: 18, k: 2.1, w: 0.7, o: 0.2, hue: 290, phase: 1.7 },
        { y: 580, amp: 30, k: 1.4, w: 0.9, o: 0.3, hue: 285, phase: 2.4 },
        { y: 250, amp: 14, k: 2.4, w: 0.6, o: 0.18, hue: 292, phase: 0.6 },
        { y: 610, amp: 24, k: 1.8, w: 0.8, o: 0.24, hue: 282, phase: 1.9 },
      ]
    : [];

  return (
    <svg
      className={className}
      viewBox="0 0 1600 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="thread-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0" />
          <stop offset="12%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.6" />
          <stop offset="50%" stopColor="oklch(0.45 0.13 285)" stopOpacity="0.95" />
          <stop offset="88%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="thread-soft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Slow horizontal flow group — gentle left-right drift */}
      <g className="animate-flow-x">
        {[...lines, ...extras].map((l, i) => (
          <SinePath key={"a-" + i} l={l} grad="url(#thread-fade)" />
        ))}
      </g>

      {/* Counter-drifting softer layer adds depth */}
      <g className="animate-flow-x-reverse" opacity="0.7">
        {lines.slice(0, 4).map((l, i) => (
          <SinePath
            key={"b-" + i}
            l={{ ...l, y: l.y + 6, amp: l.amp * 0.7, phase: l.phase + 1.2, w: l.w * 0.75, o: l.o * 0.7 }}
            grad="url(#thread-soft)"
          />
        ))}
      </g>

      {/* Central tangled "thought-knot" — the logo-like loop integrated into the flow */}
      <g
        className="animate-breathe-slow"
        transform="translate(800 430)"
      >
        <g style={{ animation: "spin-slow 60s linear infinite", transformOrigin: "0 0" }}>
          <path
            d="M -48 0 C -48 -28, -24 -36, -2 -30 C 22 -22, 30 4, 14 14 C -4 26, -28 18, -22 -2 C -16 -18, 4 -22, 18 -10 C 32 4, 28 22, 12 26 C -8 32, -34 22, -38 4"
            stroke="oklch(0.45 0.13 285)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M -36 -8 C -28 -22, -8 -24, 6 -16 C 22 -6, 24 12, 8 18 C -8 24, -26 14, -22 -2"
            stroke="oklch(0.55 0.13 285)"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </g>
      </g>
    </svg>
  );
}

function SinePath({
  l,
  grad,
}: {
  l: { y: number; amp: number; k: number; w: number; o: number; phase: number };
  grad: string;
}) {
  // Build a smooth sinusoidal path with cubic Bezier segments across viewBox 0..1600.
  // Amplitude tapers at the very edges so lines feel softer there.
  const points: { x: number; y: number }[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 1600;
    const t = (x / 1600) * Math.PI * 2 * l.k + l.phase;
    // Slightly more amplitude in the middle, less at edges
    const edge = Math.sin((i / steps) * Math.PI); // 0..1..0
    const y = l.y + Math.sin(t) * l.amp * (0.4 + 0.6 * edge);
    points.push({ x, y });
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` Q ${cx} ${p0.y}, ${cx} ${(p0.y + p1.y) / 2} T ${p1.x} ${p1.y}`;
  }
  return (
    <path
      d={d}
      stroke={grad}
      strokeWidth={l.w}
      strokeLinecap="round"
      fill="none"
      opacity={l.o}
      className="animate-breathe"
      style={{ animationDuration: `${8 + (l.phase % 3) * 2}s` }}
    />
  );
}
