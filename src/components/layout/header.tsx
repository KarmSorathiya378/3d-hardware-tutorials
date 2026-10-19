import React from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow-sm">
            3D
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              3DHV
            </h1>
            <p className="text-xs text-slate-500">3D Visualization Platform</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Next.js + Tailwind CSS
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
