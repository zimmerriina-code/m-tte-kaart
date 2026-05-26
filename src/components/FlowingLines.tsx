interface Props {
  className?: string;
}

/**
 * Soft wave-like thought-streams that flow horizontally across the hero.
 * Each layer is a seamless sine path duplicated so a translateX animation
 * loops without seams. Subtle, sits behind the text.
 */
export function FlowingLines({ className }: Props) {
  // Each entry: a seamless sine-ish path, stroke, width, opacity, duration, direction.
  const layers: Array<{
    d: string;
    stroke: string;
    w: number;
    opacity: number;
    dur: number;
    dir: 1 | -1;
  }> = [
    {
      // gentle high wave
      d: wave(0, 1600, 260, 90, 320, 0),
      stroke: "#6E5BE0",
      w: 1.6,
      opacity: 0.55,
      dur: 26,
      dir: -1,
    },
    {
      // primary mid wave — most visible
      d: wave(0, 1600, 420, 120, 400, 60),
      stroke: "#4F46E5",
      w: 2.2,
      opacity: 0.7,
      dur: 32,
      dir: 1,
    },
    {
      // counter wave that occasionally crosses the primary
      d: wave(0, 1600, 470, 100, 360, 180),
      stroke: "#7C6EE6",
      w: 1.4,
      opacity: 0.5,
      dur: 38,
      dir: -1,
    },
    {
      // soft low wave
      d: wave(0, 1600, 620, 80, 300, 90),
      stroke: "#9B8DEC",
      w: 1.2,
      opacity: 0.42,
      dur: 30,
      dir: 1,
    },
    {
      // very low pale wave
      d: wave(0, 1600, 720, 60, 280, 240),
      stroke: "#B8AEEF",
      w: 1,
      opacity: 0.32,
      dur: 44,
      dir: -1,
    },
  ];

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1600 800"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="none"
      >
        {layers.map((l, i) => (
          <g
            key={i}
            style={{
              animation: `flow-wave-${l.dir === 1 ? "r" : "l"} ${l.dur}s linear infinite`,
            }}
          >
            {/* duplicated path — second copy shifted by +1600 so loop is seamless */}
            <path
              d={l.d}
              stroke={l.stroke}
              strokeWidth={l.w}
              strokeLinecap="round"
              fill="none"
              opacity={l.opacity}
            />
            <path
              d={shiftPath(l.d, 1600)}
              stroke={l.stroke}
              strokeWidth={l.w}
              strokeLinecap="round"
              fill="none"
              opacity={l.opacity}
            />
          </g>
        ))}
      </svg>

      {/* soft veil to keep hero text readable */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(250,250,253,0.78) 0%, rgba(250,250,253,0.55) 40%, rgba(250,250,253,0.15) 75%, rgba(250,250,253,0) 100%)",
        }}
      />

      <style>{`
        @keyframes flow-wave-l {
          0% { transform: translateX(0); }
          100% { transform: translateX(-1600px); }
        }
        @keyframes flow-wave-r {
          0% { transform: translateX(-1600px); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="flow-wave"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/**
 * Build a smooth seamless sine wave path from x=startX to x=startX+length
 * centered at baseY, with given amplitude and wavelength.
 * Slight phase variation makes some sections look gently tangled.
 */
function wave(
  startX: number,
  length: number,
  baseY: number,
  amplitude: number,
  wavelength: number,
  phase: number,
): string {
  const segments = Math.ceil(length / (wavelength / 4));
  const step = length / segments;
  let d = `M ${startX} ${baseY + amplitude * Math.sin((2 * Math.PI * (startX + phase)) / wavelength)}`;
  for (let i = 1; i <= segments; i++) {
    const x0 = startX + (i - 1) * step;
    const x1 = startX + i * step;
    const y0 = baseY + amplitude * Math.sin((2 * Math.PI * (x0 + phase)) / wavelength);
    const y1 = baseY + amplitude * Math.sin((2 * Math.PI * (x1 + phase)) / wavelength);
    // control points for a soft cubic — gives a smoother, more "thought-stream" feel
    const cx0 = x0 + step / 2;
    const cx1 = x1 - step / 2;
    d += ` C ${cx0} ${y0}, ${cx1} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

/**
 * Shift the M/C path commands by dx on the x axis so the duplicate joins seamlessly.
 */
function shiftPath(d: string, dx: number): string {
  return d.replace(/([MC])\s*([-\d.]+)\s+([-\d.]+)(?:,\s*([-\d.]+)\s+([-\d.]+),\s*([-\d.]+)\s+([-\d.]+))?/g,
    (_m, cmd, a, b, c, dY, e, f) => {
      if (cmd === "M") return `M ${parseFloat(a) + dx} ${b}`;
      return `C ${parseFloat(a) + dx} ${b}, ${parseFloat(c) + dx} ${dY}, ${parseFloat(e) + dx} ${f}`;
    },
  );
}
