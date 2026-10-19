export type ComponentCategory =
  | "Processor"
  | "Memory"
  | "Expansion"
  | "Storage"
  | "Power"
  | "Cooling"
  | "Connectivity"
  | "Enclosure"
  | "Electronics"
  | "Mechanical"
  | "Storage Medium";

export interface MotherboardComponentData {
  id: string;
  name: string;
  category: ComponentCategory;
  shortDescription: string;
  fullDescription: string;
  installationSteps: string[];
  specs: { label: string; value: string }[];
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  highlightColor?: string;
}

export interface HardDiskComponentData {
  id: string;
  name: string;
  category: ComponentCategory;
  shortDescription: string;
  fullDescription: string;
  installationSteps: string[];
  specs: { label: string; value: string }[];
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  highlightColor?: string;
}

export interface CanvasSettings {
  autoRotate: boolean;
  enableZoom: boolean;
  enableRotate: boolean;
  enablePan: boolean;
  showGrid: boolean;
  showAxes: boolean;
  wireframe: boolean;
}

export interface MotherboardCanvasProps {
  selectedId?: string | null;
  onSelectComponent?: (component: MotherboardComponentData | null) => void;
  className?: string;
  initialSettings?: Partial<CanvasSettings>;
  height?: string | number;
}
