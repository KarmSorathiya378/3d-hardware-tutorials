import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4">
                Workspace Initialized
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                3DHV Visualization Engine
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                A high-performance 3D visualization framework built with Next.js, TypeScript, and Tailwind CSS.
                Designed with a clean, professional white theme ready for Three.js &amp; WebGL acceleration.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary">Launch Viewport</Button>
                <Button variant="outline">Settings</Button>
              </div>
            </div>
          </div>

          {/* Feature Grid / Placeholder for Viewport and Controls */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 3D Viewport Container */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-800">
                    3D Canvas Viewport
                  </span>
                </div>
                <span className="text-xs text-slate-400">R3F / Three.js Ready</span>
              </div>

              <div className="my-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                <div className="rounded-full bg-white p-4 shadow-sm border border-slate-200 mb-3">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">Canvas Stage</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Ready for Three.js canvas integration, scene lighting, orbit controls, and mesh rendering.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span>Coordinates: [0.0, 0.0, 0.0]</span>
                <span>Renderer: WebGL</span>
              </div>
            </div>

            {/* Quick Stats / Info Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
                  System Architecture
                </h3>
                <dl className="mt-4 space-y-4">
                  <div className="flex justify-between text-xs">
                    <dt className="text-slate-500">Framework</dt>
                    <dd className="font-medium text-slate-800">Next.js 16 (App Router)</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-slate-500">Language</dt>
                    <dd className="font-medium text-slate-800">TypeScript 5</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-slate-500">Styling</dt>
                    <dd className="font-medium text-slate-800">Tailwind CSS 4</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-slate-500">Theme</dt>
                    <dd className="font-medium text-blue-600">Professional White / Light</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-slate-500">Status</dt>
                    <dd className="font-medium text-emerald-600">Ready for Modules</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-700">Scaffold Directories</p>
                <p className="text-xs text-slate-500 mt-1">
                  <code>@/components/canvas</code>, <code>@/components/ui</code>, <code>@/lib</code>, <code>@/types</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          3DHV &copy; 2026 &bull; Professional Light Theme
        </div>
      </footer>
    </div>
  );
}
