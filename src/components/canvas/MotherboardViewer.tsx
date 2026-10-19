"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MOTHERBOARD_COMPONENTS } from "./motherboard-data";
import { MotherboardComponentData } from "./types";

// Dynamic import with SSR disabled to prevent WebGL hydration mismatches in Next.js
const MotherboardCanvas = dynamic(
  () => import("./MotherboardCanvas").then((mod) => mod.MotherboardCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-3" />
        <span className="text-xs font-medium text-slate-600">
          Initializing 3D Canvas Engine...
        </span>
      </div>
    ),
  }
);

export function MotherboardViewer() {
  const [selectedComp, setSelectedComp] = useState<MotherboardComponentData | null>(
    MOTHERBOARD_COMPONENTS[0] // Start with CPU Socket selected by default
  );

  const currentIndex = selectedComp
    ? MOTHERBOARD_COMPONENTS.findIndex((c) => c.id === selectedComp.id)
    : -1;

  const handleNext = () => {
    if (currentIndex < MOTHERBOARD_COMPONENTS.length - 1) {
      setSelectedComp(MOTHERBOARD_COMPONENTS[currentIndex + 1]);
    } else {
      setSelectedComp(MOTHERBOARD_COMPONENTS[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedComp(MOTHERBOARD_COMPONENTS[currentIndex - 1]);
    } else {
      setSelectedComp(MOTHERBOARD_COMPONENTS[MOTHERBOARD_COMPONENTS.length - 1]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* 3D Canvas Area */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <MotherboardCanvas
            selectedId={selectedComp?.id}
            onSelectComponent={(comp) => setSelectedComp(comp)}
            height="560px"
          />
        </div>

        {/* Quick Component Selection Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
            Components:
          </span>
          {MOTHERBOARD_COMPONENTS.map((comp) => {
            const isSelected = selectedComp?.id === comp.id;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedComp(comp)}
                className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition-all text-xs ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {comp.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Inspector & Tutorial Guide */}
      <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-h-[560px]">
        {selectedComp ? (
          <div className="flex flex-col flex-1">
            {/* Header / Category Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                {selectedComp.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} of {MOTHERBOARD_COMPONENTS.length}
              </span>
            </div>

            {/* Title & Short Description */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {selectedComp.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {selectedComp.fullDescription}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Technical Specifications
              </h4>
              <dl className="space-y-1.5 text-xs">
                {selectedComp.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-0.5">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Step-by-Step Installation Guide */}
            <div className="mt-5 flex-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Assembly &amp; Installation Steps
              </h4>
              <ol className="space-y-2 text-xs text-slate-600">
                {selectedComp.installationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Step Walkthrough Navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                onClick={() => setSelectedComp(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear Selection
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 shadow-sm"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center text-center p-4">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600 mb-3 border border-blue-100">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Select a Motherboard Component
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
              Click on any component directly on the 3D motherboard (e.g. CPU socket, RAM slots, PCIe lanes, or M.2 shield) or choose from the list to view detailed specs and installation tutorials.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {MOTHERBOARD_COMPONENTS.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedComp(c)}
                  className="rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default MotherboardViewer;
