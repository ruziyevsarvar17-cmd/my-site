import { useEffect, useRef, useState } from "react";

const FEATURES = [
  { tag: "BASELINE", title: "It learns what normal looks like for your machine", body: "After a few days it builds a behavioral profile — typical CPU, RAM, temperature and network traffic. Nothing is judged against a generic threshold; everything is compared with your machine's own history." },
  { tag: "ANOMALY", title: "It notices drift, not just high numbers", body: "Task Manager tells you CPU is at 92%. AI Sentinel tells you that is far above where this machine usually sits at this hour, and that RAM and network moved with it." },
  { tag: "ROOT CAUSE", title: "It points at a likely cause, not just a symptom", body: "When a metric spikes, it cross-checks running processes and ranks the most probable source, so you are not guessing which background task is responsible." },
  { tag: "PREDICTION", title: "It projects where the trend is heading", body: "By reading recent telemetry as a time series it estimates a risk score and a rough window — clearly labeled as a model estimate, not a guarantee." },
  { tag: "MEMORY", title: "It gets sharper after every incident", body: "Tag what happened — a crash, a slowdown, overheating — and it stores that next to the telemetry that preceded it, building a dataset of your machine's failure patterns." },
];

const STEPS = [
  { t: "Collect", b: "A lightweight agent samples CPU, RAM, disk, temperature, network and processes every few seconds." },
  { t: "Learn", b: "Over the first days it builds a profile of what is typical for your machine, hour by hour." },
  { t: "Compare", b: "New readings are checked against that profile, not a fixed threshold." },
  { t: "Predict", b: "A model reads the recent trend and estimates a risk score and time window." },
  { t: "Recommend", b: "You get a plain-language explanation, a likely cause and what to check first." },
];

const PLATFORMS = [
  { name: "Windows", file: "AI-Sentinel-Setup.exe", ready: true },
  { name: "macOS", file: "AI-Sentinel.dmg", ready: false },
  { name: "Linux", file: "AI-Sentinel.AppImage", ready: false },
];

function useDemoTelemetry() {
  const [cpu, setCpu] = useState<number[]>([40, 42, 39, 44, 41, 43, 40, 42, 45, 41, 43, 42]);
  const [ram, setRam] = useState(58);
  const n = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      n.current += 1;
      const phase = n.current % 24;
      const spike = phase >= 16 && phase < 21;
      const next = spike ? 82 + Math.random() * 13 : 36 + Math.random() * 16;
      setCpu((prev) => [...prev, next].slice(-12));
      setRam(spike ? 74 + Math.random() * 6 : 55 + Math.random() * 6);
    }, 1500);
    return () => clearInterval(id);
  }, []);
  const cpuNow = cpu[cpu.length - 1];
  const anomaly = cpuNow > 75;
  const health = Math.max(0, Math.min(100, Math.round(100 - (cpuNow * 0.45 + ram * 0.35) - (anomaly ? 10 : 0))));
  return { cpu, cpuNow, ram, anomaly, health };
}

function Panel() {
  const { cpu, cpuNow, ram, anomaly, health } = useDemoTelemetry();
  const points = cpu.map((v, i) => `${((320 / 11) * i).toFixed(1)},${(70 - (v / 100) * 60).toFixed(1)}`).join(" ");
  return (
    <div className="panel">
      <div className="panel__head">
        <span>SYSTEM HEALTH — DEMO</span>
        <span className={anomaly ? "dot dot--warn" : "dot"} />
      </div>
      <div className="score"><b>{health}</b><span>/100</span></div>
      <svg className="trace" viewBox="0 0 320 80" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} />
      </svg>
      <div className="readouts">
        <div><small>CPU</small><span>{Math.round(cpuNow)}%</span></div>
        <div><small>RAM</small><span>{Math.round(ram)}%</span></div>
        <div><small>RISK</small><span>{anomaly ? "HIGH" : "LOW"}</span></div>
      </div>
      <div className={anomaly ? "alert alert--warn" : "alert"}>
        <i />
        <div>
          <h4>{anomaly ? "Anomaly detected" : "No anomalies detected"}</h4>
          <p>{anomaly ? <>CPU far above this machine's baseline — likely cause: <code>chrome_helper.exe</code></> : "Behavior matches the learned baseline."}</p>
        </div>
      </div>
      <p className="panel__note">Simulated data for demonstration</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <header className="nav">
        <a href="#top" className="nav__brand">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 11h3.2l1.6-4.5 2.4 9 1.8-4.5H18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          AI Sentinel
        </a>
        <nav className="nav__links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </nav>
        <a href="#download" className="btn btn--small">Download</a>
      </header>

      <main>
        <section id="top" className="hero">
          <div>
            <h1>Your computer already shows the signs.<br />AI Sentinel learns to read them.</h1>
            <p className="hero__lede">It watches how your machine normally behaves, catches the moment it drifts from that baseline, and tells you what is likely causing it — before a slowdown turns into a failure.</p>
            <div className="hero__actions">
              <a href="#download" className="btn btn--primary">Download for Windows</a>
              <a href="#how" className="btn btn--ghost">See how it works</a>
            </div>
            <dl className="hero__stats">
              <div><dt>Watches</dt><dd>CPU · RAM · disk · network · temperature</dd></div>
              <div><dt>Learns</dt><dd>a baseline unique to your machine</dd></div>
              <div><dt>Warns</dt><dd>roughly 30–60 min before critical load</dd></div>
            </dl>
          </div>
          <Panel />
        </section>

        <section id="features" className="section">
          <div className="head">
            <h2>Not another Task Manager</h2>
            <p>Standard monitoring shows a number. AI Sentinel explains why the number matters and what is likely to happen next.</p>
          </div>
          {FEATURES.map((f) => (
            <div className="row" key={f.tag}>
              <span className="row__tag">{f.tag}</span>
              <div><h3>{f.title}</h3><p>{f.body}</p></div>
            </div>
          ))}
        </section>

        <section id="how" className="section">
          <div className="head">
            <h2>From raw telemetry to a recommendation</h2>
            <p>Five steps, running continuously in the background.</p>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li className="step" key={s.t}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                <h3>{s.t}</h3>
                <p>{s.b}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="download" className="section">
          <div className="head">
            <h2>Get AI Sentinel</h2>
            <p>Free while in development. The desktop app runs locally — your telemetry stays on your machine unless you choose to sync it.</p>
          </div>
          <div className="platforms">
            {PLATFORMS.map((p) => (
              <div className="platform" key={p.name}>
                <div><b>{p.name}</b><small>{p.file}</small></div>
                {p.ready ? <a href="#" className="btn btn--primary btn--small">Download</a> : <em>Coming soon</em>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>AI Sentinel</span>
        <span>Diagnostics &amp; prediction platform · thesis project</span>
      </footer>
    </>
  );
}
