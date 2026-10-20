"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { LogoMark } from "./BrandMark";
import "./shell.css";

function NavIcon({ type }: { type: "explore" | "board" | "tower" | "disk" | "ssd" | "test" | "lock" | "people" | "tools" | "menu" | "close" }) {
  const shapes = {
    explore: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></>,
    board: <><rect x="4" y="3" width="16" height="18" rx="2"/><rect x="8" y="7" width="5" height="5" rx=".5"/><path d="M16 6v7M7 16h10M7 18h6"/></>,
    tower: <><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 6h6M9 9h6M9 18h6"/><circle cx="12" cy="14" r="1"/></>,
    disk: <><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="11" r="5"/><circle cx="12" cy="11" r="1"/><path d="m16 16-4-5M7 18h3"/></>,
    ssd: <><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M7 18v3M10 18v3M13 18v3M16 18v3"/><rect x="7" y="8" width="10" height="6" rx="1"/></>,
    test: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10l2 2 4-4M8 16h8"/></>,
    lock: <><rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/></>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5"/></>,
    tools: <><path d="m4 3 5 4-2 2-4-5Zm4 5 11 11M17 3l-2 4 2 2 4-2a5 5 0 0 1-6 5L6 21l-3-3 9-9a5 5 0 0 1 5-6Z"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[type]}</svg>;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  const nav = <>
    <Link className="shell-brand" href="/" onClick={close} aria-label="3DHV home"><LogoMark/><span>3dhv.</span></Link>
    <nav className="shell-nav" aria-label="Main navigation">
      <Link href="/" onClick={close} className="shell-nav-link" aria-label="Explore hardware" data-active={pathname !== "/test"}><NavIcon type="explore"/><span>Explore hardware</span></Link>
      <div className="shell-hardware-links">
        {([["Motherboard", "/motherboard","board"],["PC tower", "/pc-tower","tower"],["Hard disk", "/hard-disk","disk"],["Solid-state drive", "/ssd","ssd"]] as const).map(([label,href,icon]) => <Link key={href} href={href} onClick={close} aria-label={label} aria-current={pathname === href || (href === "/motherboard" && pathname === "/") ? "page" : undefined}><NavIcon type={icon}/><span>{label}</span></Link>)}
      </div>
      <Link href="/test" onClick={close} className="shell-nav-link test-nav-link" aria-label="Test mode" aria-current={pathname === "/test" ? "page" : undefined}><NavIcon type="test"/><span>Test mode</span></Link>
      <div className="shell-future">
        <button type="button" disabled className="shell-locked" aria-label="Troubleshoot, locked, coming soon">
          <span className="hazard-symbol"><NavIcon type="tools"/></span><span>Troubleshoot<small>Coming soon</small></span><NavIcon type="lock"/>
        </button>
        <button type="button" disabled className="shell-locked" aria-label="Pioneers and creators, locked, coming soon">
          <NavIcon type="people"/><span>Pioneers & creators<small>Coming soon</small></span><NavIcon type="lock"/>
        </button>
      </div>
    </nav>
    <div className="sidebar-note"><span className="sidebar-dot"/>The hardware learning lab<p>Look closer.<br/>Build your understanding.</p></div>
  </>;
  return <div className="app-shell">
    <aside className="app-sidebar">{nav}</aside>
    <div className="mobile-shell-bar"><Link href="/" className="shell-brand" aria-label="3DHV home"><LogoMark/><span>3dhv.</span></Link><button onClick={() => dialog.current?.showModal()} aria-label="Open navigation"><NavIcon type="menu"/></button></div>
    <dialog ref={dialog} className="mobile-navigation" aria-label="Navigation"><button className="close-navigation" onClick={close} aria-label="Close navigation"><NavIcon type="close"/></button>{nav}</dialog>
    <div className="app-content">{children}</div>
  </div>;
}
