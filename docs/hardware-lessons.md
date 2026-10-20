# Interactive hardware lessons

The existing Next.js / React Three Fiber motherboard page remains intact. The top navigation adds three lessons: a 3.5-inch SATA HDD, a 2.5-inch SATA SSD, and an ATX PC tower. Motherboard components now also have numbered buttons.

## Models and content

The three added models are original procedural Three.js geometry, not downloaded manufacturer scans. No Sketchfab account, external viewer, model download, API key, or third-party model licence is required. These are representative educational cutaways, not dimensionally exact product replicas.

- HDD: enclosure, platter stack, spindle/hub, screws, actuator arm/head, voice-coil assembly, underside controller PCB, SATA contacts. Motion is deliberately slow and illustrative.
- SSD: enclosure, NAND packages, controller, DRAM, power components, PCB and SATA contacts. This is explicitly SATA, not NVMe. Not all SSDs contain DRAM.
- Tower: chassis, motherboard, CPU location under a finned cooler, RAM, GPU and fans, PSU exterior, SATA SSD bay and front fans. The PSU interior is never exposed.

Each lesson has numbered 3D hotspots, synchronized keyboard-accessible parts buttons, explanation/example/handling guidance, next/previous controls, enclosure controls, camera reset, visit count and a knowledge check. Numbered annotations remain visible when rotating; the underside controller is explicitly identified in its label. Motion starts paused. The renderer uses local studio lighting, capped pixel density, and only mounts the selected lesson's scene. WebGL failures preserve access to the lesson text and parts list.

## Files

- `src/components/hardware/lessons.ts`: typed lesson text and hotspot coordinates.
- `src/components/hardware/Models.tsx`: original model geometry.
- `src/components/hardware/ModelAnnotation.tsx`: projected, keyboard-accessible numbered labels with safe cleanup on scene changes.
- `src/components/hardware/HardwareScene.tsx`: renderer, lighting, orbit controls and failure boundary.
- `src/components/hardware/HardwareLesson.tsx`: learning flow and interaction state.
- `src/components/hardware/hardware.css`: responsive lesson styles scoped to hardware classes.
- `src/app/page.tsx`: lesson navigation; existing motherboard lesson retained.
- `src/components/canvas/MotherboardModel.tsx`: numbered motherboard buttons.

## Validation

`npx tsc --noEmit`, `npm run lint`, and a clean `npm run build` passed. Chromium checks passed for all three new lessons: numbered selection, next-part navigation, closing/reopening enclosures, hiding/showing numbers, motion controls, reset, quiz feedback, mobile overflow at 390px, and returning to the motherboard. There were no browser runtime errors in that run. Desktop and mobile screenshots were inspected. No dependencies were changed.

## Applying the supplied patch

Prepared against upstream `cbc826b4391481526efa7fe42f3f0f8388a6a436` on `main`.

From a clean local checkout of `3d-hardware-tutorials`, put the patch in the repository root, then run:

```sh
git switch -c feature/interactive-hardware
git apply --check interactive-hardware.patch
git apply interactive-hardware.patch
npm ci
npm run dev
```

If the check reports a conflict, stop and reconcile the current files; do not force overwrites. Review the four lessons at localhost:3000 before committing and pushing. GitHub integration refused branch creation with HTTP 403, so these changes have not been pushed or deployed.
