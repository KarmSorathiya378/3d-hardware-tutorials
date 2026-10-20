"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { DEVICES, getParts, type HardwareDevice, type TowerView } from "./explorer-data";
import { LogoMark } from "@/components/layout/BrandMark";
export { LogoMark } from "@/components/layout/BrandMark";
import "./explorer.css";

const Scene = dynamic(() => import("./ExplorerScene"), {
  ssr: false,
  loading: () => <div className="scene-loading"><LogoMark /><span>Preparing your workspace…</span></div>,
});
const subscribeMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Icon({ name }: { name: "reset" | "numbers" | "play" | "pause" | "arrow" | "close" | "rotate" | "expand" }) {
  const paths = {
    reset: <><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/></>,
    numbers: <><path d="m9 3-2 18M17 3l-2 18M3 9h18M2 15h18"/></>,
    play: <path d="m8 4 12 8-12 8Z"/>,
    pause: <><path d="M8 4v16M16 4v16"/></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    rotate: <><path d="M4 10a8 5 0 1 1 2 6M4 4v6h6M12 6v12"/></>,
    expand: <><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function HardwareExplorer({ initialDevice = "motherboard" }: { initialDevice?: HardwareDevice }) {
  const device = initialDevice;
  const [view, setView] = useState<TowerView>("front");
  const [selected, setSelected] = useState<string | null>(null);
  const [focusVersion, setFocusVersion] = useState(0);
  const [labels, setLabels] = useState(true);
  const [motion, setMotion] = useState(false);
  const [open, setOpen] = useState(true);
  const [partsOpen, setPartsOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, () => false);
  const info = DEVICES.find(item => item.id === device)!;
  const parts = getParts(device, view);
  const partIndex = parts.findIndex(item => item.id === selected);
  const part = parts[partIndex];
  useEffect(() => {
    if (selected && window.matchMedia("(max-width: 1100px)").matches) {
      detailRef.current?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "nearest" });
    }
  }, [selected, reducedMotion]);

  function select(id: string) {
    setSelected(id);
    setFocusVersion(value => value + 1);
    if (device === "hdd" || device === "ssd") setOpen(true);
  }
  function changeView(next: TowerView) {
    setView(next);
    setSelected(null);
    setFocusVersion(value => value + 1);
  }
  function reset() { setSelected(null); setFocusVersion(value => value + 1); }

  return <div className="explorer">
    <a href="#explore" className="skip-link">Skip to hardware explorer</a>
    <header className="site-header">
      <span className="explorer-section-name">Explore hardware / {info.name}</span>
      <button className="about-button" aria-expanded={aboutOpen} onClick={() => setAboutOpen(value => !value)}>About the lab <span aria-hidden="true">↗</span></button>
    </header>

    {aboutOpen && <section className="about-lab">
      <div><h2>A little curiosity goes a long way.</h2><p>3DHV is a hands-on guide to the computer on your desk. Rotate a model, choose a number, and discover what each part does.</p></div>
      <div><p>The motherboard is a layered 3D study using an <a href="https://www.asus.com/motherboards-components/motherboards/proart/proart-x870e-creator-wifi/" target="_blank" rel="noreferrer">official ASUS ProArt reference image</a>. The other models are representative educational constructions. Their layouts may differ from your PC.</p><p>Interaction research: <a href="https://lusion.co/" target="_blank" rel="noreferrer">Lusion</a>, <a href="https://bruno-simon.com/" target="_blank" rel="noreferrer">Bruno Simon</a>, and <a href="https://science.nasa.gov/eyes/" target="_blank" rel="noreferrer">NASA Eyes</a>.</p></div>
      <button className="icon-button" aria-label="Close about the lab" onClick={() => setAboutOpen(false)}><Icon name="close"/></button>
    </section>}

    <main id="explore">
      <div className="explorer-intro">
        <h1 key={device}>{info.title}</h1>
        <p>{info.description}<br/><span>Pick a number. Follow your curiosity.</span></p>
      </div>

      <div className="explorer-workspace" data-ui>
        <section className="model-stage" aria-label={`${info.name} interactive 3D viewer`}>
          <div className="stage-topline">
            <div className="object-label"><span className="live-dot"/>{info.name}<small>{device === "tower" ? `${view === "rear" ? "Back panel" : view === "inside" ? "Under the side panel" : "Front panel"}` : device === "motherboard" ? "Rotate to see the layers" : open ? "Inside the enclosure" : "Enclosure closed"}</small></div>
            {device === "tower" ? <div className="view-switch" aria-label="PC tower view">
              {(["front", "rear", "inside"] as const).map(item => <button key={item} aria-pressed={view === item} onClick={() => changeView(item)}>{item === "rear" ? "Rear" : item === "inside" ? "Inside" : "Front"}</button>)}
            </div> : device !== "motherboard" ? <button className="surface-button" aria-pressed={open} onClick={() => setOpen(value => !value)}>{open ? "Close cover" : "Open cover"}</button> : <span className="stage-reference">ProArt X870E</span>}
          </div>

          <div className="model-canvas" key={device}>
            <Scene device={device} view={view} selected={selected} focusVersion={focusVersion} onSelect={select} open={open} motion={motion} labels={labels} reducedMotion={reducedMotion}/>
          </div>

          <div className="stage-bottomline">
            <span className="drag-hint"><Icon name="rotate"/><span className="mouse-hint">Drag to rotate · Scroll to zoom</span><span className="touch-hint">Drag to rotate · Pinch to zoom</span></span>
            <div className="viewer-tools">
              <button className="icon-button" onClick={reset} aria-label="Reset view" title="Reset view"><Icon name="reset"/></button>
              <button className="icon-button" onClick={() => setLabels(value => !value)} aria-pressed={labels} aria-label={labels ? "Hide numbers" : "Show numbers"} title={labels ? "Hide numbers" : "Show numbers"}><Icon name="numbers"/></button>
              {(device === "tower" || device === "hdd") && <button className="icon-button" onClick={() => setMotion(value => !value)} aria-pressed={motion} disabled={reducedMotion} aria-label={motion ? "Pause motion" : "Play motion"} title={reducedMotion ? "Motion disabled by your device preference" : motion ? "Pause motion" : "Play motion"}><Icon name={motion ? "pause" : "play"}/></button>}
            </div>
          </div>
        </section>

        <aside className="inspector-panel" aria-label="Component information">
          <div ref={detailRef} className="inspector-content" aria-live="polite" aria-atomic="true">
            {part ? <article key={`${device}-${view}-${part.id}`} className="part-detail">
              <div className="detail-heading"><h2><span className="part-number">{partIndex + 1}</span>{part.name}</h2><button className="icon-button" onClick={reset} aria-label="Close component details"><Icon name="close"/></button></div>
              <p className="part-role">{part.role}</p>
              <p className="part-explanation">{part.explanation}</p>
              <details className="learn-more"><summary>A little more detail <span>+</span></summary><p>{part.example}</p><p className="handling-note">{part.tip}</p></details>
              <div className="part-pagination">
                <button aria-label="Previous component" onClick={() => select(parts[(partIndex - 1 + parts.length) % parts.length].id)}><span className="reverse-arrow"><Icon name="arrow"/></span></button>
                <span>{partIndex + 1} <span className="muted">of {parts.length} parts</span></span>
                <button aria-label="Next component" onClick={() => select(parts[(partIndex + 1) % parts.length].id)}><Icon name="arrow"/></button>
              </div>
            </article> : <div className="inspector-welcome">
              <span className="welcome-symbol"><Icon name="expand"/></span>
              <h2>Look closer.</h2>
              <p>Select a number on the model to bring a component into focus.</p>
              <button className="start-button" onClick={() => select(parts[0].id)}>Explore the first part <Icon name="arrow"/></button>
              {device === "tower" && <p className="tower-note">The tower is the system unit. The CPU is the processor chip inside it.</p>}
            </div>}
          </div>

          <div className="parts-directory">
            <button className="parts-toggle" aria-expanded={partsOpen} aria-controls="parts-list" onClick={() => setPartsOpen(value => !value)}><span>All components <small>{parts.length}</small></span><span>{partsOpen ? "−" : "+"}</span></button>
            {partsOpen && <ol id="parts-list" className="parts-list">{parts.map((item,index) => <li key={item.id}><button aria-pressed={selected === item.id} onClick={() => select(item.id)}><span>{index+1}</span>{item.name}<span className="part-list-arrow">↗</span></button></li>)}</ol>}
          </div>
        </aside>
      </div>

      <div className="workspace-caption"><p>{info.model}</p><p>Made for exploring. Built for understanding.</p></div>
      <div className="explore-test-link"><p>Ready to put your knowledge to work?</p><Link href="/test">Open test mode <Icon name="arrow"/></Link></div>
    </main>
    <footer className="site-footer"><span className="footer-brand"><LogoMark/>A different way to see your computer.</span><button onClick={() => { setAboutOpen(true); window.scrollTo({top:0,behavior: reducedMotion ? "instant" : "smooth"}); }}>Credits & references <span aria-hidden="true">↗</span></button></footer>
  </div>;
}
