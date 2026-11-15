// falling snow behind everything. Fixed positions so server and browser render the same thing
const FLAKES = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 2 + ((i * 7) % 4),
  duration: 9 + ((i * 13) % 10),
  delay: -((i * 5.3) % 18),
  opacity: 0.35 + ((i * 3) % 5) / 10,
}));

export default function Snow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="absolute -top-4 animate-fall rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
