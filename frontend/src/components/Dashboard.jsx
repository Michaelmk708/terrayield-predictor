const FEATURES = [
  {
    icon: "◈",
    title: "Data Analysis",
    desc: "Multi-variable soil, satellite, and climate datasets processed in real-time to surface the highest-yield crop strategies for your exact coordinates.",
    stat: "200+ Variables",
  },
  {
    icon: "◬",
    title: "Climate Monitoring",
    desc: "Live integration with global weather APIs and seasonal forecasting models. Track rainfall, temperature swings, and humidity trends that matter most.",
    stat: "15-Day Forecast",
  },
  {
    icon: "⬡",
    title: "Predictive Modeling",
    desc: "Machine-learning models trained on decades of agronomic data give you confidence scores for each crop, ranked by your region's specific conditions.",
    stat: "94% Accuracy",
  },
];

const STATS = [
  { value: "1.2M+", label: "Predictions Run" },
  { value: "47", label: "Countries Supported" },
  { value: "320+", label: "Crop Varieties" },
  { value: "94%", label: "Model Accuracy" },
];

export default function Dashboard({ onLaunch }) {
  return (
    <main className="dashboard">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-grid-overlay" aria-hidden="true" />
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Agriculture Intelligence
          </div>

          <h1 className="hero-title">
            <span className="title-line">TERRA</span>
            <span className="title-line title-accent">YIELD</span>
          </h1>

          <p className="hero-subtitle">
            Grow with confidence, maximize your yield, and harvest smarter.
            Capitalize on seasonal trends and climate changes with data-driven
            crop recommendations built for the modern farmer.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onLaunch}>
              <span>Open Predictor</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-ghost">
              Watch Demo
            </button>
          </div>

          <div className="hero-stats">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="globe-ring globe-ring-1" />
          <div className="globe-ring globe-ring-2" />
          <div className="globe-ring globe-ring-3" />
          <div className="globe-core">
            <span className="globe-icon">⟁</span>
          </div>
          <div className="globe-dot globe-dot-1" />
          <div className="globe-dot globe-dot-2" />
          <div className="globe-dot globe-dot-3" />
          <div className="globe-dot globe-dot-4" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">Three pillars of precision agriculture</h2>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ "--delay": `${i * 0.1}s` }}>
              <div className="feature-header">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-stat">{f.stat}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-bar">
                <div className="feature-bar-fill" style={{ "--w": i === 0 ? "85%" : i === 1 ? "72%" : "94%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────── */}
      <section className="cta-strip">
        <div className="cta-content">
          <h2 className="cta-title">Ready to grow smarter?</h2>
          <p className="cta-sub">Enter your coordinates and get crop recommendations in seconds.</p>
        </div>
        <button className="btn-primary btn-lg" onClick={onLaunch}>
          Launch Predictor <span className="btn-arrow">→</span>
        </button>
      </section>

      <footer className="footer">
        <span className="footer-logo">⟁ TERRAYIELD</span>
        <span className="footer-copy">© {new Date().getFullYear()} · Built for the modern farmer</span>
      </footer>
    </main>
  );
}
