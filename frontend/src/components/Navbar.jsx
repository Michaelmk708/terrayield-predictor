export default function Navbar({ view, setView }) {
  return (
    <nav className="navbar">
      <button className="navbar-logo" onClick={() => setView("home")}>
        <span className="logo-leaf">⟁</span>
        <span className="logo-text">TERRA<span className="logo-accent">YIELD</span></span>
      </button>
      <div className="navbar-links">
        <button
          className={`nav-link ${view === "home" ? "active" : ""}`}
          onClick={() => setView("home")}
        >
          Overview
        </button>
        <button
          className={`nav-link ${view === "predictor" ? "active" : ""}`}
          onClick={() => setView("predictor")}
        >
          Predictor
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
        >
          Docs
        </a>
      </div>
    </nav>
  );
}
