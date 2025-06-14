export default function RandomCirclesOverlay() {
  const circlesCount = 15;

  const circles = Array.from({ length: circlesCount }).map((_, i) => {
    const cx = Math.random() * 100;
    const cy = Math.random() * 100;
    const r = 2 + Math.random() * 100;
    const opacity = 0.01 + Math.random() * 0.04;

    return (
      <circle
        key={i}
        cx={`${cx}%`}
        cy={`${cy}%`}
        r={r}
        fill="hsl(var(--mc-background))"
        fillOpacity={opacity}
      />
    );
  });

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg width="100%" height="100%" className="opacity-70 blur-[2px]">
        {circles}
      </svg>
    </div>
  );
}

export function RandomCirclesOverlay2() {
  const circlesCount = 70;

  const circles = Array.from({ length: circlesCount }).map((_, i) => {
    const cx = Math.random() * 100;
    const cy = Math.random() * 100;
    const r = 1 + Math.random() * 15;
    const opacity = 0.01 + Math.random() * 0.04;

    return (
      <circle
        key={i}
        cx={`${cx}%`}
        cy={`${cy}%`}
        r={r}
        fill="hsl(var(--mc-background))"
        fillOpacity={opacity}
      />
    );
  });

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg width="70%" height="50%" className="opacity-90 blur-[2px]">
        {circles}
      </svg>
    </div>
  );
}
