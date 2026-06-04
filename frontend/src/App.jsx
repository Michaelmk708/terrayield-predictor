import { useState } from "react";
import Dashboard from "./components/Dashboard";
import PredictorWorkspace from "./components/PredictorWorkspace";
import Navbar from "./components/Navbar";

export default function App() {
  const [view, setView] = useState("home"); // "home" | "predictor"

  return (
    <div className="app-root">
      <Navbar view={view} setView={setView} />
      {view === "home" ? (
        <Dashboard onLaunch={() => setView("predictor")} />
      ) : (
        <PredictorWorkspace onBack={() => setView("home")} />
      )}
    </div>
  );
}
