// Small timetable-grid mark: two highlighted cells = "free hours"
export default function Logo({ size = 30 }: { size?: number }) {
  const cells = [
    [5, 5], [13, 5], [21, 5],
    [5, 13], [21, 13],
    [5, 21], [13, 21],
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#12263a" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1.5" fill="#fff" fillOpacity="0.35" />
      ))}
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#ffe45c" />
      <rect x="21" y="21" width="6" height="6" rx="1.5" fill="#ffe45c" />
    </svg>
  )
}