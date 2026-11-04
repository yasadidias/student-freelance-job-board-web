const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"]
const ROW_LABELS = ["8am", "10am", "12pm", "2pm", "4pm", "6pm"]

// 1 = free hour. Only used for the hero picture.
const SAMPLE: number[][] = [
  [0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 0, 0],
  [1, 1, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
]

export default function HeroTimetable() {
  return (
    <figure className="mx-auto w-full max-w-sm rounded-xl bg-white p-5 text-ink shadow-2xl shadow-black/30">
      <div
        role="img"
        aria-label="Example weekly timetable with the free hours highlighted in yellow"
        className="grid grid-cols-[2.5rem_repeat(7,1fr)] gap-1.5"
      >
        <span />
        {DAY_LETTERS.map((letter, i) => (
          <span key={i} className="text-center text-xs font-semibold text-slate-500">
            {letter}
          </span>
        ))}
        {SAMPLE.map((row, r) => (
          <div key={r} className="contents">
            <span className="self-center text-right text-[11px] text-slate-500">{ROW_LABELS[r]}</span>
            {row.map((free, c) =>
              free ? (
                <span
                  key={c}
                  className="hero-cell h-7 rounded bg-hl"
                  style={{ animationDelay: `${300 + (r + c) * 70}ms` }}
                />
              ) : (
                <span key={c} className="h-7 rounded bg-slate-100" />
              )
            )}
          </div>
        ))}
      </div>
      <figcaption className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
        Yellow hours are when you are free. Clients see this on your application.
      </figcaption>
    </figure>
  )
}