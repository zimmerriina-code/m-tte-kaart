interface Props {
  className?: string;
  reduced?: boolean;
}

// Horizontal flowing "thought-threads" — tangled and layered on the left,
// gradually becoming calmer and more structured on the right. Mirrors the
// homepage mockup language and shares the same loose-loop vocabulary as the logo.
export function FlowingLines({ className, reduced = false }: Props) {
  // Each line has its own resting y, amplitude and frequency.
  // We taper amplitude/frequency along x so the right side becomes calm.
  const lines = [
    { y: 300, ampL: 46, ampR: 6, kL: 2.6, kR: 0.7, w: 1.2, o: 0.42, phase: 0.0 },
    { y: 340, ampL: 60, ampR: 8, kL: 2.2, kR: 0.6, w: 1.6, o: 0.55, phase: 0.6 },
    { y: 380, ampL: 38, ampR: 5, kL: 3.0, kR: 0.5, w: 1.0, o: 0.34, phase: 1.2 },
    { y: 420, ampL: 70, ampR: 10, kL: 1.9, kR: 0.7, w: 1.8, o: 0.62, phase: 0.3 },
    { y: 460, ampL: 44, ampR: 6, kL: 2.4, kR: 0.6, w: 1.2, o: 0.4, phase: 1.7 },
    { y: 500, ampL: 34, ampR: 4, kL: 2.8, kR: 0.5, w: 0.9, o: 0.3, phase: 2.2 },
    { y: 540, ampL: 56, ampR: 7, kL: 2.0, kR: 0.6, w: 1.4, o: 0.46, phase: 0.9 },
  ];

  const extras = !reduced
    ? [
        { y: 260, ampL: 28, ampR: 3, kL: 3.4, kR: 0.4, w: 0.8, o: 0.24, phase: 1.4 },
        { y: 580, ampL: 40, ampR: 5, kL: 2.6, kR: 0.5, w: 1.0, o: 0.32, phase: 2.0 },
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
          <stop offset="0%" stopColor="oklch(0.72 0.09 285)" stopOpacity="0.15" />
          <stop offset="18%" stopColor="oklch(0.55 0.12 290)" stopOpacity="0.85" />
          <stop offset="55%" stopColor="oklch(0.45 0.13 285)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="thread-soft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.72 0.09 285)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="oklch(0.62 0.11 290)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.74 0.09 285)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Slow horizontal drift — applied to whole groups, not text */}
      <g className="animate-flow-x">
        {[...lines, ...extras].map((l, i) => (
          <SinePath key={"a-" + i} l={l} grad="url(#thread-fade)" />
        ))}
      </g>

      <g className="animate-flow-x-reverse" opacity="0.6">
        {lines.slice(0, 4).map((l, i) => (
          <SinePath
            key={"b-" + i}
            l={{ ...l, y: l.y + 8, ampL: l.ampL * 0.55, ampR: l.ampR * 0.4, phase: l.phase + 1.1, w: l.w * 0.7, o: l.o * 0.7 }}
            grad="url(#thread-soft)"
          />
        ))}
      </g>
    </svg>
  );
}

function SinePath({
  l,
  grad,
}: {
  l: { y: number; ampL: number; ampR: number; kL: number; kR: number; w: number; o: number; phase: number };
  grad: string;
}) {
  // Build a path that is tangled (high amp + freq) on the left and calm on the right.
  const points: { x: number; y: number }[] = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0..1 across width
    const x = t * 1600;
    // Smooth ease from left-mode to right-mode
    const e = t * t * (3 - 2 * t); // smoothstep
    const amp = l.ampL * (1 - e) + l.ampR * e;
    const k = l.kL * (1 - e) + l.kR * e;
    const phase = l.phase + t * Math.PI * 2 * k;
    // Slight envelope so very edges fade calm
    const edge = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
    const y = l.y + Math.sin(phase) * amp * (0.55 + 0.45 * edge);
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
      stroke="#4F46E5"
      strokeWidth={4}
      strokeLinecap="round"
      fill="none"
      opacity={1}
      className="animate-breathe"
      style={{ animationDuration: `${8 + (l.phase % 3) * 2}s` }}
    />
  );
}
