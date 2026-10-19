"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { MOTHERBOARD_COMPONENTS, MotherboardComponentData } from "@/components/canvas";
import { Button } from "@/components/ui/button";

// Dynamic import with SSR disabled to ensure WebGL context initializes safely in browser
const MotherboardCanvas = dynamic(
  () => import("@/components/canvas/MotherboardCanvas").then((mod) => mod.MotherboardCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-blue-600 border-t-transparent mb-3" />
        <span className="text-sm font-medium text-slate-700">Initializing 3D Hardware Canvas...</span>
        <span className="text-xs text-slate-400 mt-1">Loading Three.js shaders and geometry</span>
      </div>
    ),
  }
);

// Builder tips dictionary keyed by component ID
const BUILDER_TIPS: Record<string, string> = {
  "cpu-socket":
    "Crucial: Never touch the socket gold contact pins directly. Align the golden triangle marking on the CPU package with the embossed arrow on the socket cover. Zero downward force is needed when placing the chip.",
  "ram-slots":
    "When installing 2 memory sticks in a 4-slot board, always populate slots 2 and 4 (A2 and B2) first. Modern memory controllers require this layout to enable high-speed DDR5 XMP/EXPO stability.",
  "pcie-x16-main":
    "Ensure you remove the case slot covers before lowering the graphics card. Listen for the plastic retention clip clicking into place, and always secure the chassis bracket screws to prevent GPU sag.",
  "pcie-x16-secondary":
    "This slot communicates via the motherboard chipset bus rather than direct CPU lanes. Ideal for capture cards, 10GbE network cards, or internal sound processors.",
  "m2-slot-1":
    "Remember to peel off the blue plastic protective film from the bottom thermal silicone pad before reinstalling the aluminum heatsink, or drive temperatures will overheat.",
  "vrm-heatsink":
    "The 16+1+1 power delivery heatsink stays cool through chassis airflow. Ensure at least one case intake fan directs airflow across the upper VRM fins.",
  "chipset":
    "The Platform Controller Hub (PCH) runs passively cooled. Do not cover the lower heatsink with loose case wiring or excess cables.",
  "rear-io":
    "This motherboard features an integrated I/O shield. When lowering the motherboard into the chassis, angle it rearward first to seat the ports into the rear opening without bending grounding springs.",
  "atx-24pin":
    "The 24-pin cable requires substantial insertion pressure. Support the back of the motherboard PCB with your fingers while pushing down until the plastic locking tab latches over the lip.",
  "eps-8pin":
    "Connect this cable BEFORE mounting large dual-tower air coolers or top radiator exhaust fans, as the top-left corner of the case becomes extremely tight once cooling is installed.",
  "sata-ports":
    "Use latching SATA data cables with locking clips to prevent drives from disconnecting during transport or vibration.",
  "audio-section":
    "The audio circuitry is electrically isolated from the main ground plane to eliminate buzz and electromagnetic interference from high-frequency GPU clocks.",
};

// Recommended chronological build order
const BUILD_ORDER = [
  "cpu-socket",
  "ram-slots",
  "m2-slot-1",
  "vrm-heatsink",
  "rear-io",
  "eps-8pin",
  "atx-24pin",
  "sata-ports",
  "pcie-x16-main",
  "pcie-x16-secondary",
  "chipset",
  "audio-section",
];

const CATEGORIES = [
  "All",
  "Processor",
  "Memory",
  "Storage",
  "Expansion",
  "Power",
  "Cooling",
  "Connectivity",
] as const;

export default function Home() {
  const [selectedCompId, setSelectedCompId] = useState<string | null>("cpu-socket");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [completedComponents, setCompletedComponents] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"tutorial" | "specs">("tutorial");

  const viewerSectionRef = useRef<HTMLDivElement>(null);
  const tutorialSectionRef = useRef<HTMLDivElement>(null);

  // Active selected component object
  const activeComponent = useMemo(() => {
    return MOTHERBOARD_COMPONENTS.find((c) => c.id === selectedCompId) || null;
  }, [selectedCompId]);

  // Filtered components based on category and search query
  const filteredComponents = useMemo(() => {
    return MOTHERBOARD_COMPONENTS.filter((comp) => {
      const matchesCategory =
        activeCategory === "All" || comp.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Progress calculations
  const totalComponents = MOTHERBOARD_COMPONENTS.length;
  const completedCount = Object.values(completedComponents).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalComponents) * 100);

  // Handle selection from 3D Canvas or annotation list
  const handleSelectComponent = useCallback((comp: MotherboardComponentData | null) => {
    setSelectedCompId(comp ? comp.id : null);
  }, []);

  const handleNextComponent = () => {
    const currentIndex = MOTHERBOARD_COMPONENTS.findIndex((c) => c.id === selectedCompId);
    if (currentIndex < MOTHERBOARD_COMPONENTS.length - 1) {
      setSelectedCompId(MOTHERBOARD_COMPONENTS[currentIndex + 1].id);
    } else {
      setSelectedCompId(MOTHERBOARD_COMPONENTS[0].id);
    }
  };

  const handlePrevComponent = () => {
    const currentIndex = MOTHERBOARD_COMPONENTS.findIndex((c) => c.id === selectedCompId);
    if (currentIndex > 0) {
      setSelectedCompId(MOTHERBOARD_COMPONENTS[currentIndex - 1].id);
    } else {
      setSelectedCompId(MOTHERBOARD_COMPONENTS[MOTHERBOARD_COMPONENTS.length - 1].id);
    }
  };

  const toggleComponentCompleted = (id: string) => {
    setCompletedComponents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleStepCompleted = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const scrollToViewer = () => {
    viewerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTutorial = () => {
    tutorialSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Header Section */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm ring-4 ring-blue-500/10">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">3DHV</h1>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                  Motherboard Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Interactive 3D Hardware Assembly Guide</p>
            </div>
          </div>

          {/* Quick Header Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={scrollToViewer}
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>3D Viewport</span>
            </button>
            <button
              onClick={scrollToTutorial}
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tutorial Guide</span>
            </button>
            <a
              href="#specs-matrix"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              System Specs
            </a>
            <a
              href="#builder-faq"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Builder FAQ
            </a>
          </nav>

          {/* Right Header Status & Action Controls */}
          <div className="flex items-center gap-3">
            {/* Assembly Progress Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-1.5 border border-slate-200 text-xs">
              <span className="font-medium text-slate-500">Assembly:</span>
              <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-slate-800 tabular-nums">{progressPercent}%</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCompId(MOTHERBOARD_COMPONENTS[0].id)}
              className="hidden lg:inline-flex text-xs font-medium cursor-pointer"
            >
              Restart Guide
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={scrollToTutorial}
              className="text-xs font-medium cursor-pointer shadow-sm shadow-blue-500/20"
            >
              Inspect Active Part
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* 2. Hero Introduction Section */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle geometric background motif */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 h-64 w-64 rounded-full bg-slate-100/50 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Next-Gen Motherboard Architecture (LGA 1700 / DDR5 / PCIe 5.0)
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Professional 3D Hardware Visualizer &amp; Component Guide
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Explore the anatomy of a modern workstation motherboard in an interactive, hardware-accelerated 3D environment.
              Click components directly inside the 3D viewport or browse the annotations below to learn technical specifications,
              high-speed bus routing, and precision assembly tutorials.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900">12</span>
                <span className="text-xs font-medium text-slate-500">Interactive Components</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-blue-600">128 GB/s</span>
                <span className="text-xs font-medium text-slate-500">PCIe 5.0 x16 Bandwidth</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900">192 GB</span>
                <span className="text-xs font-medium text-slate-500">Max DDR5 Memory</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-emerald-600">16+1+1</span>
                <span className="text-xs font-medium text-slate-500">Digital Power Stages</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Main 3D Viewer Area (Canvas with OrbitControls) */}
        <section ref={viewerSectionRef} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Interactive 3D Hardware Viewport
                </h3>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Live WebGL
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Orbit controls enabled: rotate with left mouse drag, zoom with scroll wheel, pan with right click.
              </p>
            </div>

            {/* Selected Component Quick Tag */}
            {activeComponent && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 border border-slate-200 shadow-2xs text-xs">
                <span className="text-slate-400 font-medium">Active Selection:</span>
                <span className="font-bold text-blue-600">{activeComponent.name}</span>
                <button
                  type="button"
                  onClick={() => handleSelectComponent(null)}
                  className="ml-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear selection"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* 3D Canvas Box */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <MotherboardCanvas
              selectedId={selectedCompId}
              onSelectComponent={handleSelectComponent}
              height="600px"
              className="border-none shadow-none rounded-2xl"
            />
          </div>

          {/* Quick Component Selection Strip directly below canvas */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs w-full lg:w-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Quick Jump:
              </span>
              {MOTHERBOARD_COMPONENTS.map((comp) => {
                const isSelected = selectedCompId === comp.id;
                const isCompleted = completedComponents[comp.id];
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handleSelectComponent(comp)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition-all text-xs cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
                        : "bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {isCompleted && (
                      <span className="text-[10px]">{isSelected ? "✓" : "●"}</span>
                    )}
                    <span>{comp.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={scrollToTutorial}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer ml-auto"
            >
              <span>View Full Assembly Steps</span>
              <span>&darr;</span>
            </button>
          </div>
        </section>

        {/* 4. Interactive Tutorial Section with Clickable Component Annotations */}
        <section ref={tutorialSectionRef} className="space-y-6 pt-4">
          {/* Section Heading & Category Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Interactive Component Tutorial &amp; Annotations
                </h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                  {filteredComponents.length} {filteredComponents.length === 1 ? "Module" : "Modules"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Click any component card to highlight and center it in the 3D viewport, read in-depth engineering specifications, and follow the step-by-step assembly tutorial.
              </p>
            </div>

            {/* Search Input & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setViewMode("tutorial")}
                  className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    viewMode === "tutorial"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tutorial Mode
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("specs")}
                  className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    viewMode === "specs"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Spec Sheet
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            {CATEGORIES.map((category) => {
              const isCatActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3.5 py-1.5 font-medium transition-all cursor-pointer ${
                    isCatActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Interactive Tutorial Workspace: Left Clickable Component Annotations Grid + Right Detailed Inspector */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* Left Column: Clickable Component Annotation Cards (7 cols on LG) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredComponents.map((comp) => {
                const isSelected = selectedCompId === comp.id;
                const isCompleted = completedComponents[comp.id];
                const buildStepIndex = BUILD_ORDER.indexOf(comp.id) + 1;

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      handleSelectComponent(comp);
                      scrollToViewer();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelectComponent(comp);
                      }
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-left ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                    }`}
                  >
                    {/* Top Row: Category Badge + Build Sequence Marker */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200/80">
                          {comp.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {buildStepIndex > 0 && (
                            <span className="text-[10px] font-mono text-slate-400">
                              Step {buildStepIndex}
                            </span>
                          )}
                          {isCompleted ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                              ✓
                            </span>
                          ) : (
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isSelected ? "bg-blue-600 animate-ping" : "bg-slate-300"
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Component Title */}
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {comp.name}
                      </h4>

                      {/* Short Description */}
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {comp.shortDescription}
                      </p>
                    </div>

                    {/* Bottom Metadata & Focus Hint */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400">
                        {comp.specs[0]?.label}: {comp.specs[0]?.value}
                      </span>
                      <span
                        className={`font-semibold transition-colors ${
                          isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      >
                        {isSelected ? "Selected in 3D" : "Click to Focus &rarr;"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredComponents.length === 0 && (
                <div className="col-span-2 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                  <p className="text-sm font-medium">No motherboard components match your filter.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-3 text-xs"
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Detailed Tutorial & Inspector Card (5 cols on LG) */}
            <div className="lg:col-span-5 sticky top-20 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {activeComponent ? (
                <div className="flex flex-col space-y-5">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                          {activeComponent.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {activeComponent.id}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleComponentCompleted(activeComponent.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer border ${
                          completedComponents[activeComponent.id]
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{completedComponents[activeComponent.id] ? "✓ Completed" : "Mark Done"}</span>
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-3">
                      {activeComponent.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {activeComponent.fullDescription}
                    </p>
                  </div>

                  {/* Mode: Tutorial Steps View */}
                  {viewMode === "tutorial" ? (
                    <>
                      {/* Step by Step Assembly Instructions */}
                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Assembly &amp; Installation Sequence
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {activeComponent.installationSteps.length} Steps
                          </span>
                        </div>

                        <ol className="space-y-2.5 text-xs text-slate-700">
                          {activeComponent.installationSteps.map((step, idx) => {
                            const stepKey = `${activeComponent.id}-step-${idx}`;
                            const isDone = !!completedSteps[stepKey];

                            return (
                              <li
                                key={idx}
                                onClick={() => toggleStepCompleted(stepKey)}
                                className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors cursor-pointer border ${
                                  isDone
                                    ? "bg-white border-emerald-200 text-slate-500 line-through"
                                    : "bg-white border-slate-200/80 hover:border-slate-300"
                                }`}
                              >
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${
                                    isDone
                                      ? "bg-emerald-600 text-white"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {isDone ? "✓" : idx + 1}
                                </span>
                                <span className="leading-snug">{step}</span>
                              </li>
                            );
                          })}
                        </ol>
                      </div>

                      {/* Builder Tip Box */}
                      {BUILDER_TIPS[activeComponent.id] && (
                        <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80">
                          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Pro Builder Tip</span>
                          </div>
                          <p className="text-xs leading-relaxed text-amber-900">
                            {BUILDER_TIPS[activeComponent.id]}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Mode: Dense Technical Spec Sheet */
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Hardware Specifications Matrix
                      </h4>
                      <dl className="divide-y divide-slate-200/60 text-xs">
                        {activeComponent.specs.map((spec, i) => (
                          <div key={i} className="flex justify-between py-2">
                            <dt className="text-slate-500 font-medium">{spec.label}</dt>
                            <dd className="font-semibold text-slate-800 text-right">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Component Navigation Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevComponent}
                      className="text-xs cursor-pointer"
                    >
                      &larr; Prev
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={scrollToViewer}
                        className="text-xs cursor-pointer"
                      >
                        Center in 3D
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleNextComponent}
                        className="text-xs cursor-pointer"
                      >
                        Next &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 mb-3 border border-blue-100">
                    <svg
                      className="h-8 w-8"
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
                  <h4 className="text-base font-bold text-slate-900">Select a Component</h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
                    Click any annotation card on the left or click directly on the 3D motherboard to view installation steps and electrical specifications.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedCompId(MOTHERBOARD_COMPONENTS[0].id)}
                    className="mt-4 text-xs cursor-pointer"
                  >
                    Select CPU Socket
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. System Architecture & Comparison Matrix Section */}
        <section id="specs-matrix" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              System Architecture &amp; Motherboard Technical Standards
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Comprehensive hardware specifications for the ATX form factor reference platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Form Factor</span>
              <h5 className="text-sm font-bold text-slate-900 mt-1">ATX Standard</h5>
              <p className="text-xs text-slate-600 mt-1">
                305 mm &times; 244 mm (12 in &times; 9.6 in) with 9-point chassis standoff grounding mounting pattern.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">CPU Power Delivery</span>
              <h5 className="text-sm font-bold text-slate-900 mt-1">16+1+1 Digital VRM</h5>
              <p className="text-xs text-slate-600 mt-1">
                Dual 8-pin EPS 12V connectors delivering 90A smart power stages with high-fin aluminum heatsinks.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Memory Architecture</span>
              <h5 className="text-sm font-bold text-slate-900 mt-1">Quad DDR5 DIMM</h5>
              <p className="text-xs text-slate-600 mt-1">
                Dual-channel 128-bit bus with XMP 3.0 / EXPO overclocking profiles up to 8000+ MT/s.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">High-Speed I/O</span>
              <h5 className="text-sm font-bold text-slate-900 mt-1">PCIe Gen 5.0</h5>
              <p className="text-xs text-slate-600 mt-1">
                Direct CPU link delivering 128 GB/s bidirectional throughput for GPUs and PCIe 5.0 M.2 NVMe SSDs.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Builder FAQ & Assembly Best Practices */}
        <section id="builder-faq" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Frequently Asked Builder Questions &amp; Troubleshooting
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Essential tips and safety advice to avoid damaged pins, improper seating, and component faults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-200/80 p-4.5 bg-slate-50/40">
              <h5 className="font-bold text-slate-900 text-sm">
                How much pressure should I expect when closing the CPU socket lever?
              </h5>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Modern LGA 1700 and AM5 sockets require a surprising amount of lever pressure to compress 1,700 pins against the CPU pads. As long as the golden triangle marker is perfectly aligned and the CPU is seated flat with zero slant, firm downward resistance on the retention arm is completely normal.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4.5 bg-slate-50/40">
              <h5 className="font-bold text-slate-900 text-sm">
                Why does DDR5 RAM take a long time to boot on first power-up?
              </h5>
              <p className="mt-2 text-slate-600 leading-relaxed">
                This is known as memory training. On first boot, the motherboard BIOS tests electrical signal timings and impedance across high-frequency memory channels. This process can take between 1 to 3 minutes before display output appears. Do not interrupt or cycle the power switch during this phase.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4.5 bg-slate-50/40">
              <h5 className="font-bold text-slate-900 text-sm">
                Do I need to plug in both the 8-pin and 4-pin CPU EPS cables?
              </h5>
              <p className="mt-2 text-slate-600 leading-relaxed">
                For standard gaming and non-overclocked CPUs, a single 8-pin EPS cable provides up to 384 watts of continuous 12V current—well above normal CPU demands. However, if you are running flagship chips (e.g. Core i9 or Ryzen 9) or aggressive overclocking profiles, connecting both cables is strongly recommended for lower wire temperatures.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4.5 bg-slate-50/40">
              <h5 className="font-bold text-slate-900 text-sm">
                What is the golden rule for tool-less M.2 thermal pads?
              </h5>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Always peel away the transparent or blue protective plastic film from the pre-applied thermal silicone pad on the heatsink bottom before fastening. Leaving this plastic barrier in place will insulate heat inside the drive, causing thermal throttling and high temperatures.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer Section */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">3DHV Studio</span>
            <span>&bull;</span>
            <span>Next.js 16 &bull; Three.js &bull; Tailwind CSS 4</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>WebGL 2.0 Accelerated</span>
            </span>
            <span>&bull;</span>
            <span>Clean Professional White Theme</span>
          </div>

          <p className="text-slate-400">
            &copy; 2026 3DHV. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
