// Original flat illustrations drawn with SVG (no photos, so no copyright to worry about).
// They all use the site colours: navy #12263a, cobalt #2b50e6, yellow #ffe45c.

const NAVY = "#12263a"
const COBALT = "#2b50e6"
const YELLOW = "#ffe45c"
const SOFT = "#e8edfd"

/** Step 1: a weekly timetable with the free hours highlighted. */
export function FreeHoursIllustration() {
  const free = new Set(["0-1", "1-2", "2-0", "2-3", "3-1", "1-3"])
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" role="img" aria-label="Timetable with free hours highlighted">
      <rect x="6" y="8" width="148" height="104" rx="12" fill={SOFT} />
      <rect x="18" y="20" width="124" height="80" rx="8" fill="#fff" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={28 + col * 28}
            y={30 + row * 17}
            width="22"
            height="12"
            rx="3"
            fill={free.has(`${row}-${col}`) ? YELLOW : "#eef1f6"}
          />
        ))
      )}
      <circle cx="136" cy="22" r="11" fill={COBALT} />
      <path d="M130.5 22.5l3.4 3.4 6-6.4" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Step 2: a job card with a magnifying glass. */
export function FindJobIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" role="img" aria-label="Searching for a job">
      <rect x="6" y="8" width="148" height="104" rx="12" fill="#fff4bf" />
      <rect x="20" y="22" width="92" height="22" rx="6" fill="#fff" />
      <rect x="26" y="29" width="8" height="8" rx="2" fill="#c2306f" />
      <rect x="40" y="29" width="46" height="4" rx="2" fill={NAVY} />
      <rect x="40" y="36" width="30" height="3" rx="1.5" fill="#b8c2d0" />
      <rect x="20" y="50" width="92" height="22" rx="6" fill="#fff" />
      <rect x="26" y="57" width="8" height="8" rx="2" fill="#15805a" />
      <rect x="40" y="57" width="38" height="4" rx="2" fill={NAVY} />
      <rect x="40" y="64" width="52" height="3" rx="1.5" fill="#b8c2d0" />
      <rect x="20" y="78" width="60" height="22" rx="6" fill="#fff" opacity="0.7" />
      <circle cx="116" cy="74" r="18" fill="#fff" stroke={NAVY} strokeWidth="5" />
      <path d="M129 87l16 16" stroke={NAVY} strokeWidth="7" strokeLinecap="round" />
      <path d="M108 74a8 8 0 0 1 8-8" stroke={COBALT} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** Step 3: a cover letter and an accepted tick. */
export function GetHiredIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="h-full w-full" role="img" aria-label="Application accepted">
      <rect x="6" y="8" width="148" height="104" rx="12" fill="#dff5ea" />
      <rect x="30" y="18" width="84" height="88" rx="8" fill="#fff" />
      <rect x="40" y="30" width="44" height="5" rx="2.5" fill={NAVY} />
      <rect x="40" y="43" width="64" height="3.5" rx="1.75" fill="#b8c2d0" />
      <rect x="40" y="52" width="58" height="3.5" rx="1.75" fill="#b8c2d0" />
      <rect x="40" y="61" width="64" height="3.5" rx="1.75" fill="#b8c2d0" />
      <rect x="40" y="70" width="40" height="3.5" rx="1.75" fill="#b8c2d0" />
      <rect x="40" y="86" width="32" height="10" rx="5" fill={YELLOW} />
      <circle cx="116" cy="38" r="22" fill="#15805a" />
      <path d="M105 38.5l8 8 14-15" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Shown when a search finds no jobs. */
export function EmptyIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="mx-auto h-28 w-40" role="img" aria-label="No jobs found">
      <ellipse cx="80" cy="104" rx="52" ry="7" fill="#e3e8ef" />
      <rect x="38" y="24" width="84" height="66" rx="10" fill="#fff" stroke="#c9d2de" strokeWidth="2" />
      <rect x="50" y="38" width="38" height="5" rx="2.5" fill="#c9d2de" />
      <rect x="50" y="50" width="60" height="4" rx="2" fill="#e3e8ef" />
      <rect x="50" y="60" width="52" height="4" rx="2" fill="#e3e8ef" />
      <circle cx="104" cy="74" r="14" fill="#fff" stroke={COBALT} strokeWidth="4" />
      <path d="M114 84l12 12" stroke={COBALT} strokeWidth="5" strokeLinecap="round" />
      <path d="M99 74h10" stroke={COBALT} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Big picture for the login / register side panel: a student at a desk with a timetable. */
export function AuthIllustration() {
  const cells: Array<[number, number, boolean]> = [
    [0, 0, false], [1, 0, true], [2, 0, false], [3, 0, true],
    [0, 1, true], [1, 1, true], [2, 1, false], [3, 1, false],
    [0, 2, false], [1, 2, false], [2, 2, true], [3, 2, true],
  ]
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="Student planning free hours">
      {/* timetable board */}
      <rect x="28" y="20" width="176" height="110" rx="12" fill="#fff" />
      {cells.map(([c, r, on]) => (
        <rect key={`${c}-${r}`} x={44 + c * 40} y={34 + r * 30} width="32" height="20" rx="5" fill={on ? YELLOW : "#eef1f6"} />
      ))}
      {/* floating job card */}
      <g transform="translate(196 58)">
        <rect width="124" height="64" rx="12" fill={COBALT} />
        <rect x="14" y="14" width="56" height="7" rx="3.5" fill="#fff" />
        <rect x="14" y="28" width="86" height="5" rx="2.5" fill="#fff" opacity="0.55" />
        <rect x="14" y="40" width="60" height="5" rx="2.5" fill="#fff" opacity="0.55" />
        <rect x="84" y="12" width="26" height="14" rx="7" fill={YELLOW} />
      </g>
      {/* desk */}
      <rect x="20" y="196" width="280" height="10" rx="5" fill="#0b1826" opacity="0.5" />
      {/* student */}
      <circle cx="86" cy="150" r="17" fill="#f2c9a5" />
      <path d="M69 148c0-12 8-20 18-20s17 7 17 18c-6-5-14-6-22-4-5 1-9 3-13 6z" fill="#0b1826" />
      <path d="M52 198c0-22 15-38 34-38s34 16 34 38H52z" fill={YELLOW} />
      {/* laptop */}
      <rect x="112" y="170" width="70" height="26" rx="4" fill="#dbe3ee" />
      <rect x="118" y="175" width="58" height="16" rx="2" fill={NAVY} />
      <rect x="104" y="196" width="86" height="5" rx="2.5" fill="#9fb0c6" />
      {/* plant */}
      <rect x="248" y="170" width="24" height="26" rx="4" fill="#c2306f" />
      <path d="M260 170c-14-6-18-22-12-34 12 6 18 18 12 34zM260 170c12-8 22-6 28-18-14-2-24 4-28 18z" fill="#15805a" />
    </svg>
  )
}
