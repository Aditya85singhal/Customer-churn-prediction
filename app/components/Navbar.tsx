export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <RadarMark />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Churn Radar
          </span>
        </a>

        <nav className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
          <a href="#predict" className="hover:text-[var(--text)] transition-colors">
            Predict
          </a>
          <a href="#about" className="hover:text-[var(--text)] transition-colors">
            How it works
          </a>
          <a
            href="https://github.com/Aditya85singhal/Customer-churn-prediction"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text)] transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function RadarMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="9.5" stroke="var(--brand)" strokeWidth="1.4" />
      <circle cx="11" cy="11" r="5.5" stroke="var(--brand)" strokeWidth="1" opacity="0.5" />
      <circle cx="11" cy="11" r="1.6" fill="var(--brand)" />
    </svg>
  );
}
