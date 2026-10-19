/**
 * Core type definitions for 3DHV
 */

export interface ModelMetadata {
  id: string;
  name: string;
  description?: string;
  format: "gltf" | "glb" | "obj" | "fbx";
  createdAt: string;
}

export interface ViewportSettings {
  fov: number;
  wireframe: boolean;
  autoRotate: boolean;
  backgroundColor: string;
}
