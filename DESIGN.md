---
name: 3DHV object explorer
description: A quiet, object-led hardware study table.
colors:
  paper: "#fafbf8"
  stage: "#e9ede6"
  ink: "#1d3025"
  muted: "#5e6d60"
  accent: "#245d3b"
  highlight: "#d7ed9d"
  surface: "#f0f3ec"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(36px, 3.6vw, 60px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "31px"
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "14px"
    lineHeight: 1.7
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "13px"
rounded:
  surface: "6px"
  action: "4px"
  navigation: "24px"
  circle: "50%"
spacing:
  compact: "8px"
  small: "12px"
  medium: "16px"
  section: "24px"
  wide: "40px"
components:
  button-start:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "15px 18px"
    width: "100%"
  navigation-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.navigation}"
    padding: "12px 17px"
  viewer-control:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "39px"
    height: "39px"
  hardware-pin:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "31px"
    height: "31px"
  model-stage:
    backgroundColor: "{colors.stage}"
    rounded: "{rounded.surface}"
---

# Design System: 3DHV

## Overview

**Creative North Star: "The hardware study table"**

A quiet, object-led explorer where the model carries the visual weight and one inspector explains the selected part. Pale green surfaces echo circuit-board materials without competing with the hardware. The original split-volume logo suggests looking inside a component.

Interaction references are Lusion's 3D storytelling, Bruno Simon's direct object exploration, and NASA Eyes' selection/focus/detail loop. Their compositions are not copied. Further explanation, quizzes, and credits appear progressively to keep the workspace spacious.

**Key Characteristics:**

- A dominant model stage and a compact inspector.
- Dark green text, pale green surfaces, and restrained lime actions.
- Numbered selection shared by the model and component directory.
- Locally served Geist, flat surfaces, and circular viewer controls.

## Colors

The palette combines warm green paper with dark forest ink.

### Primary

- **Action green** (`accent`) marks focus, selected components, and interactive detail.
- **Lime highlight** (`highlight`) draws attention to the first-part action and text selection.

### Neutral

- **Paper** provides the page and viewer-control background.
- **Stage** distinguishes the model workspace.
- **Ink** carries primary text and selected navigation backgrounds.
- **Muted ink** carries supporting descriptions and labels.
- **Secondary surface** groups quiz content, directory selection, and supporting controls.

**The Selection Rule.** Reserve strong filled states for the current device, view, or component so selection stays legible.

## Typography

Geist is locally served through Next.js and assigned through the `--font-geist-sans` variable, with a sans-serif fallback. Medium-weight headings and tight tracking give the workspace a concise technical voice.

The display and inspector title roles are defined above. Inspector explanations use the body role; introductory and role descriptions use 15px text. Controls primarily use the label role. Captions and footer text resolve to 13px through the final stylesheet override.

At 800px and below, the display is 42px; at 520px and below it is 37px. Inspector headings are 27px at the 1100px breakpoint and 30px on phones. The selected component number sits inline in a circular badge beside its title.

## Layout

The header, main, and footer share a maximum width of 1600px. Outer padding is 40px, then 24px at 1100px, 20px at 800px, and 16px at 520px.

The desktop workspace pairs a flexible model stage with a 330px inspector and a 30px gap. At 1100px the inspector is 270px with a 22px gap; at 1700px and above it is 360px with a 40px gap. The desktop stage sticks 20px below the viewport top.

At 800px and below, the stage sits above a two-column inspector and has a 570px height. At 520px and below, the stage is 440px high, the inspector becomes one column, and its component directory uses two columns. Device navigation moves to its own horizontally scrollable row. Mobile component selection scrolls the description into view. Real phone touch feel still requires hardware verification.

## Elevation & Depth

The interface uses tonal separation rather than card shadows. The three-dimensional model supplies depth. Numbered model pins alone have a small ambient shadow (`0 2px 7px #20322624`); selected pins gain a translucent lime outline.

Buttons transition over 160ms and press to 96% scale. Detail entries reveal over 260ms; introductory entries use 480–500ms. Continuous model motion starts disabled, is offered for the tower and HDD, and respects reduced-motion preference. Reduced motion also removes interface animations and transitions.

## Shapes

Large model surfaces have gently curved corners. The start action and quiz container use the smaller action radius. Device navigation and view switches use pill shapes; model annotations, pagination, and viewer controls are circular. The custom split-volume mark is an original SVG used in both header and footer.

## Components

### Navigation

Device buttons have transparent backgrounds and muted text; the active device uses ink on paper-colored text. Front, Rear, and Inside share a compact pill switch for the tower. Hover treatment applies only to fine pointers that support hover.

### Buttons

The full-width lime action introduces the first component. Circular viewer controls reset the view, toggle numbers, and control supported motion. All keyboard-focused controls receive a 2px action-green outline with a 5px offset.

### Model stage

The stage groups the model, a small object label, applicable view or cover controls, and rotation guidance. The motherboard is a photograph-based layered reconstruction with attribution in About the lab; it is not manufacturer CAD. Other models are representative educational geometry. See `public/references/CREDITS.md`.

### Component inspector and directory

Model pins and directory rows share selection. Selection reveals one title, role, and explanation, with examples and handling notes behind a disclosure. The number is inline with the title, not a separate eyebrow. Previous and next controls traverse the parts. The directory can collapse independently and uses a green numbered badge for its selected row.

### Progressive content

The explorer links to a separate test page rather than embedding a quiz. Credits and model limitations appear in About the lab. These supporting sections do not compete with the initial model view.

### Navigation and testing

A muted left sidebar holds hardware routes, Test mode and two visibly locked future entries. Troubleshoot uses an original black crossed-tools icon on yellow. On phones, navigation moves into a native dialog with a close button and keyboard focus containment.

Above 1100px with a fine pointer, the sidebar rests as a 76px icon rail and expands to 244px on hover or visible keyboard focus. It overlays the content so the 3D canvas does not resize during navigation. Each hardware route has its own icon; future features retain small lock badges. Labels fade in with a 240ms width transition, disabled for reduced-motion preferences. Touch-only larger screens retain the full sidebar.

At 1100px and below, navigation uses the menu drawer and the model takes the full content width. Tablet component details sit beside the parts directory; phone details stack underneath the viewer. At narrow phone widths, tower view controls occupy their own row and test settings stack. Landscape viewers use a shorter stage. Safe-area padding protects edge content; coarse-pointer controls have larger targets, selects use 16px text and model hints describe pinch zoom. Checks cover 320, 390, 768, 1024 and 844px landscape widths in browser emulation; physical-device validation remains outstanding.

Test mode uses the existing green, warm-white and Geist vocabulary in Operate mode. Setup groups native topic checkboxes and difficulty/length selects. Active sessions show one question at a time, with a slim progress indicator and one primary action. Photo questions use lettered locations on the official motherboard reference; matching uses selects and ordering uses keyboard-accessible movement buttons. Feedback uses text as well as color. Results provide topic scores and expandable answer explanations without adding competing panels to the explorer.

## Do's and Don'ts

### Do:

- **Do** keep the model and one selected explanation visually dominant.
- **Do** keep selection synchronized between the model and directory.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** describe the photographic motherboard and representative geometry honestly.

### Don't:

- **Don't** add decorative marketing sections or repeated instructional panels to the explorer.
- **Don't** replace inline component numbers with decorative heading eyebrows.
- **Don't** enable continuous model motion by default.
- **Don't** present the motherboard reconstruction as an exact scan or CAD model.
