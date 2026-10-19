"use client";

import { useEffect } from "react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  highlightId: string | null;
  action?: () => void;
}

interface TutorialData {
  steps: TutorialStep[];
}

export const motherboardTutorial: TutorialData = {
  steps: [
    {
      id: "intro",
      title: "Welcome to the Motherboard Tour",
      description: "This interactive 3D model shows you all the key components of a modern gaming motherboard. Click on any highlighted component to learn more about its function and installation.",
      highlightId: null,
    },
    {
      id: "cpu",
      title: "CPU Socket",
      description: "The CPU (Central Processing Unit) is the brain of your computer. This socket holds the processor and connects it to all other components.",
      highlightId: "cpu-socket",
    },
    {
      id: "memory",
      title: "Memory Slots (RAM)",
      description: "These slots hold your system's RAM (Random Access Memory). More and faster RAM means your computer can handle more tasks simultaneously.",
      highlightId: "ram-slots",
    },
    {
      id: "gpu",
      title: "Graphics Card Slot",
      description: "This is where you install a dedicated graphics card for gaming, video editing, or 3D rendering work.",
      highlightId: "pcie-x16-main",
    },
    {
      id: "storage",
      title: "Storage (M.2 SSD)",
      description: "Modern motherboards use M.2 NVMe SSDs that are much faster than traditional hard drives for your operating system and games.",
      highlightId: "m2-slot-1",
    },
    {
      id: "power",
      title: "Power Connections",
      description: "The VRM (Voltage Regulator Module) converts power from your PSU into clean, stable voltage for your CPU.",
      highlightId: "vrm-heatsink",
    },
    {
      id: "connectivity",
      title: "Connectivity Panel",
      description: "The rear I/O panel provides USB, Ethernet, audio, and wireless connections for all your peripherals.",
      highlightId: "rear-io",
    },
  ],
};

export const hardDiskTutorial: TutorialData = {
  steps: [
    {
      id: "intro",
      title: "Hard Disk Drive (HDD) Tutorial",
      description: "Traditional hard disk drives store data on spinning magnetic platters. They're slower than SSDs but more affordable for large storage needs.",
      highlightId: null,
    },
    {
      id: "platters",
      title: "Internal Platters",
      description: "Data is stored on these spinning magnetic disks. Modern HDDs can have multiple platters stacked inside.",
      highlightId: "platters",
    },
    {
      id: "heads",
      title: "Read/Write Heads",
      description: "These tiny arms hover over the platters to read and write data. They move across the surface without touching it.",
      highlightId: "heads",
    },
    {
      id: "motor",
      title: "Spindle Motor",
      description: "This motor spins the platters at high speeds (typically 5400-7200 RPM for consumer drives).",
      highlightId: "motor",
    },
    {
      id: "interface",
      title: "SATA Interface",
      description: "The connector at the back provides both power (15-pin) and data (7-pin) connections to the motherboard.",
      highlightId: "connector",
    },
  ],
};

interface TutorialCardProps {
  data: TutorialData;
  currentStep: number;
  onStepChange: (step: number) => void;
  highlightComponent: (id: string | null) => void;
  onClose: () => void;
}

export function TutorialCard({ data, currentStep, onStepChange, highlightComponent, onClose }: TutorialCardProps) {
  const step = data.steps[currentStep];
  
  useEffect(() => {
    if (step.highlightId) {
      highlightComponent(step.highlightId);
    } else {
      highlightComponent(null);
    }
  }, [step.highlightId, highlightComponent]);

  return (
    <div className="tutorial-card">
      <div className="tutorial-header">
        <h2>{step.title}</h2>
        <button onClick={onClose} className="tutorial-close">×</button>
      </div>
      <p className="tutorial-description">{step.description}</p>
      <div className="tutorial-progress">
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          ← Previous
        </button>
        <span>{currentStep + 1} / {data.steps.length}</span>
        <button
          onClick={() => onStepChange(Math.min(data.steps.length - 1, currentStep + 1))}
          disabled={currentStep === data.steps.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export const styles = `
  .tutorial-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    padding: 24px;
    max-width: 380px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }

  .tutorial-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .tutorial-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  .tutorial-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    line-height: 1;
  }

  .tutorial-description {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .tutorial-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tutorial-progress button {
    padding: 8px 16px;
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    color: #1f2937;
    transition: background 0.2s;
  }

  .tutorial-progress button:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .tutorial-progress button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .tutorial-progress span {
    font-size: 13px;
    color: #6b7280;
  }
`;
